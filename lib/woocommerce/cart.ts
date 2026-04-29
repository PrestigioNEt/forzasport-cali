/**
 * WOOCOMMERCE CART API
 * Funciones para interactuar con el carrito de WooCommerce
 */

import { woocommerceFetch } from './index';
import { getCartQuery } from './queries/cart';
import { addToCartMutation } from './mutations/cart';

/**
 * Extraer ID numérico de un relay ID de WPGraphQL
 * Los IDs de WPGraphQL vienen en formato base64: "cG9zdDoxMDI=" (post:102)
 */
function extractDatabaseId(relayId: string): number {
  try {
    // Decodificar base64
    const decoded = Buffer.from(relayId, 'base64').toString('utf-8');

    // Extraer el número después de los dos puntos
    // Formato: "product:123" o "product_variation:456"
    const match = decoded.match(/:(\d+)$/);

    if (match && match[1]) {
      return parseInt(match[1], 10);
    }

    // Si no coincide el formato, intentar extraer dígitos directamente
    const digits = relayId.replace(/\D/g, '');
    if (digits) {
      return parseInt(digits, 10);
    }

    throw new Error('No se pudo extraer el ID');
  } catch (error) {
    console.error('Error extracting database ID:', error);
    throw new Error(`ID inválido: ${relayId}`);
  }
}

export interface CartItem {
  key: string;
  product: {
    node: {
      id: string;
      slug: string;
      name: string;
      price?: string;
      image?: {
        sourceUrl?: string;
        altText?: string;
      };
    };
  };
  variation?: {
    node: {
      id: string;
      name: string;
      price?: string;
      image?: {
        sourceUrl?: string;
        altText?: string;
      };
    };
  };
  quantity: number;
  subtotal: string;
  total: string;
}

export interface Cart {
  contents: {
    nodes: CartItem[];
  };
  subtotal: string;
  total: string;
  shippingTotal: string;
  discountTotal: string;
  feeTotal: string;
}

/**
 * Obtener el carrito actual
 */
export async function getCart(): Promise<Cart | null> {
  try {
    const res = await woocommerceFetch<any>({
      query: getCartQuery
    });

    return res.body.data.cart;
  } catch (error) {
    console.error('Error fetching cart:', error);
    return null;
  }
}

/**
 * Agregar producto al carrito
 */
export async function addToCart(
  productId: number | string,
  quantity: number = 1,
  variationId?: number | string
): Promise<{ success: boolean; cart?: Cart; error?: string }> {
  try {
    // Extraer ID numérico si es un relay ID de WPGraphQL
    let numericProductId: number;
    if (typeof productId === 'string') {
      numericProductId = extractDatabaseId(productId);
    } else {
      numericProductId = productId;
    }

    const res = await woocommerceFetch<any>({
      query: addToCartMutation,
      variables: {
        productId: numericProductId,
        quantity
      }
    });

    const result = res.body.data.addToCart;

    // Usar el carrito que viene en la respuesta (ya tiene los datos actualizados)
    if (result?.cart) {
      return { success: true, cart: result.cart };
    }

    // Si no hay cart en la respuesta, hubo un error
    return { success: false, error: 'No se pudo agregar al carrito' };
  } catch (error: any) {
    console.error('Error adding to cart:', error);
    return { success: false, error: error.message || 'Error al agregar al carrito' };
  }
}

/**
 * Actualizar cantidad de un item del carrito
 */
export async function updateCartItem(
  key: string,
  quantity: number
): Promise<{ success: boolean; cart?: Cart; error?: string }> {
  try {
    console.log('🔄 Actualizando item:', { key, quantity });

    const res = await woocommerceFetch<any>({
      query: `
        mutation updateCartItem($key: ID!, $quantity: Int!) {
          updateItemQuantities(input: { items: [{ key: $key, quantity: $quantity }] }) {
            cart {
              contents {
                nodes {
                  key
                  quantity
                  product {
                    node {
                      id
                      name
                    }
                  }
                }
              }
              subtotal
              total
              shippingTotal
              discountTotal
            }
          }
        }
      `,
      variables: { key, quantity }
    });

    console.log('✅ Mutación ejecutada correctamente');

    // Usar el carrito de la respuesta
    const updatedCart = res.body.data.updateItemQuantities?.cart;
    if (updatedCart) {
      console.log('🛒 Carrito actualizado:', updatedCart.contents.nodes.length, 'items');
      return { success: true, cart: updatedCart };
    }

    return { success: false, error: 'No se pudo actualizar el carrito' };
  } catch (error: any) {
    console.error('❌ Error updating cart item:', error);
    return { success: false, error: error.message || 'Error al actualizar el carrito' };
  }
}

/**
 * Remover un item del carrito
 */
export async function removeCartItem(
  key: string
): Promise<{ success: boolean; cart?: Cart; error?: string }> {
  try {
    console.log('🗑️ Eliminando item:', key);

    const res = await woocommerceFetch<any>({
      query: `
        mutation removeItem($key: ID!) {
          removeItemsFromCart(input: { keys: [$key] }) {
            cart {
              contents {
                nodes {
                  key
                  quantity
                  product {
                    node {
                      id
                      name
                    }
                  }
                }
              }
              subtotal
              total
              shippingTotal
              discountTotal
            }
          }
        }
      `,
      variables: { key }
    });

    console.log('✅ Item eliminado correctamente');

    // Usar el carrito de la respuesta
    const updatedCart = res.body.data.removeItemsFromCart?.cart;
    if (updatedCart) {
      console.log('🛒 Carrito actualizado:', updatedCart.contents.nodes.length, 'items');
      return { success: true, cart: updatedCart };
    }

    return { success: false, error: 'No se pudo eliminar del carrito' };
  } catch (error: any) {
    console.error('❌ Error removing cart item:', error);
    return { success: false, error: error.message || 'Error al eliminar del carrito' };
  }
}

/**
 * Limpiar el carrito completo
 */
export async function clearCart(): Promise<{ success: boolean; error?: string }> {
  try {
    await woocommerceFetch<any>({
      query: `
        mutation {
          emptyCart {
            clientMutationId
          }
        }
      `
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error clearing cart:', error);
    return { success: false, error: error.message || 'Error al limpiar el carrito' };
  }
}

/**
 * Calcular número total de items en el carrito
 */
export function getCartItemCount(cart: Cart | null): number {
  if (!cart) return 0;
  return cart.contents.nodes.reduce((total, item) => total + item.quantity, 0);
}

/**
 * Formatear precio para mostrar
 */
export function formatPrice(price: string | undefined): string {
  if (!price) return '$0';
  return price; // WooCommerce ya devuelve el precio formateado
}

'use server';

import { TAGS } from 'lib/constants';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import {
  addToCartMutation,
  updateCartItemMutation
} from '@/lib/woocommerce/mutations/cart';
import { getCartQuery } from '@/lib/woocommerce/queries/cart';

/**
 * NOTA: WooCommerce usa session-based cart, no cartId como Shopify
 * El carrito se maneja en el servidor de WordPress
 */

/**
 * Agregar item al carrito de WooCommerce
 */
export async function addItem(
  prevState: unknown,
  productId: string,
  quantity: number = 1
) {
  try {
    const productIdNum = parseInt(productId);

    const response = await fetch(`${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: addToCartMutation,
        variables: {
          productId: productIdNum,
          quantity: quantity
        }
      })
    });

    const result = await response.json();

    if (result.errors) {
      return {
        error: result.errors[0]?.message || 'Error adding item to cart',
        status: 'error'
      };
    }

    revalidateTag(TAGS.cart);

    return {
      success: true,
      message: 'Item added to cart'
    };
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error adding item to cart:', error);
    }
    return {
      error: error.message || 'Unknown error',
      status: 'error'
    };
  }
}

/**
 * Remover item del carrito
 * NOTA: WooCommerce no tiene mutation nativa para remover
 * Se usa quantity: 0 para eliminar
 */
export async function removeItem(
  prevState: unknown,
  merchandiseId: string
) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: updateCartItemMutation,
        variables: {
          items: [
            {
              key: merchandiseId,
              quantity: 0
            }
          ]
        }
      })
    });

    const result = await response.json();

    if (result.errors) {
      return {
        error: result.errors[0]?.message || 'Error removing item from cart',
        status: 'error'
      };
    }

    revalidateTag(TAGS.cart);

    return {
      success: true,
      message: 'Item removed from cart'
    };
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error removing item from cart:', error);
    }
    return {
      error: error.message || 'Unknown error',
      status: 'error'
    };
  }
}

/**
 * Actualizar cantidad de item
 */
export async function updateItemQuantity(
  prevState: unknown,
  payload: {
    merchandiseId: string;
    quantity: number;
  }
) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: updateCartItemMutation,
        variables: {
          items: [
            {
              key: payload.merchandiseId,
              quantity: payload.quantity
            }
          ]
        }
      })
    });

    const result = await response.json();

    if (result.errors) {
      return {
        error: result.errors[0]?.message || 'Error updating item quantity',
        status: 'error'
      };
    }

    revalidateTag(TAGS.cart);

    return {
      success: true,
      message: 'Cart updated'
    };
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error updating item quantity:', error);
    }
    return {
      error: error.message || 'Unknown error',
      status: 'error'
    };
  }
}

/**
 * Obtener el carrito actual de WooCommerce
 */
export async function getCartAction() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: getCartQuery
      })
    });

    const result = await response.json();

    if (result.errors) {
      if (process.env.NODE_ENV === 'development') {
        console.error('GraphQL cart errors:', result.errors);
      }
      return null;
    }

    const cart = result.data?.cart;

    if (!cart || !cart.contents || cart.contents.nodes.length === 0) {
      return null;
    }

    return cart;
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching cart:', error);
    }
    return null;
  }
}

/**
 * Obtener URL de checkout
 * NOTA: Por ahora retorna null porque WooCommerce no tiene checkoutUrl nativo como Shopify
 * Más adelante se implementará checkout personalizado
 */
export async function getCheckoutUrl(): Promise<string | null> {
  // TODO: Implementar checkout personalizado
  // Por ahora retorna null
  return null;
}

/**
 * Crear carrito y guardar cookie (compatibilidad con modal)
 * NOTA: WooCommerce usa session-based cart, no crea carrito como Shopify
 * Esta función es solo para compatibilidad con el componente existente
 */
export async function createCartAndSetCookie() {
  // WooCommerce maneja el carrito vía sesión del servidor
  // No necesitamos crear ni guardar cartId como Shopify
  // Esta función se deja vacía por compatibilidad
}

/**
 * WOOCOMMERCE CART MUTATIONS
 * Mutations actualizadas para WPGraphQL + WooCommerce
 */

export const addToCartMutation = `
# Agregar producto al carrito (Simple Product)
mutation addToCart($productId: Int!, $quantity: Int) {
  addToCart(input: {
    productId: $productId
    quantity: $quantity
  }) {
    cart {
      contents {
        nodes {
          key
          quantity
          product {
            node {
              id
              name
              slug
              ... on SimpleProduct {
                price
                image {
                  sourceUrl
                  altText
                }
              }
              ... on VariableProduct {
                price
                image {
                  sourceUrl
                  altText
                }
              }
            }
          }
          variation {
            node {
              id
              name
              price
              image {
                sourceUrl
                altText
              }
            }
          }
          subtotal
          total
        }
      }
      subtotal
      total
      shippingTotal
      discountTotal
      feeTotal
    }
    clientMutationId
  }
}
`;

export const updateCartItemMutation = `
# Actualizar items del carrito (CORREGIDO: updateItemQuantities)
mutation updateCartItems($items: [CartItemInput!]!) {
  updateItemQuantities(input: {
    items: $items
  }) {
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
    }
    clientMutationId
  }
}
`;


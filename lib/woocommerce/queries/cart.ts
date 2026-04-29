/**
 * WOOCOMMERCE CART QUERIES
 */

export const getCartQuery = `
# Obtener carrito actual
query getCart {
  cart {
    contents {
      nodes {
        key
        product {
          node {
            id
            slug
            name
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
        quantity
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
}
`;

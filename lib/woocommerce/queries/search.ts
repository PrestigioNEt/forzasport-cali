/**
 * WOOCOMMERCE SEARCH QUERIES
 */

export const getSearchProductsQuery = `
# Búsqueda de productos
query searchProducts($search: String!) {
  products(where: {search: $search}, first: 20) {
    nodes {
      id
      slug
      name
      description
      ... on SimpleProduct {
        price
        regularPrice
        image {
          sourceUrl
          altText
        }
      }
      ... on VariableProduct {
        price
        regularPrice
        image {
          sourceUrl
          altText
        }
      }
    }
  }

  # También buscar categorías
  productCategories(where: {search: $search}, first: 5) {
    nodes {
      id
      slug
      name
    }
  }
}
`;

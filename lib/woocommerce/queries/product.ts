/**
 * WOOCOMMERCE PRODUCT QUERIES
 */

export const getProductQuery = `
# Obtener producto por slug
query getProduct($slug: ID!) {
  product(id: $slug, idType: SLUG) {
    __typename
    id
    databaseId
    slug
    name
    shortDescription
    description
    modified
    ... on SimpleProduct {
      price
      regularPrice
      salePrice
      stockStatus
      attributes {
        nodes {
          name
          options
        }
      }
      image {
        sourceUrl
        altText
      }
      galleryImages {
        nodes {
          sourceUrl
          altText
        }
      }
    }
    ... on VariableProduct {
      price
      regularPrice
      salePrice
      stockStatus
      attributes {
        nodes {
          name
          options
        }
      }
      image {
        sourceUrl
        altText
      }
      galleryImages {
        nodes {
          sourceUrl
          altText
        }
      }
      variations {
        nodes {
          id
          databaseId
          name
          price
          regularPrice
          salePrice
          stockStatus
          stockQuantity
          attributes {
            nodes {
              name
              value
            }
          }
          image {
            sourceUrl
            altText
          }
        }
      }
    }
  }
}
`;

export const getProductsQuery = `
# Listar productos
query getProducts($search: String) {
  products(where: {search: $search}, first: 20) {
    nodes {
      id
      slug
      name
      description
      ... on SimpleProduct {
        price
        regularPrice
        salePrice
        stockStatus
        image {
          sourceUrl
          altText
        }
      }
      ... on VariableProduct {
        price
        regularPrice
        salePrice
        stockStatus
        image {
          sourceUrl
          altText
        }
        variations {
          nodes {
            id
            price
            regularPrice
            stockStatus
            attributes {
              nodes {
                name
                value
              }
            }
          }
        }
      }
    }
  }
}
`;

export const getProductsByCategoryQuery = `
# Listar productos por categoría
query getProductsByCategory($category: String!) {
  products(where: {category: $category}, first: 50) {
    nodes {
      id
      slug
      name
      description
      shortDescription
      ... on SimpleProduct {
        price
        regularPrice
        salePrice
        stockStatus
        image {
          sourceUrl
          altText
        }
      }
      ... on VariableProduct {
        price
        regularPrice
        salePrice
        stockStatus
        image {
          sourceUrl
          altText
        }
      }
    }
  }
}
`;

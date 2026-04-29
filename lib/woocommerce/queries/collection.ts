/**
 * WOOCOMMERCE COLLECTION QUERIES
 */

export const getCollectionQuery = `
# Obtener colección (categoría) por slug
query getCollection($slug: ID!) {
  productCategory(id: $slug, idType: SLUG) {
    id
    slug
    name
    description
    image {
      sourceUrl
      altText
    }
  }
}
`;

export const getCollectionsQuery = `
# Listar solo categorías padre (sin subcategorías)
query getCollections {
  productCategories(where: {parent: 0}, first: 20) {
    nodes {
      id
      slug
      name
      description
      image {
        sourceUrl
        altText
      }
    }
  }
}
`;

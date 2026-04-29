// Query optimizada para búsqueda predictiva (resultados instantáneos en dropdown)
export const getPredictiveSearchQuery = /* GraphQL */ `
  query predictiveSearch($query: String!, $limit: Int = 10) {
    predictiveSearch(query: $query, limit: $limit, limitScope: EACH) {
      queries {
        text
        styledText
      }
      products {
        id
        title
        handle
        availableForSale
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        featuredImage {
          url
          altText
          width
          height
        }
      }
      collections {
        id
        title
        handle
      }
    }
  }
`;

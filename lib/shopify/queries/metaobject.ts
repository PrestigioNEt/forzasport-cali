// Query para obtener metaobjects que controlan el contenido del home

export const getMetaobjectQuery = /* GraphQL */ `
  query getMetaobject($handle: String!, $type: String!) {
    metaobject(handle: {handle: $handle, type: $type}) {
      id
      type
      handle
      fields {
        key
        value
        reference {
          ... on MediaImage {
            image {
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  }
`;

export const getMetaobjectsQuery = /* GraphQL */ `
  query getMetaobjects($type: String!, $first: Int = 10) {
    metaobjects(type: $type, first: $first) {
      edges {
        node {
          id
          type
          handle
          fields {
            key
            value
            reference {
              ... on MediaImage {
                image {
                  url
                  altText
                  width
                  height
                }
              }
            }
          }
        }
      }
    }
  }
`;

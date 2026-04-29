const fetch = require('node-fetch');

const query = `
query {
  products(first: 10) {
    nodes {
      ... on VariableProduct {
        slug
        name
        attributes {
          nodes {
            name
            options
          }
        }
        variations {
          nodes {
            name
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

async function test() {
  const res = await fetch('https://wh1255202.ispot.cc/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  const json = await res.json();
  console.log(JSON.stringify(json, null, 2));
}

test();

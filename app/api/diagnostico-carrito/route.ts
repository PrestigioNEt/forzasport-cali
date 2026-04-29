import { NextResponse } from 'next/server';

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL
  ? `${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/graphql`
  : '';

export async function GET() {
  const results = {
    endpoint: GRAPHQL_ENDPOINT,
    tests: [] as any[]
  };

  // Test 1: Verificar que el endpoint GraphQL responda
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query { __typename }`
      })
    });

    results.tests.push({
      name: 'Conexión básica al endpoint GraphQL',
      status: response.ok ? '✅ PASS' : '❌ FAIL',
      status_code: response.status,
      details: response.ok ? 'Endpoint responde correctamente' : 'Endpoint no responde'
    });
  } catch (error: any) {
    results.tests.push({
      name: 'Conexión básica al endpoint GraphQL',
      status: '❌ FAIL',
      error: error.message
    });
  }

  // Test 2: Verificar que el schema de WooCommerce esté cargado
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query {
          products(first: 1) {
            nodes {
              id
              name
            }
          }
        }`
      })
    });

    const data = await response.json();

    results.tests.push({
      name: 'Query de productos (WooCommerce Schema)',
      status: response.ok && !data.errors ? '✅ PASS' : '❌ FAIL',
      status_code: response.status,
      errors: data.errors,
      details: response.ok && !data.errors ? 'Schema de WooCommerce cargado correctamente' : 'Error en el schema'
    });
  } catch (error: any) {
    results.tests.push({
      name: 'Query de productos (WooCommerce Schema)',
      status: '❌ FAIL',
      error: error.message
    });
  }

  // Test 3: Verificar mutación addToCart (EL PROBLEMA)
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `mutation {
          addToCart(input: {productId: 1, quantity: 1}) {
            cart {
              contents {
                nodes {
                  product {
                    node {
                      name
                    }
                  }
                }
              }
            }
          }
        }`
      })
    });

    const data = await response.json();

    results.tests.push({
      name: 'Mutación addToCart',
      status: response.ok && !data.errors ? '✅ PASS' : '❌ FAIL',
      status_code: response.status,
      errors: data.errors,
      response: data,
      details: response.ok && !data.errors ? 'Mutación funciona correctamente' : 'Error en la mutación'
    });
  } catch (error: any) {
    results.tests.push({
      name: 'Mutación addToCart',
      status: '❌ FAIL',
      error: error.message
    });
  }

  // Test 4: Verificar query del carrito
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query {
          cart {
            contents {
              nodes {
                key
                quantity
              }
            }
            subtotal
            total
          }
        }`
      })
    });

    const data = await response.json();

    results.tests.push({
      name: 'Query del carrito',
      status: response.ok && !data.errors ? '✅ PASS' : '❌ FAIL',
      status_code: response.status,
      errors: data.errors,
      details: response.ok && !data.errors ? 'Query del carrito funciona' : 'Error en query del carrito'
    });
  } catch (error: any) {
    results.tests.push({
      name: 'Query del carrito',
      status: '❌ FAIL',
      error: error.message
    });
  }

  return NextResponse.json(results);
}

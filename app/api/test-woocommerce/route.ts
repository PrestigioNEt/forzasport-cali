/**
 * TEST DE CONEXIÓN WOOCOMMERCE
 *
 * Endpoint para probar que la conexión GraphQL funciona
 * GET /api/test-woocommerce
 */

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🔄 Testing WooCommerce GraphQL connection...');
    console.log('Endpoint:', process.env.NEXT_PUBLIC_WOOCOMMERCE_URL);

    // Query simple de prueba
    const simpleQuery = `
      query getProducts {
        products(first: 5) {
          nodes {
            id
            slug
            name
            ... on SimpleProduct {
              price
              regularPrice
            }
            ... on VariableProduct {
              price
              regularPrice
            }
          }
        }
      }
    `;

    const response = await fetch(`${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: simpleQuery
      })
    });

    const result = await response.json();

    if (result.errors) {
      console.error('❌ GraphQL Errors:', result.errors);
      return NextResponse.json({
        success: false,
        message: 'GraphQL query failed',
        errors: result.errors
      }, { status: 400 });
    }

    console.log('✅ Connection successful!');
    console.log('Products found:', result.data.products?.nodes.length || 0);

    return NextResponse.json({
      success: true,
      message: 'WooCommerce GraphQL connection successful!',
      data: {
        endpoint: process.env.NEXT_PUBLIC_WOOCOMMERCE_URL,
        productCount: result.data.products?.nodes.length || 0,
        products: result.data.products?.nodes.map((p: any) => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          price: p.price || 'N/A'
        })) || []
      }
    });

  } catch (error: any) {
    console.error('❌ Connection failed:', error);

    return NextResponse.json({
      success: false,
      message: 'WooCommerce GraphQL connection failed',
      error: error.message || 'Unknown error',
      details: {
        endpoint: process.env.NEXT_PUBLIC_WOOCOMMERCE_URL,
        cause: error.cause
      }
    }, { status: 500 });
  }
}

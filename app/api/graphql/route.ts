import { NextRequest, NextResponse } from 'next/server';

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL
  ? `${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/graphql`
  : '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Obtener cookies del request y pasarlas al servidor WooCommerce
    const requestCookies = request.headers.get('cookie') || '';

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(requestCookies && { Cookie: requestCookies }), // Pasar cookies para mantener sesión
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    // Crear respuesta y pasar las cookies del servidor WooCommerce al cliente
    const nextResponse = NextResponse.json(data, { status: response.status });

    // Copiar cookies de la respuesta de WooCommerce a la respuesta del cliente
    const setCookieHeaders = response.headers.getSetCookie();
    setCookieHeaders.forEach(cookie => {
      nextResponse.headers.append('Set-Cookie', cookie);
    });

    return nextResponse;
  } catch (error) {
    console.error('GraphQL Proxy error:', error);
    return NextResponse.json(
      { errors: [{ message: 'Error en el proxy GraphQL' }] },
      { status: 500 }
    );
  }
}

// Soportar OPTIONS para CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

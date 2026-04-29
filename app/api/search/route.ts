import { NextRequest, NextResponse } from 'next/server';
import { getSearchResults } from '@/lib/woocommerce';

// Función para limpiar y formatear precios CLP
const formatCLP = (amount: string | number): string => {
  let num = typeof amount === 'string' ? amount : String(amount);

  // Limpiar el string: remover puntos (separadores de miles) y comas (decimales)
  num = num.replace(/\./g, '').replace(/,/g, '');

  const parsed = parseFloat(num) || 0;
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(parsed);
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json({ products: [] });
    }

    const products = await getSearchResults(query);

    // Simplificar la respuesta para reducir el tamaño
    const simplifiedProducts = products.slice(0, 8).map(product => {
      const priceAmount = product.priceRange?.minVariantPrice?.amount || '0';
      return {
        id: product.id,
        handle: product.handle,
        title: product.title,
        price: priceAmount,
        priceDisplay: formatCLP(priceAmount),
        image: product.featuredImage?.url || '/placeholder.jpg',
        altText: product.featuredImage?.altText || product.title
      };
    });

    return NextResponse.json({ products: simplifiedProducts });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}

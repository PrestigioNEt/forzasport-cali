import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

/**
 * Endpoint de revalidación para webhooks
 * Originalmente diseñado para Shopify, adaptado para WooCommerce
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json().catch(() => ({}));
    const { type, slug } = body;

    // Revalidar paths basados en el tipo de webhook
    if (type === 'product') {
      revalidatePath('/product/[slug]');
      revalidatePath('/search');
      revalidatePath('/');
    } else if (type === 'collection') {
      revalidatePath('/search/[collection]');
      revalidatePath('/search');
      revalidatePath('/');
    }

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (error) {
    // Siempre retornar 200 para no retry el webhook
    return NextResponse.json({ revalidated: false, error: 'Invalid request' }, { status: 200 });
  }
}

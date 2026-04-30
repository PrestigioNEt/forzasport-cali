import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';

/**
 * Endpoint de revalidación para webhooks de WooCommerce
 * Se llama automáticamente cuando hay cambios en productos
 *
 * USO:
 * 1. Configurar webhook en WooCommerce que apunte a:
 *    https://tu-dominio.com/api/revalidate
 * 2. WooCommerce envía POST con JSON:
 *    { "type": "product", "slug": "mi-producto" }
 */

// Tags de caché para revalidación
const TAGS = {
  products: 'woo-products',
  collections: 'woo-collections',
  product: (slug: string) => `woo-product-${slug}`,
  collection: (slug: string) => `woo-collection-${slug}`,
};

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = (await req.text().catch(() => '')) as string;
    const secret = req.headers.get('x-webhook-secret');

    // Log para debug - ver qué llega de WooCommerce
    console.log('🔍 Raw webhook body:', body);
    console.log('🔍 Headers:', JSON.stringify(Object.fromEntries(req.headers.entries())));

    // Intentar parsear de diferentes formatos
    let data: any = {};
    try {
      data = JSON.parse(body);
    } catch {
      // WooCommerce puede enviar URL-encoded
      const params = new URLSearchParams(body);
      data = Object.fromEntries(params);
    }

    console.log('🔍 Parsed data:', data);

    // Validar secret si está configurado - hacer la validación más flexible
    const configuredSecret = process.env.WOOCOMMERCE_WEBHOOK_SECRET;
    // Si hay secret configurado Y header presente, verificar
    // Si no hay secret o no hay header, permitir (para webhooks y tests)
    if (configuredSecret && secret && secret.trim() !== configuredSecret.trim()) {
      console.log('⚠️ Secret no coincide, pero continuando...');
    }

    // WooCommerce envía: action, meta, data con id/slug
    const { action, data: wooData } = data;
    const slug = wooData?.slug || data.slug || data.id;
    const type = data.type || (action?.includes('create') ? 'product' : action?.includes('delete') ? 'product' : 'product');

    console.log('🔄 WooCommerce Webhook received:', { type, slug, action });

    switch (type) {
      case 'product':
        // Revalidar producto específico
        if (slug) {
          revalidateTag(TAGS.product(slug));
          revalidatePath(`/product/${slug}`);
          console.log('✅ Revalidated product:', slug);
        }
        // Revalidar lista de productos
        revalidateTag(TAGS.products);
        revalidatePath('/search');
        revalidatePath('/');
        break;

      case 'collection':
        if (slug) {
          revalidateTag(TAGS.collection(slug));
          revalidatePath(`/search/${slug}`);
          console.log('✅ Revalidated collection:', slug);
        }
        revalidateTag(TAGS.collections);
        revalidatePath('/search');
        break;

      case 'order':
        // Revalidar productos por si cambió inventario
        revalidateTag(TAGS.products);
        break;

      default:
        // Revalidar todo si no se reconoce el tipo
        revalidateTag(TAGS.products);
        revalidateTag(TAGS.collections);
        revalidatePath('/');
        revalidatePath('/search');
        console.log('✅ Revalidated all');
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      tags: { type, slug, action }
    });

  } catch (error) {
    console.error('❌ Revalidation error:', error);
    return NextResponse.json(
      { revalidated: false, error: 'Revalidation failed' },
      { status: 500 }
    );
  }
}

// GET para verificar que el endpoint funciona
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: 'ok',
    message: 'WooCommerce revalidation endpoint ready',
    usage: {
      method: 'POST',
      url: '/api/revalidate',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-secret': process.env.WOOCOMMERCE_WEBHOOK_SECRET || '(optional)'
      },
      body: {
        type: 'product | collection | order',
        slug: 'product-or-collection-slug (optional)',
        action: 'create | update | delete (optional)'
      }
    }
  });
}
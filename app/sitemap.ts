import { MetadataRoute } from 'next';
import { getCollections, getProducts } from 'lib/woocommerce';
import { baseUrl } from 'lib/utils';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Páginas estáticas
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8
    },
    {
      url: `${baseUrl}/terminos-del-servicio`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3
    }
  ];

  try {
    // Obtener productos dinámicos
    const products = await getProducts({});
    const productUrls = products.map((product: any) => ({
      url: `${baseUrl}/product/${product.handle}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7
    }));

    // Obtener colecciones dinámicas
    const collections = await getCollections();
    const collectionUrls = collections
      .filter((collection: any) => collection.handle)
      .map((collection: any) => ({
        url: `${baseUrl}/search/${collection.handle}`,
        lastModified: new Date(collection.updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.6
      }));

    return [...routes, ...productUrls, ...collectionUrls];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return routes;
  }
}

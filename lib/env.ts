/**
 * Validación de variables de entorno
 * Asegura que todas las variables críticas estén definidas
 */

const requiredEnvVars = [
  'SHOPIFY_STORE_DOMAIN',
  'SHOPIFY_STOREFRONT_ACCESS_TOKEN'
] as const;

const optionalEnvVars = {
  COMPANY_NAME: 'servigreen',
  SITE_NAME: 'servigreen | Vivero Online',
  NEXT_PUBLIC_VERCEL_URL: 'localhost:3000'
} as const;

// Validar variables requeridas
function validateEnv() {
  const missing: string[] = [];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      'Missing required environment variables: ' + missing.join(', ') + '\n' +
        'Please check your .env file.'
    );
  }
}

// Ejecutar validación solo en build time y runtime
if (process.env.NODE_ENV !== 'test') {
  validateEnv();
}

// Exportar env con valores por defecto
export const env = {
  SHOPIFY_STORE_DOMAIN: process.env.SHOPIFY_STORE_DOMAIN!,
  SHOPIFY_STOREFRONT_ACCESS_TOKEN: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
  COMPANY_NAME: process.env.COMPANY_NAME || optionalEnvVars.COMPANY_NAME,
  SITE_NAME: process.env.SITE_NAME || optionalEnvVars.SITE_NAME,
  NEXT_PUBLIC_VERCEL_URL:
    process.env.NEXT_PUBLIC_VERCEL_URL || optionalEnvVars.NEXT_PUBLIC_VERCEL_URL
} as const;

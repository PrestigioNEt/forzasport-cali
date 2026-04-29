# Guía de Configuración - Rusovan E-commerce

## Índice
1. [Requisitos Previos](#requisitos-previos)
2. [Configuración de WordPress](#configuración-wordpress)
3. [Configuración del Proyecto Next.js](#configuración-nextjs)
4. [Variables de Entorno](#variables-entorno)
5. [Despliegue](#despliegue)
6. [Solución de Problemas Comunes](#troubleshooting)

---

## Requisitos Previos {#requisitos-previos}

### Servicios Necesarios
- **WordPress** hosting (con acceso SSH/FTP recomendado)
- **Base de datos MySQL** (versión 5.7+ o 8.0+)
- **PHP** 8.0 o superior
- **Node.js** 18+ para desarrollo local
- **Git** para control de versiones

### Credenciales Necesarias
- Acceso administrativo a WordPress
- Acceso a base de datos WordPress
- Acceso FTP/SSH al servidor
- Credenciales de hosting (cPanel, Plesk, etc.)

---

## Configuración de WordPress {#configuración-wordpress}

### 1. Instalación de WordPress

```bash
# Descargar WordPress
wget https://wordpress.org/latest.tar.gz

# Extraer
tar -xzvf latest.tar.gz

# Mover archivos al directorio público
cp -r wordpress/* /path/to/public/html/
```

### 2. Plugins Requeridos

Instalar estos plugins **obligatorios** en orden:

#### A. WPGraphQL (Core)
```
Nombre: WPGraphQL
Versión: Latest (1.x+)
URL: https://wordpress.org/plugins/wpgraphql/
```

**Configuración:**
1. Activar plugin
2. Ir a `Configuración → GraphQL`
3. Habilitar "GraphQL API"
4. Configurar CORS (si es necesario):

```php
// En wp-config.php o en un plugin personalizado
add_filter('graphql_access_control_allow_headers', function($headers) {
    $headers[] = 'Content-Type';
    $headers[] = 'Authorization';
    return $headers;
});

add_filter('graphql_access_control_allow_origins', function($origins) {
    $origins[] = 'https://tu-dominio.com';
    $origins[] = 'http://localhost:3000';
    return $origins;
});
```

#### B. WPGraphQL for WooCommerce
```
Nombre: WPGraphQL for WooCommerce (WooGraphQL)
Versión: Latest
URL WordPress: https://wordpress.org/plugins/wpgraphql-woocommerce/
URL GitHub (Recomendado): https://github.com/wp-graphql/wpgraphql-woocommerce/releases
```

**Instalación desde GitHub (Recomendada):**
1. Ir a: https://github.com/wp-graphql/wpgraphql-woocommerce/releases
2. Descargar la última versión (ej: `wpgraphql-woocommerce.vX.X.X.zip`)
3. Ir a `Plugins → Añadir nuevo → Subir plugin`
4. Seleccionar el archivo ZIP descargado
5. Instalar y activar

**Configuración:**
1. Activar plugin
2. Ir a `WooCommerce → Ajustes → GraphQL` (o `Settings → GraphQL`)
3. Habilitar "Enable GraphQL API"
4. Habilitar "Allow anonymous cart session" (importante para carrito sin autenticación)

#### C. WooCommerce
```
Nombre: WooCommerce
Versión: Latest (8.x+)
URL: https://wordpress.org/plugins/woocommerce/
```

**Configuración Básica:**
1. Completar wizard inicial
2. Configurar moneda: `COP` (Peso Colombiano)
3. Configurar posición: `Derecha` (ej: $150.000)
4. Configurar dimensiones y peso si es necesario
5. Habilitar cálculo de impuestos si corresponde

### 3. Configuración de Permalinks

Ir a `Configuración → Enlaces Permanentes`:

```
Estructura personalizada: /%postname%/
```

Guardar cambios.

### 4. Configuración adicional en wp-config.php

Agregar antes de `/* That's all, stop editing! */`:

```php
// Deshabilitar edición de themes/plugins (seguridad)
define('DISALLOW_FILE_EDIT', true);

// Limitar revisiones de posts
define('WP_POST_REVISIONS', 3);

// Aumentar memoria
define('WP_MEMORY_LIMIT', '256M');

// Tiempo de ejecución máximo
@ini_set('max_execution_time', 300);

// CORS para GraphQL (si el filtro no funciona)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
```

---

## Configuración del Proyecto Next.js {#configuración-nextjs}

### 1. Clonar el Proyecto

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/rusovan.git
cd rusovan

# Instalar dependencias
npm install
# o
yarn install
# o
pnpm install
```

### 2. Configurar Variables de Entorno

Crear archivo `.env.local` en la raíz del proyecto:

```bash
# Variables de entorno
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
NEXT_PUBLIC_WOOCOMMERCE_URL=https://tu-wordpress.com
```

**IMPORTANTE:**
- `NEXT_PUBLIC_WOOCOMMERCE_URL` debe ser la URL del sitio WordPress
- NO incluir `/` al final
- Debe ser HTTPS en producción

### 3. Estructura de Archivos Clave

```
rusovan/
├── app/
│   ├── api/
│   │   └── graphql/
│   │       └── route.ts         # Proxy GraphQL para evitar CORS
│   ├── cart/
│   │   ├── layout.tsx           # Layout del carrito
│   │   └── page.tsx             # Página del carrito
│   ├── product/[slug]/
│   │   └── page.tsx             # Página de producto
│   ├── search/
│   │   └── page.tsx             # Página de búsqueda
│   └── layout.tsx               # Layout raíz
├── components/
│   ├── cart/
│   │   ├── CartDrawer.tsx       # Drawer lateral del carrito
│   │   └── CartIcon.tsx         # Icono con contador
│   ├── providers/
│   │   ├── CartProvider.tsx     # Contexto del carrito
│   │   └── RecentlyViewedProvider.tsx
│   └── product/
│       ├── ProductDescriptionWoo.tsx
│       └── ProductVariations.tsx
└── lib/
    └── woocommerce/
        ├── index.ts             # Cliente GraphQL
        ├── queries/             # Consultas GraphQL
        ├── mutations/           # Mutaciones (carrito)
        ├── cart.ts              # API del carrito
        └── types.ts             # Tipos TypeScript
```

### 4. Scripts Disponibles

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

---

## Variables de Entorno {#variables-entorno}

### Archivo .env.local

```bash
# Configuración del sitio
NEXT_PUBLIC_SITE_NAME=Rusovan
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com

# WooCommerce / WordPress
NEXT_PUBLIC_WOOCOMMERCE_URL=https://tu-wordpress.com

# Opcional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Opcional: Maps API (si se necesita)
NEXT_PUBLIC_MAPS_API_KEY=tu-api-key
```

### Variables en Producción (Vercel/Vercel-like)

En Vercel:
1. Ir a `Settings → Environment Variables`
2. Agregar las mismas variables SIN el prefijo `NEXT_PUBLIC_` si son del lado del servidor
3. Mantener `NEXT_PUBLIC_` para variables del lado del cliente

**Ejemplo:**
```
NEXT_PUBLIC_WOOCOMMERCE_URL = https://tienda.rusovan.com
NEXT_PUBLIC_SITE_URL = https://rusovan.com
```

---

## Despliegue {#despliegue}

### Opción 1: Vercel (Recomendado)

1. **Instalar Vercel CLI**
```bash
npm i -g vercel
```

2. **Login**
```bash
vercel login
```

3. **Desplegar**
```bash
vercel
```

4. **Configurar Variables de Entorno**
   - Ir a dashboard de Vercel
   - Settings → Environment Variables
   - Agregar variables listadas arriba

5. **Dominio Personalizado**
   - Settings → Domains
   - Agregar dominio personalizado
   - Configurar DNS según instrucciones

### Opción 2: Netlify

1. **Conectar Repositorio Git**
2. **Configurar Build**
```
Build command: npm run build
Publish directory: .next
```

3. **Variables de Entorno**
   - Site settings → Environment variables
   - Agregar las variables listadas arriba

### Opción 3: VPS Propio (DigitalOcean, AWS, etc.)

```bash
# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2
sudo npm install -g pm2

# Clonar repositorio
git clone https://github.com/tu-usuario/rusovan.git
cd rusovan

# Instalar dependencias
npm install

# Build
npm run build

# Iniciar con PM2
pm2 start npm --name "rusovan" -- start
pm2 save
pm2 startup
```

---

## Verificación del Sistema

### 1. Verificar WordPress/WooCommerce

#### Test de GraphQL API
```bash
curl -X POST https://tu-wordpress.com/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { products { nodes { id name } } }"
  }'
```

Debería retornar JSON con productos.

#### Test de WooCommerce
- Ir a `/wp-admin/admin.php?page=wc-settings`
- Verificar que WooCommerce está activo
- Crear un producto de prueba
- Verificar que aparece en GraphQL

### 2. Verificar Next.js Localmente

```bash
# Iniciar servidor de desarrollo
npm run dev

# Abrir en navegador
open http://localhost:3000
```

**Tests manuales:**
- [ ] Homepage carga correctamente
- [ ] Productos se muestran
- [ ] Página de producto funciona
- [ ] Agregar al carrito funciona
- [ ] Carrito drawer se abre
- [ ] Página /cart funciona
- [ ] Búsqueda funciona

### 3. Verificar Producción

```bash
# Test de GraphQL desde Next.js
curl -X POST https://tu-dominio.com/api/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { products { nodes { id name } } }"
  }'
```

---

## Solución de Problemas {#troubleshooting}

### Error 1: CORS al hacer fetch

**Síntoma:**
```
Failed to fetch
Access blocked by CORS policy
```

**Solución:**
1. Verificar que el proxy `/api/graphql` está funcionando
2. Verificar `NEXT_PUBLIC_WOOCOMMERCE_URL` en variables de entorno
3. Verificar configuración de CORS en WordPress (filtros en wp-config.php)

### Error 2: Carrito no persiste

**Síntoma:**
El carrito se vacía al recargar la página.

**Causa:**
WooCommerce GraphQL no tiene persistencia de sesión en headless por defecto.

**Solución Actual:**
El carrito se mantiene en memoria del cliente. Si se recarga, se pierde.

**Solución Futura:**
Implementar autenticación de WordPress o usar cookies del lado del servidor.

### Error 3: Productos no aparecen

**Síntoma:**
Query de productos retorna vacío.

**Verificar:**
1. Productos están publicados en WordPress
2. Stock status es "Instock"
3. Visibilidad del producto es "Catalog & Search"

**Query de debugging:**
```graphql
query GetProducts {
  products {
    nodes {
      id
      name
      stockStatus
    }
  }
}
```

### Error 4: Imágenes no cargan

**Síntoma:**
Productos sin imágenes o placeholders.

**Verificar:**
1. Imágenes están subidas en Media Library
2. Imagen destacada está asignada al producto
3. GraphQL retorna `image.sourceUrl`

**Query de debugging:**
```graphql
query GetProducts {
  products {
    nodes {
      name
      image {
        sourceUrl
      }
    }
  }
}
```

### Error 5: Loop infinito en /cart

**Síntoma:**
Miles de requests a `/api/graphql` al entrar en `/cart`.

**Causa:**
Server Component (WooNavbar) siendo renderizado dentro de Client Component.

**Solución:**
Usar layouts de Next.js para separar Server y Client Components.

**Verificar:**
- [ ] `app/cart/layout.tsx` existe
- [ ] `WooNavbar` está en el layout, no en page.tsx
- [ ] `getCollections` usa `cache()` de React

### Error 6: Build falla por errores de tipo

**Síntoma:**
`Type error: Type 'X' is not assignable to type 'Y'`

**Soluciones Comunes:**

1. **Precio undefined:**
```tsx
// Mal
defaultPrice={product.price}

// Bien
defaultPrice={product.price || 'Precio no disponible'}
```

2. **Prop faltante:**
```tsx
// Mal
addProduct({ id, name, slug })

// Bien
addProduct({ id, name, slug, viewedAt: Date.now() })
```

3. **Optional chaining:**
```tsx
// Mal
attributeMap[attr.name].add(value)

// Bien
attributeMap[attr.name]?.add(value)
```

---

## Referencias de GraphQL Queries

### Obtener Productos
```graphql
query GetProducts {
  products {
    nodes {
      id
      databaseId
      name
      slug
      price
      regularPrice
      stockStatus
      image {
        sourceUrl
        altText
      }
    }
  }
}
```

### Obtener Producto por Slug
```graphql
query GetProduct($slug: ID!) {
  product(id: $slug, idType: SLUG) {
    id
    databaseId
    name
    slug
    price
    description
    image {
      sourceUrl
    }
    ... on VariableProduct {
      price
      variations {
        nodes {
          id
          databaseId
          name
          price
          stockStatus
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
```

### Agregar al Carrito
```graphql
mutation AddToCart($productId: Int!, $quantity: Int) {
  addToCart(input: {
    productId: $productId
    quantity: $quantity
  }) {
    cart {
      contents {
        nodes {
          key
          quantity
          product {
            node {
              id
              name
              slug
            }
          }
          total
        }
      }
      subtotal
      total
    }
  }
}
```

---

## Mantenimiento

### Actualizaciones

**WordPress/WooCommerce:**
1. Backup completo antes de actualizar
2. Actualizar en este orden:
   - WordPress core
   - WooCommerce
   - WPGraphQL
   - WPGraphQL for WooCommerce

**Next.js:**
```bash
# Actualizar dependencias
npm update

# Buscar vulnerabilidades
npm audit

# Corregir vulnerabilidades automáticas
npm audit fix

# Build de prueba
npm run build
```

### Backups Automatizados

**Base de datos WordPress:**
```bash
# Script de backup (ejecutar vía cron)
mysqldump -u usuario -p nombre_db > backup_$(date +%Y%m%d).sql
```

**Archivos WordPress:**
```bash
# Backup de archivos
tar -czf wp_files_$(date +%Y%m%d).tar.gz /path/to/wordpress/
```

---

## Checklist de Lanzamiento

### Pre-Lanzamiento
- [ ] Todas las variables de entorno configuradas
- [ ] WordPress/WooCommerce funcionando
- [ ] WPGraphQL retornando datos correctamente
- [ ] Imágenes optimizadas y cargando
- [ ] Carrito funcionando (add, update, remove)
- [ ] Checkout conectado (si aplica)
- [ ] Analytics configurado
- [ ] SEO meta tags configurados
- [ ] Sitemap generado
- [ ] Favicon configurado

### Post-Lanzamiento
- [ ] Test de compras completo
- [ ] Test de móvil (responsive)
- [ ] Test de velocidad (PageSpeed Insights)
- [ ] Configurar CDN si es necesario
- [ ] Monitoreo de errores configurado
- [ ] Backup automatizado activado

---

## Soporte

### Recursos Oficiales
- **WPGraphQL:** https://www.wpgraphql.com/docs/
- **WooGraphQL:** https://wpgraphql.com/woocommerce/
- **Next.js:** https://nextjs.org/docs
- **WooCommerce:** https://woocommerce.com/documentation/

### Archivos de Configuración Clave
- `lib/woocommerce/index.ts` - Cliente GraphQL principal
- `app/api/graphql/route.ts` - Proxy GraphQL
- `lib/woocommerce/cart.ts` - API del carrito
- `.env.local` - Variables de entorno

---

## Notas Importantes

1. **Carrito sin persistencia:** El carrito actual se mantiene solo en memoria del cliente. Al recargar se pierde.

2. **Autenticación:** Para carrito persistente con usuarios, hay que implementar autenticación de WordPress.

3. **Performance:** Usar `React.cache` para evitar llamadas repetidas a la API.

4. **CORS:** Siempre usar el proxy `/api/graphql` desde el cliente, nunca llamar directamente a WordPress desde el browser.

5. **Relay IDs:** WPGraphQL usa IDs base64 (relay). Convertir a `databaseId` para mutaciones de carrito.

6. **Server vs Client Components:**
   - Server Components: Para fetch inicial de datos
   - Client Components: Para interactividad (carrito, filtros, etc.)

---

**Última actualización:** Enero 2026
**Versión:** 1.0.0

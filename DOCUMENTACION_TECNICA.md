# Documentación Técnica - Pinneacle Perfumería

## 📋 Índice

1. [Descripción del Proyecto](#descripción-del-proyecto)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Configuración del Entorno](#configuración-del-entorno)
5. [Arquitectura](#arquitectura)
6. [Componentes Principales](#componentes-principales)
7. [API Routes](#api-routes)
8. [Carrito de Compras](#carrito-de-compras)
9. [Integración con WooCommerce](#integración-con-woocommerce)
10. [Estilos y UI](#estilos-y-ui)
11. [Scripts Disponibles](#scripts-disponibles)
12. [Buenas Prácticas](#buenas-prácticas)

---

## Descripción del Proyecto

**Pinneacle Perfumería** es una tienda de e-commerce construida con Next.js 15 y WooCommerce como backend. El proyecto permite a los usuarios explorar productos de perfumería, agregarlos al carrito de compras local, y finalizar la compra a través de WhatsApp.

### Características Principales:
- 🛒 Carrito de compras local con localStorage
- 🔍 Búsqueda AJAX en tiempo real
- 📱 Diseño responsive
- 🎨 Layout de 4 columnas para productos
- 💰 Formato de precios en CLP (Pesos Chilenos)
- 📦 Productos variables con variaciones
- 🔗 Checkout via WhatsApp
- 📰 Páginas informativas (políticas, términos, etc.)

---

## Stack Tecnológico

### Frontend
- **Next.js 15** - Framework de React con App Router
- **React 19** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS 4** - Framework de CSS utilitario
- **Lucide React** - Iconos
- **Headless UI** - Componentes accesibles
- **Heroicons** - Iconos adicionales
- **React Slick** - Carrusel para banners

### Backend
- **WooCommerce GraphQL API** - Gestión de productos
- **Next.js API Routes** - Endpoints personalizados

### Herramientas de Desarrollo
- **ESLint** - Linting
- **Prettier** - Formateo de código
- **TypeScript** - Tipado
- **Sentry** - Monitoreo de errores

---

## Estructura del Proyecto

```
pinneacle/
├── app/                          # App Router de Next.js 15
│   ├── api/                      # API Routes
│   │   ├── search/              # Endpoint de búsqueda AJAX
│   │   ├── graphql/             # Proxy GraphQL de WooCommerce
│   │   └── diagnostico-carrito/ # Diagnóstico del carrito
│   ├── cart/                    # Página del carrito
│   ├── checkout/                # Página de checkout
│   ├── product/[slug]/          # Páginas de producto individual
│   ├── search/[collection]/     # Páginas de categorías
│   ├── page.tsx                 # Homepage
│   └── layout.tsx               # Layout raíz
│
├── components/
│   ├── cart/                    # Componentes del carrito
│   ├── custom/                  # Componentes personalizados
│   ├── layout/                  # Componentes de layout
│   ├── product/                 # Componentes de producto
│   └── providers/               # Context providers
│
├── lib/
│   └── woocommerce/             # Integración con WooCommerce
│       ├── index.ts             # Funciones principales
│       ├── queries/             # Queries GraphQL
│       └── types.ts             # Tipos TypeScript
│
└── public/                      # Archivos estáticos
```

---

## Configuración del Entorno

### Variables de Entorno Requeridas

Crear archivo `.env.local`:

```env
# WooCommerce GraphQL
NEXT_PUBLIC_WOOCOMMERCE_URL=https://tu-sitio.com
NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY=tu_consumer_key
NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET=tu_consumer_secret

# Configuración opcional
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
```

### Instalación

```bash
# Instalar dependencias
pnpm install

# Modo desarrollo
pnpm dev

# Build de producción
pnpm build

# Iniciar producción
pnpm start
```

---

## Arquitectura

### App Router (Next.js 15)

El proyecto utiliza el nuevo App Router de Next.js 15 con:
- **Server Components** por defecto para mejor performance
- **Client Components** cuando se necesita interactividad ('use client')
- **Server Actions** para mutaciones de datos
- **Async params** en route handlers

### Patron de Componentes

```
Server Components (app/page.tsx)
    ↓
Client Components (components/* con 'use client')
    ↓
Providers (Context para estado global)
```

### Data Fetching

- **Productos**: WooCommerce GraphQL API
- **Carrito**: localStorage (cliente)
- **Búsqueda**: API Route personalizada con debouncing

---

## Componentes Principales

### 1. WooNavbar
**Ubicación**: `components/layout/navbar/woo-navbar-client.tsx`

Navegación principal con:
- Logo y enlaces
- Menú de categorías con dropdown hover
- Búsqueda AJAX con debouncing (300ms)
- Icono del carrito con contador
- Menú móvil

**Características**:
- Navbar fijo que cambia estilo al hacer scroll
- Dropdown de categorías sin espacio (evita cierre al navegar)
- Búsqueda en tiempo real con resultados dropdown

### 2. ProductDescriptionWoo
**Ubicación**: `components/product/ProductDescriptionWoo.tsx`

Muestra información detallada del producto:
- Galería de imágenes
- Selector de variaciones
- Selector de cantidad
- Botón de compra con color corporativo (#101828)
- Acordeón de información (descripción, envío, devoluciones)
- Indicador de stock

**Características**:
- Sticky en desktop
- Formato CLP para precios
- Validación de stock
- Hover invertido en botón de compra

### 3. CartDrawer
**Ubicación**: `components/cart/CartDrawer.tsx`

Panel lateral del carrito:
- Lista de productos
- Controles de cantidad
- Eliminación de productos
- Subtotal
- Botón de checkout a WhatsApp

**Características**:
- Animación de entrada/salida
- Persistencia con localStorage
- Actualización optimista

### 4. RecentlyViewedProducts
**Ubicación**: `components/product/RecentlyViewed.tsx`

Productos vistos recientemente:
- Grid de 4 columnas (8 productos)
- Fallback a productos destacados
- Diseño consistente con catálogo
- Persistencia en localStorage

### 5. BannerCarousel
**Ubicación**: `components/custom/BannerCarousel.tsx`

Carrusel de banners principales:
- 3 banners en formato PNG
- Navegación con dots
- Auto-play configurable
- Links a búsqueda

---

## API Routes

### 1. Search API
**Endpoint**: `/api/search`

**Método**: GET

**Query Params**:
- `q` (string): Término de búsqueda (mínimo 2 caracteres)

**Response**:
```typescript
{
  products: [
    {
      id: string;
      handle: string;
      title: string;
      price: string;
      priceDisplay: string;  // Formato CLP
      image: string;
      altText: string;
    }
  ]
}
```

**Características**:
- Formateo de precios CLP (con separadores de miles)
- Máximo 8 resultados
- Manejo de errores con respuesta vacía

### 2. GraphQL Proxy
**Endpoint**: `/api/graphql`

**Método**: POST

**Descripción**: Proxy para WooCommerce GraphQL API

**Características**:
- Evita problemas de CORS
- Cache de responses
- Manejo de errores

---

## Carrito de Compras

### Arquitectura

El carrito usa **localStorage** para persistencia:

```typescript
// Estructura del carrito
interface CartItem {
  id: string;
  quantity: number;
  product: {
    title: string;
    handle: string;
    priceRange: {
      minVariantPrice: { amount: string; currencyCode: string };
    };
    featuredImage: { url: string; altText: string };
  };
}

// localStorage key
const CART_KEY = 'pinneacle_cart';
```

### Funcionalidades

1. **Agregar al carrito**:
   - Validación de variaciones
   - Actualización optimista
   - Notificación toast

2. **Eliminar producto**:
   - Confirmación opcional
   - Recálculo de subtotal

3. **Cambiar cantidad**:
   - Validación de stock
   - Incrementos/decrementos

4. **Checkout**:
   - Redirección a WhatsApp
   - Formato del mensaje:
     ```
     Hola, quiero comprar:
     - Producto 1 (x2)
     - Producto 2 (x1)
     Total: $XX.XXX
     ```

### CartProvider

**Ubicación**: `components/providers/CartProvider.tsx`

Context provider que gestiona:
- Estado del carrito
- Operaciones CRUD
- Persistencia en localStorage
- Actualizaciones de UI

---

## Integración con WooCommerce

### GraphQL Queries

**Ubicación**: `lib/woocommerce/queries/`

#### Queries Disponibles:

1. **getProductsQuery**: Todos los productos
2. **getProductQuery**: Producto individual por slug
3. **getProductsByCategoryQuery**: Productos por categoría
4. **getCollectionsQuery**: Categorías/colecciones

### Formato de Productos

```typescript
interface WooProduct {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: string;
  regularPrice?: string;
  salePrice?: string;
  stockStatus: 'IN_STOCK' | 'OUT_OF_STOCK';
  image: {
    sourceUrl: string;
    altText?: string;
  };
  attributes?: {
    nodes: WooProductAttribute[];
  };
  variations?: {
    nodes: WooProductVariation[];
  };
}
```

### Formato de Precios CLP

Los precios de WooCommerce vienen en formatos mixtos. El proyecto normaliza a CLP:

```typescript
// Función de formateo
const formatCLP = (amount: string | number): string => {
  // Limpiar: remover puntos y comas
  const num = String(amount).replace(/\./g, '').replace(/,/g, '');
  const parsed = parseFloat(num) || 0;

  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(parsed);
};

// Ejemplos:
// "21990" → "$21.990"
// "21900,00" → "$21.900"
// "21,990.00" → "$21.990"
```

---

## Estilos y UI

### Tailwind CSS Config

**Ubicación**: `tailwind.config.js`

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Color corporativo
        primary: '#101828',
      },
      fontFamily: {
        sans: ['Geist', 'sans-serif'],
        belleza: ['Belleza', 'serif'],
        moderat: ['Moderat', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries'),
  ],
};
```

### Layouts de Productos

**Grid de 4 columnas**:
```tsx
className="grid grid-cols-2 lg:grid-cols-4 gap-6"
```

- **Mobile**: 2 columnas
- **Desktop (lg+)**: 4 columnas
- **Gap**: 1.5rem (24px)

### Tarjetas de Producto

```tsx
<Link href={`/product/${slug}`} className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
  {/* Imagen 3:4 */}
  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
    <img className="object-cover group-hover:scale-105 transition-transform duration-500" />
  </div>

  {/* Info */}
  <div className="p-4">
    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
      Nombre del producto
    </h3>
    <p className="text-lg text-gray-700 font-medium">
      $XX.XXX
    </p>
  </div>
</Link>
```

### Colores Corporativos

- **Principal**: `#101828` (azul oscuro)
- **Hover**: `#1a2332` (azul ligeramente más claro)
- **Invertido**: Fondo blanco con texto `#101828`

---

## Scripts Disponibles

### Development
```bash
pnpm dev          # Servidor de desarrollo en localhost:3000
```

### Build
```bash
pnpm build        # Build de producción
pnpm start        # Iniciar servidor de producción
```

### Linting
```bash
pnpm lint         # Ejecutar ESLint
pnpm lint:fix     # Auto-corregir problemas de ESLint
```

### Formateo
```bash
pnpm prettier     # Formatear todo el código
pnpm prettier:check  # Verificar formateo
```

### Test
```bash
pnpm test         # Ejecutar prettier:check + lint
```

---

## Buenas Prácticas

### 1. Componentes

✅ **Usar Server Components por defecto**:
```tsx
// app/page.tsx - Server Component
export default async function HomePage() {
  const products = await getProducts();
  return <ProductGrid products={products} />;
}
```

✅ **'use client' solo cuando es necesario**:
```tsx
'use client';

export function InteractiveComponent() {
  const [state, setState] = useState();
  // Event handlers, useState, useEffect
}
```

### 2. Data Fetching

✅ **Async en Server Components**:
```tsx
// Next.js 15: params es async
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // ...
}
```

✅ **Manejo de errores**:
```tsx
try {
  const product = await getProduct(slug);
  return <ProductView product={product} />;
} catch (error) {
  console.error('Error:', error);
  return <ErrorView />;
}
```

### 3. TypeScript

✅ **Definir interfaces para props**:
```tsx
interface ProductCardProps {
  product: WooProduct;
  onAddToCart?: (id: string) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  // ...
}
```

✅ **Usar tipos de WooCommerce**:
```tsx
import type { WooProduct, WooProductAttribute } from '@/lib/woocommerce/types';
```

### 4. Estilos

✅ **Usar clases de Tailwind**:
```tsx
// ✅ Bien
<div className="flex items-center justify-between p-4 bg-white">

// ❌ Mal
<div style={{ display: 'flex', padding: '1rem' }}>
```

✅ **Usar colores del tema**:
```tsx
// ✅ Bien
className="bg-[#101828] hover:bg-[#1a2332]"

// ❌ Mal
className="bg-blue-800"
```

### 5. Performance

✅ **Optimizar imágenes**:
```tsx
<Image
  src={product.image}
  alt={product.name}
  width={400}
  height={533}
  className="object-cover"
  sizes="(max-width: 768px) 50vw, 25vw"
/>
```

✅ **Lazy loading de componentes**:
```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Cargando...</p>,
});
```

### 6. Accesibilidad

✅ **Usar etiquetas semánticas**:
```tsx
<nav>
  <ul>
    <li><Link href="/">Inicio</Link></li>
  </ul>
</nav>
```

✅ **Alt text en imágenes**:
```tsx
<img src={product.image} alt={product.name} />
```

✅ **ARIA labels**:
```tsx
<button aria-label="Abrir carrito">
  <CartIcon />
</button>
```

---

## Troubleshooting

### Problemas Comunes

#### 1. Productos no aparecen
**Verificar**:
- Conexión con WooCommerce API
- Variables de entorno
- Stock status en WooCommerce

#### 2. Carrito no persiste
**Verificar**:
- localStorage habilitado en el navegador
- Key correcta: `pinneacle_cart`
- No hay errores en console

#### 3. Búsqueda no funciona
**Verificar**:
- API route `/api/search` funciona
- Query params correctos
- Debouncing no interfiere

#### 4. Build falla
**Verificar**:
```bash
pnpm lint         # Revisar errores de linting
pnpm prettier:check  # Revisar formateo
```

---

## Recursos

- [Next.js 15 Docs](https://nextjs.org/docs)
- [WooCommerce GraphQL API](https://woocommerce.github.io/woocommerce-rest-api-docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React 19 Docs](https://react.dev)

---

## Contacto

- **Email**: contacto@pinneacleperfumeria.com
- **Teléfono**: +56 9 4615 2919
- **Sitio**: [Pinneacle Perfumería](https://pinneacleperfumeria.com)

---

**Última actualización**: Marzo 2026
**Versión**: 1.0.0

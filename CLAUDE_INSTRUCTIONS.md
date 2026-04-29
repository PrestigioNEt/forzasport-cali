# Instrucciones para Claude - E-commerce Next.js + WooCommerce

## Propósito
Este documento contiene instrucciones para configurar un proyecto de e-commerce **Next.js 15 + WooCommerce + WPGraphQL** con la misma arquitectura que Rusovan. Usar este prompt al inicio de un nuevo proyecto.

---

## Arquitectura General

### Stack Tecnológico
```
Frontend: Next.js 15 (App Router) + React 19
Backend: WordPress + WooCommerce + WPGraphQL
Estilo: Tailwind CSS
Estado: React Context API
```

### Arquitectura Clave

#### 1. Server vs Client Components

**REGLA DE ORO:**
- **Server Components** (`async`): Para fetch inicial de datos (productos, categorías)
- **Client Components** (`'use client'`): Para interactividad (carrito, filtros, modales)

**Ejemplo correcto:**
```tsx
// ✅ Server Component para datos
async function ProductPage({ params }) {
  const product = await getProduct(params.slug);
  return <ProductDescription product={product} />; // Client Component
}

// ❌ EVITAR: Client Component haciendo fetch directo a WordPress
'use client';
function ProductPage() {
  const [product, setProduct] = useState();
  useEffect(() => {
    fetch('/api/graphql')... // ❌ Mal en Next.js 15
  }, []);
}
```

#### 2. Layouts para Evitar Loops Infinitos

**PROBLEMA CRÍTICO:** Si un Server Component se renderiza dentro de un Client Component, puede causar loops infinitos.

**SOLUCIÓN:** Usar layouts de Next.js para separar Server y Client Components.

```tsx
// ✅ CORRECTO: Layout para /cart
// app/cart/layout.tsx (Server Component)
import { WooNavbar } from '@/components/layout/navbar/woo-navbar';
import FooterCustom from '@/components/custom/FooterCustom';

export default function CartLayout({ children }) {
  return (
    <>
      <WooNavbar />  {/* Server Component */}
      {children}
      <FooterCustom />
    </>
  );
}

// app/cart/page.tsx (Client Component)
'use client';
export default function CartPage() {
  const { cart } = useCart(); // ✅ Solo lógica de cliente
  return <main>...</main>;
}
```

#### 3. Proxy GraphQL para CORS

**IMPORTANTE:** Nunca hacer fetch directo a WordPress desde el cliente (browser). Usar siempre el proxy.

```typescript
// ✅ CORRECTO: Usar proxy desde cliente
const endpoint = isServer ? directEndpoint : '/api/graphql';

// ❌ INCORRECTO: Fetch directo desde cliente
fetch('https://tu-wordpress.com/graphql') // CORS error!
```

**Proxy implementation:**
```typescript
// app/api/graphql/route.ts
export async function POST(request: NextRequest) {
  const body = await request.json();
  const response = await fetch(process.env.NEXT_PUBLIC_WOOCOMMERCE_URL + '/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return NextResponse.json(await response.json());
}
```

---

## Errores Comunes y Soluciones

### Error 1: Loop Infinito de Fetches

**Síntoma:** Miles de POST requests a `/api/graphql` en la consola.

**Causa:** Server Component renderizado dentro de Client Component.

**Diagnóstico:**
```bash
# Buscar en stack trace:
WooNavbar → getCategories → getCollections → woocommerceFetch
```

**Solución:**
1. Mover Server Components (WooNavbar) a un layout
2. Usar `React.cache` en funciones que hacen fetch
3. Envolver funciones async en `cache()`:

```typescript
import { cache } from 'react';

export const getCollections = cache(async () => {
  const res = await woocommerceFetch(...);
  return res.body.data.productCategories?.nodes || [];
});
```

### Error 2: Type Errors - "Possibly undefined"

**Síntoma:**
```
Type 'X' is not assignable to type 'Y'. Property is missing
```

**Solución:**
```typescript
// ❌ Mal
price={product.price}

// ✅ Bien
price={product.price || 'Precio no disponible'}

// ❌ Mal
attributeMap[attr.name].add(value)

// ✅ Bien
attributeMap[attr.name]?.add(value)
```

### Error 3: Relay IDs vs Database IDs

**PROBLEMA:** WPGraphQL usa IDs base64 (relay) pero las mutaciones de carrito necesitan IDs numéricos.

**Solución:**
```typescript
// Extraer ID numérico de relay ID
function extractDatabaseId(relayId: string): number {
  const decoded = Buffer.from(relayId, 'base64').toString('utf-8');
  const match = decoded.match(/:(\d+)$/);
  return match ? parseInt(match[1], 10) : 0;
}

// Usar en mutaciones
const numericId = extractDatabaseId(product.id); // "cG9zdDoxMDI=" → 102
```

### Error 4: Carrito No Persiste

**SÍNTOMA:** Carrito se vacía al recargar la página.

**CAUSA:** WooCommerce GraphQL no tiene persistencia de sesión en headless.

**SOLUCIÓN ACTUAL:** Mantener carrito en memoria del cliente (React Context).

**NOTA:** Para persistencia futura, implementar:
- Autenticación de WordPress
- O localStorage/sessionStorage
- O cart en base de datos con user ID

### Error 5: Props Faltantes

**SÍNTOMA:**
```
Property 'viewedAt' is missing
Property 'Package' is defined but never used
```

**Solución:**
```typescript
// Agregar prop faltante
addProduct({
  id, name, slug,
  viewedAt: Date.now() // ✅ Agregar timestamp
});

// Remover imports no usados
import { Package } from 'lucide-react'; // ❌ Remover
```

---

## Estructura del Proyecto

```
project-root/
├── app/
│   ├── api/
│   │   └── graphql/route.ts        # Proxy GraphQL (CRÍTICO)
│   ├── cart/
│   │   ├── layout.tsx               # Server: Navbar + Footer
│   │   └── page.tsx                 # Client: Contenido del carrito
│   ├── product/[slug]/
│   │   └── page.tsx                 # Server + Client mix
│   ├── search/
│   │   └── page.tsx                 # Página de búsqueda
│   └── layout.tsx                   # Root layout con providers
├── components/
│   ├── cart/
│   │   ├── CartDrawer.tsx           # Modal lateral del carrito
│   │   └── CartIcon.tsx             # Icono con contador
│   ├── providers/
│   │   ├── CartProvider.tsx         # Contexto del carrito
│   │   └── RecentlyViewedProvider.tsx
│   ├── product/
│   │   ├── ProductDescriptionWoo.tsx
│   │   ├── ProductVariations.tsx
│   │   └── ProductViewTracker.tsx
│   └── layout/navbar/
│       ├── woo-navbar.tsx           # Server Component
│       └── woo-navbar-client.tsx    # Client Component
└── lib/
    └── woocommerce/
        ├── index.ts                 # Cliente GraphQL principal
        ├── queries/                 # Queries GraphQL
        ├── mutations/               # Mutaciones (cart)
        ├── cart.ts                  # API del carrito
        └── types.ts                 # TypeScript types
```

---

## Reglas de Oro para este Proyecto

### 1. Usar React.cache para Fetch Expensivo
```typescript
import { cache } from 'react';

export const getCollections = cache(async () => {
  // Fetch solo se ejecuta una vez
});
```

### 2. useCallback para Funciones de Context
```typescript
const addToCart = useCallback(async (productId) => {
  // Previene re-renders infinitos
}, []); // ❌ NO poner dependencias que cambien
```

### 3. useMemo para Cálculos Costosos
```typescript
const itemCount = useMemo(() => getCartItemCount(cart), [cart]);
```

### 4. Server Components para Datos Iniciales
```typescript
// ✅ CORRECTO
async function ProductList() {
  const products = await getProducts();
  return <ProductCard products={products} />;
}

// ❌ INCORRECTO
function ProductList() {
  const [products, setProducts] = useState();
  useEffect(() => { fetchProducts() }, []);
}
```

### 5. Client Components para Interactividad
```typescript
'use client';
// Carrito, filtros, modales, forms - todo en Client Components
```

---

## GraphQL Queries de Referencia

### Obtener Productos
```graphql
query GetProducts {
  products {
    nodes {
      id
      databaseId  # ⚠️ CRÍTICO para addToCart
      name
      slug
      price
      stockStatus
      image {
        sourceUrl
        altText
      }
    }
  }
}
```

### Producto con Variaciones
```graphql
query GetProduct($slug: ID!) {
  product(id: $slug, idType: SLUG) {
    id
    databaseId  # ⚠️ CRÍTICO
    name
    slug
    ... on VariableProduct {
      variations {
        nodes {
          id
          databaseId  # ⚠️ CRÍTICO para addToCart
          name
          price
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

## Configuración de WordPress (Plugins)

### Orden de Instalación:
1. **WooCommerce** - e-commerce core
2. **WPGraphQL** - API GraphQL
3. **WPGraphQL for WooCommerce** - integración WooCommerce

### WPGraphQL for WooCommerce desde GitHub:
```
https://github.com/wp-graphql/wpgraphql-woocommerce/releases
```
⚠️ Descargar ZIP e instalar manualmente (versión WP.org puede estar desactualizada)

### Configuración Crítica:
- Habilitar "Allow anonymous cart session" en WooCommerce → GraphQL settings
- Configurar CORS en `wp-config.php` si es necesario

---

## Variables de Entorno

### .env.local
```bash
NEXT_PUBLIC_WOOCOMMERCE_URL=https://tu-wordpress.com
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
```

⚠️ **IMPORTANTE:**
- NO incluir `/` al final
- Usar HTTPS en producción
- NEXT_PUBLIC_ hace la variable disponible en el cliente

---

## Checklist Inicial para Nuevo Proyecto

### Fase 1: Setup WordPress
- [ ] WordPress instalado y funcionando
- [ ] WooCommerce activo y configurado
- [ ] WPGraphQL instalado y activo
- [ ] WooGraphQL instalado desde GitHub
- [ ] Permalinks configurados (/%postname%/)
- [ ] CORS configurado si es necesario
- [ ] GraphQL endpoint retornando datos

### Fase 2: Setup Next.js
- [ ] Proyecto Next.js 15 creado
- [ ] Tailwind CSS configurado
- [ ] Variables de entorno configuradas
- [ ] Proxy GraphQL creado (`/api/graphql`)
- [ ] Cliente woocommerceFetch implementado

### Fase 3: Core Features
- [ ] Product query funcionando
- [ ] Product page renderizando
- [ ] CartProvider creado
- [ ] addToCart funcionando
- [ ] Cart drawer creado
- [ ] /cart page funcionando

### Fase 4: Testing
- [ ] No hay loops infinitos de fetch
- [ ] CORS no da errores
- [ ] Carrito agrega productos
- [ ] Variaciones funcionan
- [ ] Build exitoso sin errores

---

## Debugging Commands

### Verificar GraphQL
```bash
# Test directo a WordPress
curl -X POST https://tu-wordpress.com/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ products { nodes { id name } } }"}'

# Test via proxy Next.js
curl -X POST http://localhost:3000/api/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ products { nodes { id name } } }"}'
```

### Verificar Server vs Client
```typescript
// Agregar log para detectar loops
console.log('🔴 Fetching WooCommerce (Server/Client):', typeof window === 'undefined' ? 'Server' : 'Client');
```

### Verificar Cache
```typescript
// Agregar logs para ver si cache funciona
export const getCollections = cache(async () => {
  console.log('🔄 getCollections called'); // Debe aparecer solo 1 vez
  return ...
});
```

---

## Patterns a Seguir

### Pattern 1: Server Component con Client Child
```tsx
// ✅ PATRÓN CORRECTO
async function ProductPage({ params }) { // Server
  const product = await getProduct(params.slug);
  return <ProductActions product={product} />; // Client
}

'use client';
function ProductActions({ product }) {
  const { addToCart } = useCart();
  return <button onClick={() => addToCart(product.id)}>Add</button>;
}
```

### Pattern 2: Layout para Componentes Globales
```tsx
// ✅ PATRÓN CORRECTO
// app/search/layout.tsx
export default function SearchLayout({ children }) {
  return (
    <>
      <WooNavbar />  {/* Server Component en layout */}
      {children}     {/* Client Component page */}
      <FooterCustom />
    </>
  );
}
```

### Pattern 3: Context para Estado Global
```tsx
// ✅ PATRÓN CORRECTO
'use client';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);

  const addToCart = useCallback(async (productId) => {
    // Lógica de add to cart
  }, []); // ⚠️ Array vacío para evitar re-creates

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}
```

---

## Anti-Patterns a EVITAR

### ❌ Anti-Pattern 1: Fetch en useEffect desde Server Component
```tsx
// ❌ MAL
export default async function Page() {
  useEffect(() => {
    fetch('/api/data')...
  }, []);
}
```

### ❌ Anti-Pattern 2: Server Component dentro de Client Component
```tsx
// ❌ MAL
'use client';
function Page() {
  return <WooNavbar />; // Server Component dentro de Client
}
```

### ❌ Anti-Pattern 3: Direct WordPress Fetch from Client
```tsx
// ❌ MAL
'use client';
function Page() {
  fetch('https://wordpress.com/graphql') // CORS error!
}
```

### ❌ Anti-Pattern 4: useCallback con Dependencias Cambiantes
```tsx
// ❌ MAL
const addToCart = useCallback(async (productId) => {
  await addToCart(productId);
}, [addToCart]); // Dependencia circular!
```

---

## Testing Manual Checklist

### Carrito
- [ ] Agregar producto simple al carrito
- [ ] Agregar producto con variación al carrito
- [ ] Actualizar cantidad en cart drawer
- [ ] Actualizar cantidad en /cart page
- [ ] Eliminar item del carrito
- [ ] Abrir/cerrar cart drawer
- [ ] Navegar a /cart desde cart drawer
- [ ] Contador de items en icono actualiza

### Productos
- [ ] Página de producto carga
- [ ] Variaciones se seleccionan
- [ ] Precio actualiza con variación
- [ ] Stock status correcto
- [ ] Imágenes cargan
- [ ] Add to cart funciona

### General
- [ ] No hay errores en consola
- [ ] No hay loops infinitos
- [ ] Build compila sin errores
- [ ] Linting pasa (o warnings justificados)

---

## Notas Finales

### Carrito Sin Persistencia
El carrito actual se mantiene solo en memoria del cliente. Al recargar la página se pierde. Esto es intencional por simplicidad. Para producción:

**Opciones:**
1. Implementar autenticación WordPress
2. Usar localStorage con cart nonce
3. Backend cart con user sessions

### Performance Optimization
- Usar `React.cache` para fetch costosos
- Usar `useMemo` para cálculos
- Usar `useCallback` para funciones pasadas como props
- Server Components para datos iniciales
- Client Components solo para interactividad

### Seguridad
- Nunca exponer credenciales en cliente
- Usar variables de entorno con NEXT_PUBLIC_ solo para datos públicos
- Validar datos en servidor
- Sanitizar inputs de usuario

---

## Resumen Ejecutivo para Nuevo Proyecto

1. **Instalar WordPress + WooCommerce + WPGraphQL + WooGraphQL**
2. **Crear proyecto Next.js 15 con App Router**
3. **Configurar proxy /api/graphql**
4. **Implementar woocommerceFetch con server/client detection**
5. **Crear CartProvider con React Context**
6. **Usar Server Components para fetch inicial**
7. **Usar Client Components para interactividad**
8. **Usar layouts para separar Server/Client**
9. **Usar React.cache para evitar fetch duplicados**
10. **Usar useCallback/useMemo para optimización**

---

**Última actualización:** Enero 2026
**Basado en:** Rusovan E-commerce Architecture
**Versión:** 1.0.0

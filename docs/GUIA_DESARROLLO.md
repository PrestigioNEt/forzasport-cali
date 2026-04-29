# Guía de Desarrollo - Pinneacle Perfumería

## 📋 Índice

1. [Convenciones del Proyecto](#convenciones-del-proyecto)
2. [Estructura de Archivos](#estructura-de-archivos)
3. [Guía de Estilos](#guía-de-estilos)
4. [Patrones de Componentes](#patrones-de-componentes)
5. [TypeScript Best Practices](#typescript-best-practices)
6. [Testing y Debugging](#testing-y-debugging)
7. [Git Workflow](#git-workflow)
8. [Code Review Checklist](#code-review-checklist)

---

## Convenciones del Proyecto

### Nomenclatura

**Archivos**:
- Componentes: `PascalCase.tsx` (ej: `ProductCard.tsx`)
- Utilities: `camelCase.ts` (ej: `formatPrice.ts`)
- Hooks: `use` + `PascalCase.ts` (ej: `useCart.ts`)
- Types: `PascalCase.types.ts` (ej: `WooProduct.types.ts`)

**Carpetas**:
- `kebab-case` (ej: `woo-navbar/`, `product-description/`)

**Variables/Funciones**:
- `camelCase` (ej: `addToCart`, `productName`)

**Constantes**:
- `UPPER_SNAKE_CASE` (ej: `CART_STORAGE_KEY`, `MAX_QUANTITY`)

**Componentes**:
- `PascalCase` (ej: `ProductCard`, `CartProvider`)

### Orden de Imports

```typescript
// 1. React y Next.js
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// 2. Librerías de terceros
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

// 3. Componentes internos (alias @)
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product/ProductCard';

// 4. Utils y helpers
import { formatCLP } from '@/lib/utils/format';

// 5. Types
import type { WooProduct } from '@/lib/woocommerce/types';

// 6. Estilos (si aplica)
import styles from './Component.module.css';
```

---

## Estructura de Archivos

### Component Structure

```typescript
'use client'; // Si es Client Component

// 1. Imports
import { useState } from 'react';
import { Link } from 'next/link';

// 2. Types
interface ComponentProps {
  // ...
}

// 3. Constants
const CONSTANT_VALUE = 'value';

// 4. Helper functions (si son necesarias)
function helperFunction() {
  // ...
}

// 5. Component principal
export function Component({ prop1, prop2 }: ComponentProps) {
  // Hooks
  const [state, setState] = useState();

  // Event handlers
  const handleClick = () => {
    // ...
  };

  // Effects
  useEffect(() => {
    // ...
  }, []);

  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}

// 6. Sub componentes (si son necesarios)
function SubComponent() {
  return <div>...</div>;
}
```

### Page Structure

```typescript
// 1. Imports
import { WooNavbar } from '@/components/layout/navbar/woo-navbar';
import FooterCustom from '@/components/custom/FooterCustom';

// 2. Metadata
export async function generateMetadata({ params }) {
  return {
    title: 'Título de la página',
    description: 'Descripción',
  };
}

// 3. Data fetching functions
async function getData() {
  // ...
}

// 4. Page component
export default async function Page({ params }) {
  const data = await getData();

  return (
    <>
      <WooNavbar />
      <main>
        {/* Contenido */}
      </main>
      <FooterCustom />
    </>
  );
}
```

---

## Guía de Estilos

### Colores Corporativos

```typescript
// Color principal
const colors = {
  primary: '#101828',      // Azul oscuro corporativo
  primaryHover: '#1a2332', // Hover ligeramente más claro
  secondary: '#6B7280',    // Gris medio
  accent: '#10B981',       // Verde énfasis (stock disponible)
  danger: '#EF4444',       // Rojo error/agotado
  warning: '#F59E0B',      // Amarillo advertencia
};

// Uso en Tailwind
className="bg-[#101828] hover:bg-[#1a2332]"
```

### Espaciado

```typescript
// Espaciado consistente
const spacing = {
  xs: '0.25rem',   // 4px   - p-1
  sm: '0.5rem',    // 8px   - p-2
  md: '1rem',      // 16px  - p-4
  lg: '1.5rem',    // 24px  - p-6
  xl: '2rem',      // 32px  - p-8
  '2xl': '3rem',   // 48px  - p-12
  '3xl': '4rem',   // 64px  - p-16
};

// Gap en grids
gap-4   // 16px - cards pequeñas
gap-6   // 24px - cards medianas
gap-8   // 32px - cards grandes
```

### Tipografía

```typescript
// Font families
const fonts = {
  sans: ['Geist', 'sans-serif'],
  display: ['Belleza', 'serif'],
  body: ['Moderat', 'sans-serif'],
};

// Tamaños
text-xs      // 12px - metadata
text-sm      // 14px - body secundario
text-base    // 16px - body principal
text-lg      // 18px - subtítulos
text-xl      // 20px - títulos pequeños
text-2xl     // 24px - títulos medianos
text-3xl     // 30px - títulos grandes
```

### Bordes y Sombras

```typescript
// Bordes
rounded       // 4px  - sutil
rounded-md    // 6px  - estándar
rounded-lg    // 8px  - pronunciado
rounded-xl    // 12px - muy pronunciado
rounded-full  // pill - badges, botones redondos

// Sombras
shadow-sm     // Sutil
shadow-md     // Estándar (usar en cards)
shadow-lg     // Pronunciada
shadow-xl     // Muy pronunciada (hover states)
```

---

## Patrones de Componentes

### 1. Presentational Component

```typescript
// Componente simple que solo presenta datos
interface ProductCardProps {
  name: string;
  price: string;
  image: string;
  slug: string;
}

export function ProductCard({ name, price, image, slug }: ProductCardProps) {
  return (
    <Link href={`/product/${slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
        <img
          src={image}
          alt={name}
          className="object-cover group-hover:scale-105 transition-transform"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold">{name}</h3>
        <p className="text-lg font-medium">{price}</p>
      </div>
    </Link>
  );
}
```

### 2. Container Component

```typescript
// Componente con lógica de negocio
'use client';

export function ProductContainer() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (products.length === 0) return <EmptyState />;

  return <ProductGrid products={products} />;
}
```

### 3. Compound Component

```typescript
// Componente con sub-componentes
export function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-white rounded-lg shadow-md">{children}</div>;
}

Card.Header = function Header({ children }: { children: React.ReactNode }) {
  return <div className="p-4 border-b">{children}</div>;
};

Card.Body = function Body({ children }: { children: React.ReactNode }) {
  return <div className="p-4">{children}</div>;
};

Card.Footer = function Footer({ children }: { children: React.ReactNode }) {
  return <div className="p-4 border-t">{children}</div>;
};

// Uso
<Card>
  <Card.Header>Título</Card.Header>
  <Card.Body>Contenido</Card.Body>
  <Card.Footer>Acciones</Card.Footer>
</Card>
```

---

## TypeScript Best Practices

### Interfaces vs Types

```typescript
// ✅ Usar interface para objetos y componentes
interface ProductCardProps {
  product: WooProduct;
  onAddToCart?: (id: string) => void;
}

// ✅ Usar type para unions, primitives y aliases
type Status = 'IN_STOCK' | 'OUT_OF_STOCK' | 'ON_BACKORDER';
type ProductId = string | number;

// ✅ Extender interfaces
interface PhysicalProduct extends BaseProduct {
  weight: number;
  dimensions: {
    width: number;
    height: number;
    length: number;
  };
}
```

### Generic Types

```typescript
// ✅ Usar generics para componentes reutilizables
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

export function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map(item => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// Uso
<List
  items={products}
  renderItem={product => <ProductCard product={product} />}
  keyExtractor={product => product.id}
/>
```

### Strict Typing

```typescript
// ❌ Evitar any
function processProduct(product: any) {
  // ...
}

// ✅ Usar tipos específicos
function processProduct(product: WooProduct) {
  // ...
}

// ✅ O unknown si no se conoce el tipo
function processProduct(product: unknown) {
  if (isWooProduct(product)) {
    // TypeScript sabe que es WooProduct aquí
  }
}

// Type guard
function isWooProduct(product: unknown): product is WooProduct {
  return (
    typeof product === 'object' &&
    product !== null &&
    'id' in product &&
    'name' in product
  );
}
```

### Utility Types

```typescript
// Partial - todas las propiedades opcionales
type ProductUpdate = Partial<WooProduct>;

// Required - todas las propiedades requeridas
type RequiredProduct = Partial<WooProduct>;

// Readonly - propiedades de solo lectura
type ReadonlyProduct = Readonly<WooProduct>;

// Pick - solo algunas propiedades
type ProductBasicInfo = Pick<WooProduct, 'id' | 'name' | 'price'>;

// Omit - todas excepto algunas
type ProductWithoutImage = Omit<WooProduct, 'image' | 'galleryImages'>;

// Record - objeto con valores de mismo tipo
type ProductMap = Record<string, WooProduct>;
```

---

## Testing y Debugging

### Console Logs

```typescript
// ✅ Desarrollo: logs descriptivos
console.log('🛒 [Cart] Adding item:', { id, quantity, product });
console.error('❌ [API] Error fetching products:', error);
console.warn('⚠️  [Cart] Quantity exceeds stock');

// ❌ Producción: evitar logs excesivos
console.log('Rendering...'); // No útil
```

### Error Boundaries

```typescript
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <h2>Algo salió mal</h2>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Debug Component

```typescript
'use client';

import { useEffect } from 'react';

interface DebugInfoProps {
  data: any;
  label?: string;
}

export function DebugInfo({ data, label = 'Debug' }: DebugInfoProps) {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <details className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg max-w-md max-h-96 overflow-auto z-50">
      <summary className="cursor-pointer font-bold">{label}</summary>
      <pre className="mt-2 text-xs">
        {JSON.stringify(data, null, 2)}
      </pre>
    </details>
  );
}

// Uso
<DebugInfo data={cart} label="Carrito" />
```

---

## Git Workflow

### Branches

```
main          # Producción
develop       # Desarrollo (opcional)
feature/*     # Nuevas funcionalidades
bugfix/*      # Corrección de bugs
hotfix/*      # Fixes urgentes en producción
```

### Commit Messages

```bash
# Formato
<tipo>(<alcance>): <descripción>

[opcional: cuerpo]

[opcional: footer]
```

**Tipos**:
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Formato, missing semi colons, etc (no afecta lógica)
- `refactor`: Cambio de código que no agrega funcionalidad
- `perf`: Mejora de performance
- `test`: Agregar/actualizar tests
- `chore`: Actualizar tareas de build, config, etc

**Ejemplos**:
```bash
feat(cart): add persistent localStorage cart
fix(prices): correct CLP price formatting
docs(readme): update installation instructions
refactor(product): extract product card component
perf(search): implement debouncing for search input
```

### Pull Request Template

```markdown
## Descripción
Breve descricripción de los cambios

## Tipo de cambio
- [ ] Bug fix (non-breaking change que fixea un issue)
- [ ] New feature (non-breaking change que agrega funcionalidad)
- [ ] Breaking change (fix o feature que causa breaking change)
- [ ] Documentation update

## Cómo probar
Pasos para probar los cambios

## Screenshots (si aplica)
Agregar screenshots antes/después

## Checklist
- [ ] Mi código sigue las guías de estilo
- [ ] Me he auto-revisado
- [ ] He comentado código complejo
- [ ] He actualizado la documentación
- [ ] No hay nuevos warnings
- [ ] He agregado tests que prueban mis cambios
- [ ] Todos los tests pasan
```

---

## Code Review Checklist

### Funcionalidad
- [ ] El código funciona según lo esperado
- [ ] No hay bugs obvios
- [ ] Se manejan edge cases
- [ ] Hay manejo de errores apropiado

### Calidad de Código
- [ ] El código es legible y fácil de entender
- [ ] Sigue las convenciones del proyecto
- [ ] No hay código duplicado
- [ ] Usa tipos TypeScript apropiados
- [ ] No hay `any` types sin justificación

### Performance
- [ ] No hay memory leaks
- [ ] No hay re-renders innecesarios
- [ ] Las imágenes están optimizadas
- [ ] No hay fetching excesivo

### Testing
- [ ] Hay tests para funcionalidad crítica
- [ ] Los tests pasan
- [ ] Los tests cubren edge cases

### Documentación
- [ ] Hay comentarios en código complejo
- [ ] La documentación está actualizada
- [ ] Los cambios están documentados en el PR

### Estilos y UX
- [ ] El diseño es consistente
- [ ] Es responsive
- [ ] Tiene estados de loading
- [ ] Tiene manejo de errores amigable

---

## Recursos Adicionales

### Links Útiles

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [WooCommerce GraphQL API](https://woocommerce.github.io/woocommerce-rest-api-docs/)

### Extensiones de VS Code Recomendadas

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)
- Error Lens
- GitLens

### Snippets Útiles

```json
// Next.js Page Component
{
  "NextPage": {
    "prefix": "next-page",
    "body": [
      "export default async function ${1:PageName}({ params }: { params: Promise<{ slug: string }> }) {",
      "  const { slug } = await params;",
      "  ",
      "  return (",
      "    <div>",
      "      ${0}",
      "    </div>",
      "  );",
      "}"
    ]
  },

  // React Component
  {
    "ReactComponent": {
      "prefix": "rc",
      "body": [
        "interface ${1:ComponentName}Props {",
        "  ${2}",
        "}",
        "",
        "export function ${1:ComponentName}({ ${3} }: ${1:ComponentName}Props) {",
        "  return (",
        "    <div>",
        "      ${0}",
        "    </div>",
        "  );",
        "}"
      ]
    }
  },

  // TypeScript Interface
  {
    "Interface": {
      "prefix": "ts-interface",
      "body": [
        "interface ${1:Name} {",
        "  ${2}: ${3:string};",
        "}"
      ]
    }
  }
}
```

---

**Última actualización**: Marzo 2026
**Versión**: 1.0.0

# Checklist: Migración de Productos

## 📋 Resumen
Migrar módulo de productos desde Shopify Storefront API a WPGraphQL (WooCommerce)

---

## 🎯 Objetivos
- [ ] Mapear queries de productos Shopify → WooCommerce
- [ ] Actualizar tipos TypeScript
- [ ] Adaptar componentes de producto
- [ ] Migrar variantes y atributos
- [ ] Testing completo

---

## 1️⃣ Configuración Base

### Backend (WordPress)
- [ ] WPGraphQL instalado y activado
- [ ] WPGraphQL for WooCommerce instalado
- [ ] Productos creados en WooCommerce
- [ ] Variantes configuradas (si aplica)
- [ ] Imágenes de productos subidas
- [ ] Categorías y tags creados

### Frontend (Next.js)
- [ ] Crear `lib/woocommerce/index.ts` (cliente base)
- [ ] Crear `lib/woocommerce/types.ts` (tipos WooCommerce)
- [ ] Crear `lib/woocommerce/queries/` (queries)
- [ ] Configurar variables de entorno
- [ ] Testear conexión GraphQL

---

## 2️⃣ Queries a Migrar

| Query Shopify | Query WooCommerce | Estado |
|---------------|-------------------|--------|
| `getProduct(handle)` | `product(id: SLUG)` | ⬜ |
| `getProducts(sortKey)` | `products(where: {...})` | ⬜ |
| `getProductRecommendations(id)` | No nativo - implementar custom | ⬜ |
| `getCollection(handle)` | `productCategory(id: SLUG)` | ⬜ |
| `getCollections()` | `productCategories` | ⬜ |
| `predictiveSearch(query)` | `products(where: {search})` | ⬜ |

### Detalle de Queries

#### getProduct
- [ ] Crear `lib/woocommerce/queries/product.ts`
- [ ] Mapear campos:
  - [ ] `handle` → `slug`
  - [ ] `title` → `name`
  - [ ] `priceRange` → `price` / `regularPrice`
  - [ ] `images.nodes[].url` → `image.sourceUrl`
  - [ ] `variants` → `variations.nodes`
  - [ ] `selectedOptions` → `attributes.nodes`
- [ ] Crear fragment reutilizable
- [ ] Testear con productos simples
- [ ] Testear con productos variables

#### getProducts
- [ ] Crear `lib/woocommerce/queries/products.ts`
- [ ] Mapear sorting:
  - [ ] `BEST_SELLING` → `orderby: POPULARITY`
  - [ ] `CREATED_AT` → `orderby: DATE`
  - [ ] `PRICE` → `orderby: PRICE`
  - [ ] `reverse` → `order: DESC/ASC`
- [ ] Implementar paginación
- [ ] Implementar filtros
- [ ] Testear ordenamiento

#### getCollection / getCollections
- [ ] Crear `lib/woocommerce/queries/collection.ts`
- [ ] Mapear `collections` → `productCategories`
- [ ] Adaptar `handle` → `slug`
- [ ] Adaptar estructura de imagen
- [ ] Testear listado y detalle

---

## 3️⃣ Tipos TypeScript

### Archivo: `lib/woocommerce/types.ts`

- [ ] Definir `WooProduct` interface
- [ ] Definir `WooProductVariant` interface
- [ ] Definir `WooProductCategory` interface
- [ ] Definir `WooProductImage` interface
- [ ] Definir `WooPrice` interface
- [ ] Crear type guards para validación
- [ ] Exportar tipos para uso en componentes

### Campos a Mapear

| Shopify Type | WooCommerce Type | Notas |
|--------------|------------------|-------|
| `Product.handle` | `Product.slug` | Direct mapping |
| `Product.title` | `Product.name` | Direct mapping |
| `Product.priceRange` | `Product.price` (string) | WooCommerce es string HTML |
| `ProductVariant.selectedOptions` | `ProductAttribute.nodes[]` | Different structure |
| `ProductImage.url` | `MediaItem.sourceUrl` | Direct mapping |

---

## 4️⃣ Componentes a Adaptar

### Página de Producto
- [ ] `app/products/[handle]/page.tsx` → `app/products/[slug]/page.tsx`
- [ ] Actualizar `generateMetadata` para WooCommerce
- [ ] Adaptar llamada `getProduct(params.slug)`
- [ ] Actualizar prop `handle` → `slug`

#### GalleryCustom
- [ ] Adaptar `images.nodes` → `image` + `galleryImages.nodes`
- [ ] Actualizar tipo de imagen
- [ ] Testear zoom y navegación

#### VariantSelector
- [ ] Adaptar `selectedOptions` → `attributes.nodes`
- [ ] Actualizar lógica de disponibilidad
- [ ] Mapear `variant.id` → `variation.id`
- [ ] Testear selección de variantes

#### ProductDescriptionCustom
- [ ] Actualizar `product.title` → `product.name`
- [ ] Parsear precio HTML si es necesario
- [ ] Actualizar `compareAtPrice` → `regularPrice`

### Productos Relacionados
- [ ] Implementar custom query (no nativo en WooCommerce)
- [ ] Opciones:
  - [ ] Productos de misma categoría
  - [ ] Productos con mismos tags
  - [ ] Productos recientes
- [ ] Testear rendimiento

---

## 5️⃣ Context y Hooks

### ProductContext
- [ ] Actualizar `ProductContext` en `components/product/product-context.tsx`
- [ ] Adaptar lógica de variantes
- [ ] Cambiar `selectedOptions` → `selectedAttributes`
- [ ] Actualizar `updateOption()` para WooCommerce

### useProduct
- [ ] Actualizar tipo de retorno
- [ ] Adaptar helpers de variantes
- [ ] Testear en componentes

---

## 6️⃣ Performance y Cache

### Cache Tags
- [ ] Actualizar `TAGS.products` → `woocommerce-products`
- [ ] Configurar revalidación por webhooks
- [ ] Implementar ISR para páginas de producto
- [ ] Configurar revalidate time

### Optimizaciones
- [ ] Implementar fragments para campos repetidos
- [ ] Reducir payload de queries
- [ ] Lazy load de imágenes
- [ ] Testear LCP (Largest Contentful Paint)

---

## 7️⃣ Testing

### Unit Tests
- [ ] Test queries de productos
- [ ] Test mapeo de tipos
- [ ] Test variant selector logic
- [ ] Test price parsing

### Integration Tests
- [ ] Test página de producto carga
- [ ] Test selección de variantes
- [ ] Test imágenes galería
- [ ] Test productos relacionados

### Manual QA
- [ ] Producto simple sin variantes
- [ ] Producto variable (talla/color)
- [ ] Producto agotado
- [ ] Producto en oferta
- [ ] Producto con muchas imágenes
- [ ] SEO metadata

---

## 8️⃣ Launch Checklist

- [ ] Todos los tests pasan
- [ ] No errores en consola
- [ ] Performance metrics OK
- [ ] SEO metadata correcta
- [ ] Imágenes cargando correctamente
- [ ] Variantes funcionando
- [ ] Prod/Staging environments testeados
- [ ] Documentación actualizada

---

## 🚨 Issues Conocidos

| Issue | Solución | Estado |
|-------|----------|--------|
| WooCommerce price es HTML string | Parsear con DOMParser o regex | ⬜ |
| No native recommendations | Implementar custom query | ⬜ |
| Variations structure diferente | Adaptar VariantSelector | ⬜ |
| Image gallery structure diff | Adaptar GalleryCustom | ⬜ |

---

## 📝 Notas

```
Estructura de productos WooCommerce:
- SimpleProduct: Sin variaciones
- VariableProduct: Con variaciones (talla, color, etc.)
- ExternalProduct: Producto externo (affiliate)
- GroupedProduct: Productos agrupados
```

---

## 🔗 Links Útiles

- [WPGraphQL for WooCommerce - Products](https://woographql.com/docs/products/)
- [WooCommerce Products REST API](https://woocommerce.github.io/woocommerce-rest-api-docs/#products)
- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)

---

*Última actualización: 2026-02-11*

# Plan de Migración: Shopify → WooCommerce

## 📊 Estado General
- **Proyecto**: Servigreen (rusovan)
- **Origen**: Shopify Headless (GraphQL Storefront API)
- **Destino**: WooCommerce Headless (WPGraphQL)
- **Fecha inicio**: 2026-02-11

---

## ✅ Checklist General

| Fase | Estado | Progreso | Notas |
|------|--------|----------|-------|
| **1. Setup WooCommerce** | 🟡 Pending | 0% | Plugins instalándose |
| **2. Configurar WPGraphQL** | 🔴 Not Started | 0% | Verificar endpoint /graphql |
| **3. Migrar Queries** | 🔴 Not Started | 0% | Productos, colecciones, búsqueda |
| **4. Migrar Mutations** | 🔴 Not Started | 0% | Carrito, checkout |
| **5. Adaptar Frontend** | 🔴 Not Started | 0% | Componentes, contexts |
| **6. Testing** | 🔴 Not Started | 0% | QA completo |
| **7. Deploy** | 🔴 Not Started | 0% | Producción |

---

## 📁 Estructura de Documentación

```
migration/
├── docs/                   # Documentación general
│   ├── 00-MIGRATION-PLAN.md      # Este archivo
│   ├── 01-shopify-analysis.md    # Análisis actual
│   ├── 02-woocommerce-queries.md  # Queries de WooCommerce
│   └── 03-mapping-guide.md        # Mapeo Shopify → WooCommerce
├── helpers/                 # Scripts y utilidades
│   ├── compare-queries.ts        # Comparador de queries
│   ├── schema-validator.ts        # Validador de schema
│   └── test-queries.ts            # Tester de queries WooCommerce
├── checklists/              # Checklists por módulo
│   ├── products.md                 # Productos
│   ├── cart.md                     # Carrito
│   ├── checkout.md                 # Checkout
│   └── search.md                   # Búsqueda
└── schemas/                 # Schemas de referencia
    ├── shopify-schema.ts           # Types actuales
    └── woocommerce-schema.ts       # Types nuevos
```

---

## 🎯 Objetivos de la Migración

### Mantener
- ✅ Arquitectura GraphQL (mismo patrón)
- ✅ Next.js App Router
- ✅ Server Actions para mutaciones
- ✅ Patrones de cache
- ✅ UX/UI existente

### Reemplazar
- 🔄 `lib/shopify/` → `lib/woocommerce/`
- 🔄 Shopify GraphQL queries → WooCommerce GraphQL queries
- 🔄 Checkout de Shopify → Checkout de WooCommerce

### Mejorar
- ⭐ Checkout integrado (sin redirección externa)
- ⭐ Mayor control sobre el flujo de compra

---

## 🔗 Recursos

- [WooGraphQL Docs](https://woographql.com/docs)
- [WPGraphQL GitHub](https://github.com/wp-graphql/wp-graphql-woocommerce)
- [Next.js + WooCommerce Guide](https://www.webbycrown.com/headless-woocommerce-rest-api/)

---

## 📝 Notas Importantes

### Configuración WooCommerce Necesaria
- [ ] Instalar WPGraphQL
- [ ] Instalar WPGraphQL for WooCommerce
- [ ] Configurar permalinks en WordPress
- [ ] Verificar endpoint: `https://tu-sitio.com/graphql`
- [ ] Configurar CORS si es necesario

### Diferencias Clave Shopify → WooCommerce
| Concepto | Shopify | WooCommerce |
|----------|---------|-------------|
| Producto | `handle` | `slug` |
| Variante | `selectedOptions` | `attributes` |
| Carrito | `checkoutUrl` | Checkout manual |
| Imagen | `url` | `sourceUrl` |
| Precio | `priceRange` | `price` / `regularPrice` |

---

## 🚨 Bloqueantes Actuales
- Ninguno por el momento

---

## 📅 Próximos Pasos
1. ✅ Esperar confirmación de plugins instalados
2. [ ] Crear `lib/woocommerce/index.ts` (cliente base)
3. [ ] Mapear queries de productos
4. [ ] Migrar carrito

---

*Última actualización: 2026-02-11*

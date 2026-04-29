# Checklist: Migración del Carrito

## 📋 Resumen
Migrar el módulo de carrito desde Shopify Storefront API a WPGraphQL (WooCommerce)

---

## 🎯 Objetivos
- [ ] Migrar mutations del carrito
- [ ] Actualizar CartContext
- [ ] Adaptar componentes del carrito
- [ ] Implementar checkout de WooCommerce
- [ ] Testing completo del flujo de compra

---

## 1️⃣ Diferencias Arquitectónicas Clave

### Shopify Carrito
```
- Cart ID único (GID)
- checkoutUrl nativo (redirección a Shopify)
- Mutaciones: cartLinesAdd, cartLinesUpdate, cartLinesRemove
- Estructura: cart.lines.nodes
```

### WooCommerce Carrito
```
- Session-based (WordPress session)
- NO tiene checkoutUrl nativo → implementar custom
- Mutations: addToCart, updateCartItems, removeCartItem
- Estructura: cart.contents.nodes
```

---

## 2️⃣ Configuración Base

### Backend (WordPress/WooCommerce)
- [ ] WooCommerce instalado y configurado
- [ ] WPGraphQL for WooCommerce activado
- [ ] Configuración de checkout WooCommerce
  - [ ] Métodos de pago
  - [ ] Zonas de envío
  - [ ] Impuestos configurados
- [ ] Configuración de sesión WooCommerce
- [ ] CORS configurado si es necesario

### Frontend (Next.js)
- [ ] Crear `lib/woocommerce/mutations/cart.ts`
- [ ] Crear `lib/woocommerce/queries/cart.ts`
- [ ] Actualizar `components/cart/cart-context.tsx`
- [ ] Crear checkout page si es necesario

---

## 3️⃣ Mutations a Migrar

| Shopify | WooCommerce | Estado |
|---------|-------------|--------|
| `createCart` | No necesario (session-based) | ⬜ |
| `addToCart(cartId, lines)` | `addToCart(productId, quantity)` | ⬜ |
| `cartLinesUpdate(cartId, lines)` | `updateCartItems(items: [{key, quantity}])` | ⬜ |
| `cartLinesRemove(cartId, lineIds)` | No nativo - implementar custom | ⬜ |
| `getCart(cartId)` | `cart` (query sin parámetros) | ⬜ |

### Detalle de Mutations

#### addToCart
**Shopify:**
```graphql
mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart { id }
  }
}
```

**WooCommerce:**
```graphql
mutation addToCart($productId: Int!, $quantity: Int) {
  addToCart(input: { productId: $productId, quantity: $quantity }) {
    cart { subtotal total }
  }
}
```

##### Tareas
- [ ] Crear `lib/woocommerce/mutations/cart.ts`
- [ ] Implementar `addToCart` para productos simples
- [ ] Implementar `addToCart` para productos variables (con variationId)
- [ ] Manejar errores de stock
- [ ] Testear stock validation

#### updateCartItems
**WooCommerce:**
```graphql
mutation updateCart($items: [CartItemInput]!) {
  updateCartItems(input: { items: $items }) {
    cart { contents { nodes { key quantity } } }
  }
}
```

##### Tareas
- [ ] Implementar `updateCartItems`
- [ ] Mapear item key correctamente
- [ ] Testear increment/decrement
- [ ] Validar stock al actualizar

#### removeFromCart
⚠️ **No nativo en WPGraphQL**

##### Opciones:
1. **Opción A**: quantity = 0
   ```graphql
   updateCartItems(input: { items: [{key: "abc", quantity: 0}] })
   ```

2. **Opción B**: Backend custom endpoint

##### Tareas
- [ ] Elegir estrategia de eliminación
- [ ] Implementar en `lib/woocommerce/mutations/cart.ts`
- [ ] Testear eliminación
- [ ] Testear carrito vacío

---

## 4️⃣ Queries del Carrito

### getCart
**WooCommerce:**
```graphql
query getCart {
  cart {
    contents {
      nodes {
        key
        product { node { id name slug } }
        variation { node { id name } }
        quantity
        subtotal
        total
      }
    }
    subtotal
    total
    shippingTotal
    feeTotal
    discountTotal
  }
}
```

##### Tareas
- [ ] Crear `lib/woocommerce/queries/cart.ts`
- [ ] Mapear estructura de items
- [ ] Calcular totales localmente si es necesario
- [ ] Implementar cache del carrito
- [ ] Testear con carrito vacío
- [ ] Testear con múltiples items

---

## 5️⃣ CartContext Migration

### Archivo: `components/cart/cart-context.tsx`

#### Cambios Necesarios

| Shopify | WooCommerce | Notas |
|---------|-------------|-------|
| `cartId` cookie | WordPress session | No necesitas cartId |
| `getCart(cartId)` | `getCart()` (no params) | Session-based |
| `createCart()` | No necesario | Cart existe por defecto |
| `checkoutUrl` | Implementar custom | **Cambio mayor** |

#### Tareas

- [ ] Actualizar `CartProvider`:
  - [ ] Remover lógica de `cartId`
  - [ ] Actualizar llamada inicial `getCart()`
  - [ ] Remover `createCart()`
  - [ ] Adaptar `addCartItem` para WooCommerce

- [ ] Actualizar reducer:
  - [ ] Mapear `merchandiseId` → `product.node.id`
  - [ ] Mapear `lines` → `contents.nodes`
  - [ ] Adaptar estructura de items

- [ ] Actualizar `useCart()` hook:
  - [ ] Cambiar tipos
  - [ ] Adaptar retorno de datos
  - [ ] Testear en componentes

---

## 6️⃣ Componentes del Carrito

### CartModal
**Archivo:** `components/cart/modal.tsx`

- [ ] Actualizar iteración de items:
  - [ ] `cart.lines.nodes` → `cart.contents.nodes`
  - [ ] `item.merchandise` → `item.product.node`
  - [ ] `item.merchandise.product` → `item.product.node`

- [ ] Actualizar cálculos:
  - [ ] `cart.cost.totalAmount` → `cart.total`
  - [ ] `cart.cost.subtotalAmount` → `cart.subtotal`

- [ ] Actualizar imagen:
  - [ ] `merchandise.image.url` → `product.node.image.sourceUrl`

### AddToCart
**Archivo:** `components/cart/add-to-cart.tsx`

- [ ] Adaptar Server Action `addItem`
- [ ] Cambiar parámetros:
  - [ ] `selectedVariantId` → `productId` + `variationId`
- [ ] Actualizar manejo de errores
- [ ] Testear con producto simple
- [ ] Testear con producto variable

### EditItemQuantityButton
**Archivo:** `components/cart/edit-item-quantity-button.tsx`

- [ ] Actualizar llamada a `updateItemQuantity`
- [ ] Usar `key` en lugar de `merchandiseId`
- [ ] Testear increment y decrement
- [ ] Testear límites de stock

### DeleteItemButton
**Archivo:** `components/cart/delete-item-button.tsx`

- [ ] Implementar estrategia de eliminación
- [ ] Actualizar Server Action `removeItem`
- [ ] Testear visual feedback
- [ ] Testear último item del carrito

### OpenCart
**Archivo:** `components/cart/open-cart.tsx`

- [ ] Actualizar `cart.totalQuantity` → contar items manual
- [ ] Testear badge count
- [ ] Testear animación

---

## 7️⃣ Server Actions

### Archivo: `components/cart/actions.ts`

#### Acciones a Migrar

| Shopify Action | WooCommerce Action | Estado |
|----------------|-------------------|--------|
| `addItem(variantId, qty)` | `addItem(productId, variationId?, qty)` | ⬜ |
| `removeItem(merchandiseId)` | `removeItem(key)` | ⬜ |
| `updateItemQuantity(merchandiseId, qty)` | `updateItemQuantity(key, qty)` | ⬜ |
| `getCheckoutUrl()` | **Reemplazar con checkout custom** | ⬜ |
| `createCartAndSetCookie()` | No necesario | ⬜ |

#### Tareas

- [ ] Reescribir `addItem`:
  - [ ] Aceptar `productId` y `quantity`
  - [ ] Manejar productos variables (`variationId` opcional)
  - [ ] Revalidar cache tags
  - [ ] Manejar errores

- [ ] Reescribir `removeItem`:
  - [ ] Usar `key` del item
  - [ ] Implementar strategy (quantity 0 o custom)

- [ ] Reescribir `updateItemQuantity`:
  - [ ] Validar stock
  - [ ] Revalidar cache

- [ ] Eliminar `createCartAndSetCookie`

---

## 8️⃣ Checkout - CAMBIO MAYOR

### Shopify Approach
```
1. Usuario click "Proceder al Pago"
2. getCheckoutUrl() → URL de Shopify Checkout
3. Redirección a checkout.tudominio.com
4. Pago en Shopify
5. Return to site
```

### WooCommerce Options

#### Opción A: Checkout Page en Next.js ⭐ Recomendada
```
1. Usuario click "Proceder al Pago"
2. Navegación a /checkout
3. Formulario de pago en Next.js
4. Procesar pago con WooCommerce REST API o payment gateway
5. Mostrar confirmación
```

#### Opción B: WooCommerce Checkout nativo
```
1. Usuario click "Proceder al Pago"
2. Redirección a /checkout de WordPress
3. Pago en WordPress
4. Redirección de vuelta a Next.js
```

#### Opción C: Stripe Checkout direct
```
1. Usuario click "Proceder al Pago"
2. Crear Stripe Checkout Session
3. Redirección a Stripe
4. Stripe webhook → crear orden WooCommerce
5. Return to site
```

##### Tareas Checkout

- [ ] Elegir estrategia de checkout
- [ ] Implementar checkout flow
- [ ] Crear página de checkout si aplica
- [ ] Integrar pasarela de pago
- [ ] Testear flujo completo
- [ ] Configurar webhooks
- [ ] Manejar errores de pago
- [ ] Página de confirmación

---

## 9️⃣ Testing

### Unit Tests
- [ ] Test mutations del carrito
- [ ] Test reducers del CartContext
- [ ] Test cálculos de totales
- [ ] Test Server Actions

### Integration Tests
- [ ] Test agregar al carrito
- [ ] Test actualizar cantidad
- [ ] Test eliminar item
- [ ] Test carrito vacío
- [ ] Test múltiples items
- [ ] Test stock validation
- [ ] Test checkout flow completo

### Manual QA
- [ ] Agregar producto simple
- [ ] Agregar producto variable
- [ ] Actualizar cantidad
- [ ] Eliminar item
- [ ] Carrito persiste en refresh
- [ ] Checkout completo
- [ ] Pago exitoso
- [ ] Pago fallido
- [ ] Stock agotado durante checkout
- [ ] Múltiples productos en carrito

---

## 🔟 Launch Checklist

- [ ] Todos los tests pasan
- [ ] Carrito persiste correctamente
- [ ] Stock validado correctamente
- [ ] Totales calculados correctamente
- [ ] Checkout funciona end-to-end
- [ ] Errores de pago manejados
- [ ] Webhooks configurados
- [ ] Emails de orden enviados
- [ ] Analytics configurados
- [ ] Performance OK (carrito carga rápido)

---

## 🚨 Issues Conocidos

| Issue | Solución | Estado |
|-------|----------|--------|
| No cart ID (session-based) | Adaptar CartContext | ⬜ |
| No native checkoutUrl | Implementar custom checkout | ⬜ |
| Price is HTML string | Parsear o usar raw fields | ⬜ |
| removeCartItem not native | Use quantity 0 o custom endpoint | ⬜ |
| Key structure different | Adaptar a usar `key` field | ⬜ |

---

## 📝 Notas

```
WooCommerce Cart Structure:
- contents.nodes[].key: Identificador único del item en carrito
- contents.nodes[].product.node: Producto base
- contents.nodes[].variation.node: Variación (si aplica)
- Cart totals pueden incluir HTML: <span class="...">$10.00</span>
```

---

## 🔗 Links Útiles

- [WPGraphQL for WooCommerce - Cart](https://woographql.com/docs/cart/)
- [WooCommerce Checkout Docs](https://woocommerce.com/documentation/woocommerce-checkout/)
- [WooCommerce REST API - Orders](https://woocommerce.github.io/woocommerce-rest-api-docs/#orders)

---

*Última actualización: 2026-02-11*

# Arquitectura del Carrito de Compras

## 📋 Índice

1. [Visión General](#visión-general)
2. [Arquitectura de Datos](#arquitectura-de-datos)
3. [Flujo de Usuario](#flujo-de-usuario)
4. [Componentes del Carrito](#componentes-del-carrito)
5. [Persistencia de Datos](#persistencia-de-datos)
6. [Integración con WhatsApp](#integración-con-whatsapp)
7. [Debugging y Testing](#debugging-y-testing)

---

## Visión General

El carrito de compras de Pinneacle Perfumería es una implementación **100% client-side** que utiliza `localStorage` para la persistencia de datos. No requiere backend adicional ni base de datos propia.

### Características Principales:

- ✅ **Sin estado en servidor**: Toda la lógica es client-side
- ✅ **Persistencia local**: Los datos sobreviven a recargas de página
- ✅ **Actualizaciones optimistas**: UI responde inmediatamente
- ✅ **Checkout via WhatsApp**: No procesa pagos online
- ✅ **Validaciones**: Stock, cantidad máxima, variaciones

---

## Arquitectura de Datos

### Estructura del Carrito

```typescript
// localStorage key
const CART_STORAGE_KEY = 'pinneacle_cart';

// Estructura de datos
interface CartState {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
}

interface CartItem {
  id: string;                    // ID del producto o variación
  quantity: number;              // Cantidad (1-99)
  product: {
    title: string;               // Nombre del producto
    handle: string;              // Slug para el link
    priceRange: {
      minVariantPrice: {
        amount: string;          // Precio como string
        currencyCode: string;    // "CLP"
      };
    };
    featuredImage?: {
      url: string;               // URL de la imagen
      altText: string;           // Alt text para accesibilidad
      width: number;
      height: number;
    };
  };
}
```

### Ejemplo de Datos

```json
{
  "items": [
    {
      "id": "123",
      "quantity": 2,
      "product": {
        "title": "H66 - Inspiracion JPG Scandal Pour Homme",
        "handle": "h66-inspiracion-jpg-scandal-pour-homme",
        "priceRange": {
          "minVariantPrice": {
            "amount": "$19,990",
            "currencyCode": "CLP"
          }
        },
        "featuredImage": {
          "url": "https://...",
          "altText": "H66 - Inspiracion JPG Scandal Pour Homme",
          "width": 800,
          "height": 800
        }
      }
    }
  ],
  "totalItems": 2,
  "subtotal": 39980
}
```

---

## Flujo de Usuario

### 1. Agregar al Carrito

```
Usuario hace clic en "Agregar al Carrito"
    ↓
ProductDescriptionWoo.handleAddToCart()
    ↓
Validación:
  - ¿Es producto variable?
  - ¿Hay variación seleccionada?
  - ¿Hay stock disponible?
    ↓
CartProvider.addToCart()
    ↓
Validación:
  - ¿Producto ya existe en carrito?
    - Sí: Incrementar cantidad
    - No: Agregar nuevo item
    ↓
Actualizar localStorage
    ↓
Recalcular totales
    ↓
Actualizar estado (React)
    ↓
UI se actualiza (optimistic)
    ↓
Mostrar notificación (toast)
    ↓
Abrir CartDrawer
```

### 2. Cambiar Cantidad

```
Usuario hace clic en + o -
    ↓
CartProvider.updateQuantity()
    ↓
Validación:
  - ¿Nueva cantidad >= 1?
  - ¿Nueva cantidad <= stock?
    ↓
Actualizar item.quantity
    ↓
Si quantity === 0:
  - Eliminar item del carrito
    ↓
Actualizar localStorage
    ↓
Recalcular totales
    ↓
Actualizar estado
```

### 3. Eliminar Producto

```
Usuario hace clic en eliminar
    ↓
CartProvider.removeItem()
    ↓
Filtrar items para remover el item
    ↓
Actualizar localStorage
    ↓
Recalcular totales
    ↓
Actualizar estado
    ↓
Cerrar drawer si carrito vacío
```

### 4. Checkout (WhatsApp)

```
Usuario hace clic en "Finalizar Compra"
    ↓
CartDrawer.handleCheckout()
    ↓
Generar mensaje de WhatsApp:
  - Recorrer items del carrito
  - Formatear: "Producto (x$quantity)"
  - Sumar total
    ↓
Codificar URL
    ↓
Redirigir a:
  https://wa.me/56946152919?text={mensaje}
    ↓
WhatsApp se abre con el pedido
```

---

## Componentes del Carrito

### 1. CartProvider

**Ubicación**: `components/providers/CartProvider.tsx`

**Responsabilidades**:
- Gestionar estado global del carrito
- Proveer funciones CRUD
- Persistir en localStorage
- Calcular totales

**API**:

```typescript
interface CartContextType {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  isOpen: boolean;

  // Acciones
  addToCart: (id: string, quantity: number, product: any) => Promise<boolean>;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

// Hook para usar el contexto
export const useCart = () => useContext(CartContext);
```

**Implementación clave**:

```typescript
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CART_STORAGE_KEY = 'pinneacle_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Cargar desde localStorage al montar
  useEffect(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const { items: storedItems } = JSON.parse(stored);
      setItems(storedItems);
    }
  }, []);

  // Guardar en localStorage cuando cambian los items
  useEffect(() => {
    if (items.length > 0 || localStorage.getItem(CART_STORAGE_KEY)) {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify({ items })
      );
    }
  }, [items]);

  // Calcular totales
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => {
    const price = parseFloat(
      item.product.priceRange.minVariantPrice.amount.replace(/[$.]/g, '')
    );
    return sum + (price * item.quantity);
  }, 0);

  // Agregar al carrito
  const addToCart = async (id: string, quantity: number, product: any) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === id);

      if (existingItem) {
        // Ya existe, incrementar cantidad
        return prevItems.map(item =>
          item.id === id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Nuevo item
        return [...prevItems, { id, quantity, product }];
      }
    });

    setIsOpen(true);
    return true;
  };

  // Actualizar cantidad
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  // Eliminar item
  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  return (
    <CartContext.Provider value={{
      items,
      totalItems,
      subtotal,
      isOpen,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart: () => setItems([]),
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
    }}>
      {children}
    </CartContext.Provider>
  );
}
```

### 2. CartIcon

**Ubicación**: `components/cart/CartIcon.tsx`

**Responsabilidades**:
- Mostrar contador de items
- Abrir/crear drawer
- Indicador visual de items en carrito

**UI**:
```tsx
<button
  onClick={openCart}
  className="relative p-2 text-gray-300 hover:text-white"
>
  <ShoppingBagIcon className="h-6 w-6" />

  {/* Badge con contador */}
  {totalItems > 0 && (
    <span className="absolute -top-1 -right-1 bg-[#101828] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
      {totalItems}
    </span>
  )}
</button>
```

### 3. CartDrawer

**Ubicación**: `components/cart/CartDrawer.tsx`

**Responsabilidades**:
- Mostrar lista de productos
- Controles de cantidad
- Botón de eliminar
- Subtotal
- Botón de checkout

**Layout**:
```
┌─────────────────────────────┐
│  Tu Carrito (X)            │
├─────────────────────────────┤
│  ┌───────────────────────┐  │
│  │ Producto 1            │  │
│  │ [IMG]   $19.990      │  │
│  │         [-] 2 [+]    │  │
│  │         [Eliminar]   │  │
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │ Producto 2            │  │
│  │ [IMG]   $34.990      │  │
│  │         [-] 1 [+]    │  │
│  │         [Eliminar]   │  │
│  └───────────────────────┘  │
├─────────────────────────────┤
│  Subtotal: $54.980          │
│  [Finalizar Compra]         │
│  [Continuar Comprando]      │
└─────────────────────────────┘
```

**Animaciones**:
- Entrada: Slide in desde derecha
- Salida: Slide out a derecha
- Duración: 300ms
- Easing: ease-in-out

---

## Persistencia de Datos

### localStorage Strategy

```typescript
const CART_STORAGE_KEY = 'pinneacle_cart';

// Guardar
function saveCart(items: CartItem[]) {
  const cartData = {
    items,
    updatedAt: new Date().toISOString()
  };
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
}

// Cargar
function loadCart(): CartItem[] {
  const stored = localStorage.getItem(CART_STORAGE_KEY);
  if (!stored) return [];

  try {
    const { items, updatedAt } = JSON.parse(stored);

    // Validar que no sea muy antiguo (7 días)
    const age = Date.now() - new Date(updatedAt).getTime();
    const MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 días

    if (age > MAX_AGE) {
      localStorage.removeItem(CART_STORAGE_KEY);
      return [];
    }

    return items;
  } catch (error) {
    console.error('Error loading cart:', error);
    return [];
  }
}

// Limpiar
function clearCart() {
  localStorage.removeItem(CART_STORAGE_KEY);
}
```

### Sincronización de Pestañas

```typescript
// Escuchar cambios en otras pestañas
useEffect(() => {
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === CART_STORAGE_KEY && e.newValue) {
      const { items } = JSON.parse(e.newValue);
      setItems(items);
    }
  };

  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
}, []);
```

---

## Integración con WhatsApp

### Formato del Mensaje

```typescript
function generateWhatsAppMessage(items: CartItem[], subtotal: number): string {
  let message = 'Hola Pinneacle Perfumería, me gustaría comprar:\n\n';

  items.forEach(item => {
    const price = item.product.priceRange.minVariantPrice.amount;
    message += `• ${item.product.title}\n`;
    message += `  Cantidad: ${item.quantity}\n`;
    message += `  Precio unitario: ${price}\n\n`;
  });

  message += `\n💰 *Total: $${subtotal.toLocaleString('es-CL')}*`;
  message += '\n\n¿Podrían confirmar disponibilidad y medios de pago?';

  return message;
}
```

### URL de WhatsApp

```typescript
const PHONE_NUMBER = '56946152919'; // +56 9 4615 2919

function createWhatsAppURL(message: string): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${PHONE_NUMBER}?text=${encodedMessage}`;
}

// Uso
const message = generateWhatsAppMessage(items, subtotal);
const whatsappURL = createWhatsAppURL(message);

// Redirigir
window.location.href = whatsappURL;
```

### Ejemplo de Mensaje Generado

```
Hola Pinneacle Perfumería, me gustaría comprar:

• H66 - Inspiracion JPG Scandal Pour Homme
  Cantidad: 2
  Precio unitario: $19.990

• Club De Nuit Intense EDT
  Cantidad: 1
  Precio unitario: $34.990

💰 Total: $74.970

¿Podrían confirmar disponibilidad y medios de pago?
```

---

## Debugging y Testing

### Debug Mode

Activar logs detallados del carrito:

```typescript
// En CartProvider
const DEBUG = process.env.NODE_ENV === 'development';

const addToCart = async (id: string, quantity: number, product: any) => {
  if (DEBUG) {
    console.log('[Cart] Adding to cart:', { id, quantity, product });
  }

  // ... lógica

  if (DEBUG) {
    console.log('[Cart] Updated items:', items);
    console.log('[Cart] Saved to localStorage:', CART_STORAGE_KEY);
  }
};
```

### Testing Manual

1. **Agregar producto**:
   ```
   1. Abrir DevTools → Application → Local Storage
   2. Ir a una página de producto
   3. Hacer clic en "Agregar al Carrito"
   4. Verificar que 'pinneacle_cart' existe y tiene datos correctos
   ```

2. **Persistencia**:
   ```
   1. Agregar productos al carrito
   2. Recargar la página (F5)
   3. Verificar que el carrito mantiene los items
   ```

3. **Cantidad**:
   ```
   1. Abrir carrito
   2. Hacer clic en + y -
   3. Verificar que la cantidad se actualiza
   4. Verificar que el contador del icono se actualiza
   ```

4. **Eliminar**:
   ```
   1. Abrir carrito
   2. Hacer clic en "Eliminar"
   3. Verificar que el item desaparece
   4. Verificar que el subtotal se recalcula
   ```

5. **Checkout**:
   ```
   1. Agregar productos al carrito
   2. Hacer clic en "Finalizar Compra"
   3. Verificar que WhatsApp se abre con el mensaje correcto
   ```

### Diagnostic Tool

**Endpoint**: `/api/diagnostico-carrito`

**Uso**: Verificar estado del carrito en localStorage

```bash
curl http://localhost:3000/api/diagnostico-carrito
```

**Response**:
```json
{
  "exists": true,
  "itemCount": 2,
  "totalItems": 3,
  "subtotal": 59970,
  "items": [
    {
      "id": "123",
      "title": "Producto 1",
      "quantity": 2,
      "price": "$19.990"
    }
  ]
}
```

---

## Troubleshooting

### Problema: Carrito no persiste

**Causas**:
- localStorage deshabilitado
- Navegador en modo incógnito
- Error al guardar (cuota llena)

**Solución**:
```typescript
// Verificar soporte de localStorage
function isLocalStorageAvailable(): boolean {
  try {
    const test = '__test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

// Usar fallback si no está disponible
if (!isLocalStorageAvailable()) {
  alert('Tu navegador no soporta localStorage. El carrito no funcionará correctamente.');
}
```

### Problema: Items duplicados

**Causa**: Múltiples llamadas a `addToCart`

**Solución**:
```typescript
// Debounce o bloquear click durante la operación
const [isAdding, setIsAdding] = useState(false);

const handleAddToCart = async () => {
  if (isAdding) return;

  setIsAdding(true);
  try {
    await addToCart(productId, quantity, productData);
  } finally {
    setIsAdding(false);
  }
};
```

### Problema: Precios incorrectos

**Causa**: Formato de precio no limpio

**Solución**:
```typescript
// Limpiar precio antes de calcular
function cleanPrice(price: string): number {
  // Remover símbolos y separadores
  const cleaned = price
    .replace(/[$.]/g, '')     // Remover $ y puntos (miles)
    .replace(/,/g, '');       // Remover comas (decimales)

  return parseFloat(cleaned) || 0;
}

// Usar
const price = cleanPrice(item.product.priceRange.minVariantPrice.amount);
const itemTotal = price * item.quantity;
```

---

## Mejoras Futuras

### Posibles Optimizaciones

1. **Sincronización con servidor**:
   - Guardar carrito en base de datos
   - Recuperar carrito al iniciar sesión

2. **Stock en tiempo real**:
   - Validar stock con WooCommerce antes de agregar
   - Mostrar stock disponible en el carrito

3. **Persistencia en cuenta**:
   - Guardar carrito por usuario
   - Recuperar al hacer login

4. **Abandoned cart emails**:
   - Detectar carritos abandonados
   - Enviar email de recuperación

5. **Múltiples métodos de checkout**:
   - Pasarela de pago online
   - Transferencia bancaria
   - Webpay

---

**Última actualización**: Marzo 2026

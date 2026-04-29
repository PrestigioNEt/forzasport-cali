'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { getProduct } from '@/lib/woocommerce';

interface LocalCartItem {
  key: string;
  productId: string;
  productName: string;
  productSlug: string;
  variationName?: string;
  price: number;
  priceDisplay: string;
  quantity: number;
  image?: {
    sourceUrl?: string;
    altText?: string;
  };
}

interface LocalCart {
  contents: {
    nodes: LocalCartItem[];
  };
  subtotal: string;
  total: string;
  shippingTotal: string;
  discountTotal: string;
  feeTotal: string;
}

interface CartContextType {
  cart: LocalCart | null;
  itemCount: number;
  isLoading: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (productId: string, quantity?: number, productData?: any) => Promise<boolean>;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  refreshCart: () => void;
}

const CART_STORAGE_KEY = 'pinneacle_cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

// Función para formatear precios en CLP
const formatCLP = (num: number) => {
  const rounded = Math.round(num);
  return '$' + rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// Función para extraer número de precio (maneja ambos formatos)
const parsePrice = (priceStr: string): number => {
  if (!priceStr) return 0;
  let cleaned = priceStr.replace(/[^0-9.,]/g, '') || '0';

  const hasComma = cleaned.includes(',');
  const hasDot = cleaned.includes('.');

  if (hasComma && hasDot) {
    const parts = cleaned.split('.');
    if (parts.length === 2 && parts[1] && parts[1].length <= 2) {
      cleaned = cleaned.replace(/,/g, '').replace(/\.\d+$/, '');
    } else {
      cleaned = cleaned.replace(/,/g, '').replace(/\./g, '');
    }
  } else if (hasDot) {
    const parts = cleaned.split('.');
    if (parts.length > 1 && parts.some(p => p && p.length === 3)) {
      cleaned = cleaned.replace(/\./g, '');
    } else {
      cleaned = Math.round(parseFloat(cleaned)).toString();
    }
  } else if (hasComma) {
    const parts = cleaned.split(',');
    if (parts.length === 2 && parts[1] && parts[1].length <= 2) {
      cleaned = parts[0] || '0';
    } else {
      cleaned = cleaned.replace(/,/g, '');
    }
  }

  return parseFloat(cleaned || '0');
};

// Guardar carrito en localStorage
const saveCart = (cart: LocalCart | null) => {
  if (typeof window !== 'undefined') {
    if (cart) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } else {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }
};

// Cargar carrito desde localStorage
const loadCart = (): LocalCart | null => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
  }
  return null;
};

// Calcular totales del carrito
const calculateCartTotals = (items: LocalCartItem[]) => {
  const subtotal = items.reduce((sum, item) => {
    const priceNum = parsePrice(item.priceDisplay);
    return sum + (priceNum * item.quantity);
  }, 0);

  return {
    subtotal: formatCLP(subtotal),
    total: formatCLP(subtotal),
    shippingTotal: '$0',
    discountTotal: '$0',
    feeTotal: '$0'
  };
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<LocalCart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Cargar carrito desde localStorage al montar
  useEffect(() => {
    const savedCart = loadCart();
    if (savedCart) {
      setCart(savedCart);
    }
  }, []);

  // Guardar carrito en localStorage cuando cambia
  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  const addToCart = useCallback(async (
    productId: string,
    quantity: number = 1,
    productData?: any
  ): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Usar datos proporcionados o obtener de la API
      let product = productData;
      if (!product) {
        product = await getProduct(productId);
      }

      if (!product) {
        alert('Producto no encontrado');
        return false;
      }

      // Extraer precio numérico
      const priceNum = parsePrice(String(product.priceRange?.minVariantPrice?.amount || product.priceRange?.maxVariantPrice?.amount || '0'));

      setCart(prevCart => {
        // Buscar si el producto ya está en el carrito
        const existingItem = prevCart?.contents.nodes.find(
          item => item.productId === productId
        );

        if (existingItem) {
          // Actualizar cantidad
          const updatedNodes = prevCart!.contents.nodes.map(item => {
            if (item.productId === productId) {
              const newQuantity = item.quantity + quantity;
              const newTotal = item.price * newQuantity;
              return {
                ...item,
                quantity: newQuantity,
                priceDisplay: formatCLP(newTotal)
              };
            }
            return item;
          });

          const totals = calculateCartTotals(updatedNodes);
          return {
            ...prevCart!,
            contents: { nodes: updatedNodes },
            ...totals
          };
        } else {
          // Agregar nuevo item
          const priceNum = parsePrice(String(product.priceRange?.minVariantPrice?.amount || product.priceRange?.maxVariantPrice?.amount || '0'));
          const newItem: LocalCartItem = {
            key: `${productId}-${Date.now()}`,
            productId: productId,
            productName: product.title,
            productSlug: product.handle,
            price: priceNum,
            priceDisplay: formatCLP(priceNum * quantity),
            quantity,
            image: product.featuredImage ? {
              sourceUrl: product.featuredImage.url,
              altText: product.featuredImage.altText
            } : undefined
          };

          const updatedNodes = [...(prevCart?.contents.nodes || []), newItem];
          const totals = calculateCartTotals(updatedNodes);

          return {
            contents: { nodes: updatedNodes },
            ...totals
          };
        }
      });

      openCart();
      return true;
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      alert('Error al agregar al carrito');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateQuantity = useCallback((key: string, quantity: number) => {
    if (!cart) return;

    if (quantity < 1) {
      removeItem(key);
      return;
    }

    setCart(prevCart => {
      if (!prevCart) return prevCart;

      const updatedNodes = prevCart.contents.nodes.map(item => {
        if (item.key === key) {
          const pricePerUnit = item.price;
          const newSubtotal = pricePerUnit * quantity;

          return {
            ...item,
            quantity: quantity,
            priceDisplay: formatCLP(newSubtotal)
          };
        }
        return item;
      });

      const totals = calculateCartTotals(updatedNodes);

      return {
        ...prevCart,
        contents: { nodes: updatedNodes },
        ...totals
      };
    });
  }, [cart]);

  const removeItem = useCallback((key: string) => {
    setCart(prevCart => {
      if (!prevCart) return prevCart;

      const updatedNodes = prevCart.contents.nodes.filter(item => item.key !== key);

      if (updatedNodes.length === 0) {
        return null;
      }

      const totals = calculateCartTotals(updatedNodes);

      return {
        ...prevCart,
        contents: { nodes: updatedNodes },
        ...totals
      };
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart(null);
  }, []);

  const refreshCart = useCallback(() => {
    // Recargar desde localStorage
    const savedCart = loadCart();
    setCart(savedCart);
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const itemCount = useMemo(() => {
    if (!cart) return 0;
    return cart.contents.nodes.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const value: CartContextType = {
    cart,
    itemCount,
    isLoading,
    isOpen,
    openCart,
    closeCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

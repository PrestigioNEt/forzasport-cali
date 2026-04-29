'use client';

import { useCart } from '@/components/providers/CartProvider';
import { ShoppingBag } from 'lucide-react';

export function CartIcon() {
  const { itemCount, openCart, isLoading } = useCart();

  return (
    <button
      onClick={openCart}
      disabled={isLoading}
      className="relative p-2 text-gray-300 hover:text-white transition-colors disabled:opacity-50"
      aria-label="Abrir carrito"
    >
      <ShoppingBag className="h-6 w-6" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-green-700 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </button>
  );
}

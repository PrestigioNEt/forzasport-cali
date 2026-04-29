'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/components/providers/CartProvider';

export function CartDrawer() {
  const { cart, isOpen, closeCart, updateQuantity, removeItem, itemCount, isLoading } = useCart();

  // Cerrar carrito con ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transform transition-transform">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="font-belleza text-xl tracking-wide">Tu Carrito</h2>
          <button
            onClick={closeCart}
            className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
            aria-label="Cerrar carrito"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Cargando...</div>
            </div>
          ) : itemCount === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-gray-600 mb-4">Tu carrito está vacío</p>
              <Link
                href="/search"
                onClick={closeCart}
                className="text-green-700 hover:text-green-800 font-medium"
              >
                Explorar productos →
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {cart?.contents.nodes.map((item) => {
                const imageUrl = item.image?.sourceUrl;
                const imageAlt = item.image?.altText || item.productName;

                return (
                  <div key={item.key} className="flex gap-4 pb-6 border-b border-gray-100">
                    {/* Imagen */}
                    <Link
                      href={`/product/${item.productSlug}`}
                      onClick={closeCart}
                      className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100"
                    >
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={imageAlt}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          Sin imagen
                        </div>
                      )}
                    </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${item.productSlug}`}
                      onClick={closeCart}
                      className="font-moderat text-sm font-medium text-gray-900 hover:text-green-700 line-clamp-2"
                    >
                      {item.productName}
                    </Link>

                    {item.variationName && (
                      <p className="text-xs text-gray-500 mt-1">
                        {item.variationName}
                      </p>
                    )}

                    <p className="text-sm font-semibold text-gray-900 mt-2">
                      {item.priceDisplay}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-gray-300 rounded-md bg-white">
                        <button
                          onClick={() => updateQuantity(item.key, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-[#101828] hover:text-white rounded-l-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-12 text-center text-base font-semibold text-gray-900 select-none">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.key, item.quantity + 1)}
                          className="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-[#101828] hover:text-white rounded-r-md transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.key)}
                        className="p-1 text-red-600 hover:text-red-700 transition-colors"
                        aria-label="Eliminar producto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {itemCount > 0 && cart && (
          <div className="border-t border-gray-200 px-6 py-4 space-y-4 bg-gray-50">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">{cart.subtotal}</span>
              </div>
              {cart.shippingTotal && cart.shippingTotal !== '$0' && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Envío</span>
                  <span className="font-medium text-gray-900">{cart.shippingTotal}</span>
                </div>
              )}
              {cart.discountTotal && cart.discountTotal !== '$0' && (
                <div className="flex justify-between text-sm text-green-700">
                  <span>Descuento</span>
                  <span className="font-medium">-{cart.discountTotal}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                <span>Total</span>
                <span className="text-green-700">{cart.total}</span>
              </div>
            </div>

            <Link
              href="/cart"
              onClick={closeCart}
              className="block w-full bg-green-700 text-white text-center py-3 px-6 rounded-lg font-moderat font-medium hover:bg-green-800 transition-colors"
            >
              Ver Carrito
            </Link>

            <Link
              href="/search"
              className="block w-full text-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
              onClick={closeCart}
            >
              Continuar comprando
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

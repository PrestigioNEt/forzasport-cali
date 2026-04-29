'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/components/providers/CartProvider';

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

/**
 * PÁGINA DEL CARRITO - WooCommerce
 * Client Component que usa el contexto del carrito
 */

function EmptyCartMessage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h1 className="font-belleza text-3xl font-light text-gray-900 mb-3">Tu carrito está vacío</h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Parece que aún no has agregado productos. Explora nuestro catálogo y encuentra lo que buscas.
        </p>
        <Link
          href="/search"
          className="inline-flex items-center gap-2 bg-green-700 text-white px-8 py-3 rounded-lg hover:bg-green-800 transition-colors font-medium"
        >
          Explorar Productos
        </Link>
      </div>
    </div>
  );
}

function CartItemCard({ item, onUpdateQuantity, onRemove }: {
  item: LocalCartItem;
  onUpdateQuantity: (key: string, quantity: number) => void;
  onRemove: (key: string) => void;
}) {
  const imageUrl = item.image?.sourceUrl;
  const imageAlt = item.image?.altText || item.productName;

  return (
    <div className="flex gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
      {/* Imagen */}
      <Link
        href={`/product/${item.productSlug}`}
        className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="96px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            Sin imagen
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-4">
          <div className="flex-1">
            <Link
              href={`/product/${item.productSlug}`}
              className="font-moderat font-medium text-gray-900 hover:text-green-700 line-clamp-2 mb-1"
            >
              {item.productName}
            </Link>

            {item.variationName && (
              <p className="text-sm text-gray-500 mt-1">
                {item.variationName}
              </p>
            )}

            <p className="text-lg font-semibold text-gray-900 mt-2">
              {item.priceDisplay}
            </p>
          </div>

          <button
            onClick={() => onRemove(item.key)}
            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Eliminar producto"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>

        {/* Quantity controls */}
        <div className="flex items-center gap-4 mt-3">
          <span className="text-sm text-gray-600">Cantidad:</span>
          <div className="flex items-center border border-gray-300 rounded-md bg-white">
            <button
              onClick={() => onUpdateQuantity(item.key, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-[#101828] hover:text-white rounded-l-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-12 text-center text-base font-semibold text-gray-900 select-none">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.key, item.quantity + 1)}
              className="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-[#101828] hover:text-white rounded-r-md transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <span className="text-sm text-gray-500">
            Subtotal: {item.priceDisplay}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  const { cart, isLoading, updateQuantity, removeItem } = useCart();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-700 border-t-transparent mb-4"></div>
              <p className="text-gray-600">Cargando carrito...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!cart || cart.contents.nodes.length === 0) {
    return (
      <main className="min-h-screen bg-white pt-36">
        <EmptyCartMessage />
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-gray-50 pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/search"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continuar comprando
            </Link>
            <h1 className="font-belleza text-3xl lg:text-4xl font-light tracking-wide text-gray-900">
              Tu Carrito
            </h1>
            <p className="text-gray-600 mt-2">
              {cart.contents.nodes.length} {cart.contents.nodes.length === 1 ? 'producto' : 'productos'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items del carrito */}
            <div className="lg:col-span-2 space-y-4">
              {cart.contents.nodes.map((item) => (
                <CartItemCard
                  key={item.key}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>

            {/* Resumen del pedido */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-32">
                <h2 className="font-moderat text-lg font-semibold text-gray-900 mb-4">Resumen del Pedido</h2>

                <div className="space-y-3 mb-6">
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

                  {cart.feeTotal && cart.feeTotal !== '$0' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tarifas</span>
                      <span className="font-medium text-gray-900">{cart.feeTotal}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-green-700">{cart.total}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full bg-green-700 text-white text-center py-3 px-6 rounded-lg font-moderat font-medium hover:bg-green-800 transition-colors mb-3"
                >
                  Finalizar Compra
                </Link>

                <Link
                  href="/search"
                  className="block text-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Continuar comprando
                </Link>

                {/* Envío gratis */}
                {cart.subtotal && (
                  <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800">
                      💚 Envío gratis en pedidos superiores a $80.000 CLP
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

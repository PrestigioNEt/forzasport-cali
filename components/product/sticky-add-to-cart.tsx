'use client';

import { useEffect, useState, useActionState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { Product, ProductVariant } from 'lib/shopify/types';
import { addItem } from 'components/cart/actions';
import { useProduct } from 'components/product/product-context';
import { useCart } from 'components/cart/cart-context';
import Price from 'components/price';

interface StickyAddToCartProps {
  product: Product;
  className?: string;
}

export function StickyAddToCart({ product, className = '' }: StickyAddToCartProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { variants, availableForSale } = product;
  const { addCartItem } = useCart();
  const { state } = useProduct();
  const [message, formAction] = useActionState(addItem, null);

  useEffect(() => {
    const handleScroll = () => {
      // Mostrar el sticky bar cuando el usuario scrollea más de 500px
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Find the selected variant based on product context state
  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === state[option.name.toLowerCase()]
    )
  );
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId || '';
  const addItemAction = formAction.bind(null, selectedVariantId);
  const finalVariant = variants.find(
    (variant) => variant.id === selectedVariantId
  );

  // No renderizar si no hay variante válida
  if (!finalVariant) {
    return null;
  }

  return (
    <div
      className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      } ${className}`}
    >
      <div className="flex items-center gap-3 p-4">
        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-belleza text-sm font-medium text-gray-900 truncate">
            {product.title}
          </h3>
          <div className="text-sm font-semibold text-gray-900 mt-0.5">
            <Price
              amount={product.priceRange.maxVariantPrice.amount}
              currencyCode={product.priceRange.maxVariantPrice.currencyCode}
            />
          </div>
        </div>

        {/* Add to Cart Button */}
        <form
          action={async () => {
            addCartItem(finalVariant, product);
            addItemAction();
          }}
          className="flex-shrink-0"
        >
          <button
            aria-label="Agregar al carrito"
            disabled={!availableForSale || !selectedVariantId}
            className={`
              relative flex items-center justify-center gap-2 px-6 py-3
              text-sm font-medium tracking-wider uppercase
              transition-all duration-300
              ${
                availableForSale && selectedVariantId
                  ? 'bg-[#620c0b] text-white hover:bg-[#4a0908] active:scale-95'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">
              {availableForSale ? 'Agregar' : 'Agotado'}
            </span>
          </button>
          <p aria-live="polite" className="sr-only" role="status">
            {message && (message as any).message}
          </p>
        </form>
      </div>
    </div>
  );
}

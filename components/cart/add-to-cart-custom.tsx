'use client';

import clsx from 'clsx';
import { addItem } from 'components/cart/actions';
import { useProduct } from 'components/product/product-context';
import { Product, ProductVariant } from 'lib/shopify/types';
import { useState } from 'react';
import { useCart } from './cart-context';
import { ShoppingBag } from 'lucide-react';

function SubmitButton({
  availableForSale,
  selectedVariantId
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
}) {
  const baseClasses =
    'font-moderat w-full flex items-center justify-center gap-3 px-8 py-4 text-sm tracking-[0.15em] uppercase font-medium transition-all duration-300';

  const enabledClasses = 'bg-[#2d7a3e] text-white hover:bg-[#1e5a2a]';
  const disabledClasses = 'bg-gray-300 text-gray-500 cursor-not-allowed';

  if (!availableForSale) {
    return (
      <button
        disabled
        className={clsx(baseClasses, disabledClasses)}
      >
        <ShoppingBag className="h-5 w-5" />
        Agotado
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-label="Selecciona una opción"
        disabled
        className={clsx(baseClasses, disabledClasses)}
      >
        <ShoppingBag className="h-5 w-5" />
        Selecciona una Opción
      </button>
    );
  }

  return (
    <button
      aria-label="Añadir al carrito"
      className={clsx(baseClasses, enabledClasses)}
    >
      <ShoppingBag className="h-5 w-5" />
      Añadir al Carrito
    </button>
  );
}

export function AddToCartCustom({
  product,
  quantity = 1
}: {
  product: Product;
  quantity?: number;
}) {
  const { variants, availableForSale } = product;
  const { addCartItem } = useCart();
  const { state } = useProduct();
  const [isPending, setIsPending] = useState(false);

  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === state[option.name.toLowerCase()]
    )
  );
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  const finalVariant = variants.find(
    (variant) => variant.id === selectedVariantId
  );

  const handleAddToCart = async () => {
    // Validación para evitar crash si no se encuentra la variante
    if (!selectedVariantId || isPending || !finalVariant) return;

    setIsPending(true);

    try {
      // Añadir la cantidad especificada al carrito (optimista - UI update)
      addCartItem(finalVariant, product, quantity);

      // Llamar a la server action con la cantidad correcta
      await addItem(null, selectedVariantId, quantity);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleAddToCart();
      }}
    >
      <SubmitButton
        availableForSale={availableForSale}
        selectedVariantId={selectedVariantId}
      />
    </form>
  );
}

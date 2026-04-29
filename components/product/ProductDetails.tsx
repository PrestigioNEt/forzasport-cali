'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ProductVariations } from './ProductVariations';
import type { WooProductAttribute, WooProductVariation } from '@/lib/woocommerce/types';

type ProductAttribute = WooProductAttribute;

type ProductVariation = WooProductVariation & {
  attributes: {
    nodes: WooProductAttribute[];
  };
};

interface ProductDetailsProps {
  product: any;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null);
  const [currentImage, setCurrentImage] = useState(
    product.image?.sourceUrl || product.image?.url || '/placeholder.jpg'
  );

  // Determinar si es un producto variable
  const isVariable = product.__typename === 'VariableProduct';
  const variations = isVariable ? product.variations?.nodes || [] : [];

  // Obtener precio actual
  const currentPrice = selectedVariation?.price || product.price || 'Precio no disponible';
  const currentStockStatus = selectedVariation?.stockStatus || product.stockStatus;

  // Manejar cambio de variación
  const handleVariationChange = (variation: ProductVariation | null) => {
    setSelectedVariation(variation);

    // Actualizar imagen si la variación tiene una
    if (variation?.image?.sourceUrl) {
      setCurrentImage(variation.image.sourceUrl);
    } else {
      setCurrentImage(product.image?.sourceUrl || product.image?.url || '/placeholder.jpg');
    }
  };

  // Agregar al carrito (función temporal)
  const handleAddToCart = () => {
    if (isVariable && !selectedVariation) {
      alert('Por favor selecciona una variación');
      return;
    }

    const productId = selectedVariation?.id || product.id;
    alert(`Producto agregado: ${productId}\n\nEsta función se conectará con el carrito de WooCommerce.`);
  };

  return (
    <div className="space-y-6">
      {/* Título y precio */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {product.name}
        </h1>

        <p className="text-3xl text-gray-900 font-semibold mb-4">
          {currentPrice}
        </p>

        {/* Descripción corta */}
        {product.shortDescription && (
          <div
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: product.shortDescription }}
          />
        )}
      </div>

      {/* Variaciones para productos variables */}
      {isVariable && variations.length > 0 && (
        <ProductVariations
          variations={variations}
          defaultPrice={product.price}
          onVariationChange={handleVariationChange}
        />
      )}

      {/* Información de variación seleccionada */}
      {selectedVariation && (
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Variación:</span>
            <span className="font-medium text-gray-900">{selectedVariation.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Precio:</span>
            <span className="font-medium text-green-700">{selectedVariation.price}</span>
          </div>
        </div>
      )}

      {/* Stock status */}
      <div className="flex items-center space-x-2">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            currentStockStatus === 'IN_STOCK'
              ? 'bg-green-100 text-green-800'
              : currentStockStatus === 'OUT_OF_STOCK'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {currentStockStatus === 'IN_STOCK' && '✓ En stock'}
          {currentStockStatus === 'OUT_OF_STOCK' && '✗ Agotado'}
          {currentStockStatus === 'ON_BACKORDER' && '⏳ Bajo pedido'}
        </span>

        {selectedVariation?.stockQuantity !== undefined && selectedVariation.stockQuantity > 0 && (
          <span className="text-sm text-gray-600">
            ({selectedVariation.stockQuantity} disponibles)
          </span>
        )}
      </div>

      {/* Descripción larga */}
      {product.description && (
        <div className="text-gray-600 leading-relaxed border-t pt-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Descripción</h2>
          <div dangerouslySetInnerHTML={{ __html: product.description }} />
        </div>
      )}

      {/* Botones de acción */}
      <div className="space-y-4">
        <button
          onClick={handleAddToCart}
          disabled={currentStockStatus === 'OUT_OF_STOCK'}
          className={`w-full py-4 px-8 rounded-lg font-semibold text-lg transition-colors ${
            currentStockStatus === 'OUT_OF_STOCK'
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-green-700 text-white hover:bg-green-800'
          }`}
        >
          {currentStockStatus === 'OUT_OF_STOCK' ? 'Agotado' : 'Agregar al carrito'}
        </button>

        <Link
          href="/search"
          className="block text-center text-gray-600 hover:text-gray-900"
        >
          ← Volver a productos
        </Link>
      </div>
    </div>
  );
}

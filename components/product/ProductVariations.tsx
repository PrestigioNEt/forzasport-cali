'use client';

import { useState } from 'react';
import type { WooProductAttribute, WooProductVariation } from '@/lib/woocommerce/types';

type ProductVariation = WooProductVariation & {
  databaseId?: number;
  attributes: {
    nodes: WooProductAttribute[];
  };
};

type ProductAttribute = WooProductAttribute;

interface ProductVariationsProps {
  variations: ProductVariation[];
  defaultPrice: string;
  onVariationChange: (variation: ProductVariation | null) => void;
}

export function ProductVariations({ variations, defaultPrice, onVariationChange }: ProductVariationsProps) {
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [currentVariation, setCurrentVariation] = useState<ProductVariation | null>(null);

  // Extraer atributos únicos (paño, color, talla, etc.)
  const getUniqueAttributes = () => {
    const attributeMap: Record<string, Set<string>> = {};

    variations.forEach((variation) => {
      variation.attributes.nodes.forEach((attr) => {
        if (!attr.name || !attr.value) return;

        if (!attributeMap[attr.name]) {
          attributeMap[attr.name] = new Set();
        }
        if (attr.value) {
          attributeMap[attr.name]?.add(attr.value);
        }
      });
    });

    return Object.entries(attributeMap).map(([name, values]) => ({
      name,
      values: Array.from(values).sort()
    }));
  };

  const attributes = getUniqueAttributes();

  // Encontrar variación que coincide con los atributos seleccionados
  const findMatchingVariation = () => {
    if (Object.keys(selectedAttributes).length === 0) {
      return null;
    }

    return variations.find((variation) => {
      const attrs = variation.attributes.nodes;
      const matches = attrs.every(
        (attr) => attr.value && selectedAttributes[attr.name] === attr.value
      );
      return matches && attrs.length === Object.keys(selectedAttributes).length;
    });
  };

  const handleAttributeChange = (attributeName: string, value: string) => {
    const newSelection = { ...selectedAttributes, [attributeName]: value };

    // Si deselecciona, remover del estado
    if (!value) {
      delete newSelection[attributeName];
    }

    setSelectedAttributes(newSelection);

    // Buscar variación que coincida
    const matchingVariation = variations.find((variation) => {
      const attrs = variation.attributes.nodes;
      const matches = Object.entries(newSelection).every(
        ([name, selectedValue]) =>
          attrs.some((attr) => attr.name === name && attr.value === selectedValue)
      );
      return matches && attrs.length === Object.keys(newSelection).length;
    });

    if (matchingVariation) {
      setCurrentVariation(matchingVariation);
      onVariationChange(matchingVariation);
    } else {
      setCurrentVariation(null);
      onVariationChange(null);
    }
  };

  // Obtener valores disponibles para un atributo
  const getAvailableValues = (attributeName: string) => {
    return attributes.find((attr) => attr.name === attributeName)?.values || [];
  };

  // Verificar si una combinación está disponible
  const isValueAvailable = (attributeName: string, value: string) => {
    // Si es el único atributo seleccionado o no hay selecciones previas, todos los valores están disponibles
    const otherSelections = Object.entries(selectedAttributes).filter(([name]) => name !== attributeName);

    if (otherSelections.length === 0) {
      return true;
    }

    // Verificar si hay al menos una variación con este valor y las otras selecciones
    return variations.some((variation) => {
      const hasThisValue = variation.attributes.nodes.some(
        (attr) => attr.name === attributeName && attr.value === value
      );

      const matchesOtherSelections = otherSelections.every(([name, selectedValue]) =>
        variation.attributes.nodes.some(
          (attr) => attr.name === name && attr.value === selectedValue
        )
      );

      return hasThisValue && matchesOtherSelections;
    });
  };

  if (attributes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {attributes.map((attr) => (
        <div key={attr.name} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {attr.name}
          </label>
          <div className="flex flex-wrap gap-2">
            {attr.values.map((value) => {
              const isSelected = selectedAttributes[attr.name] === value;
              const isAvailable = isValueAvailable(attr.name, value);

              return (
                <button
                  key={value}
                  onClick={() => handleAttributeChange(attr.name, isSelected ? '' : value)}
                  disabled={!isAvailable && !isSelected}
                  className={`px-4 py-2 border-2 rounded-md text-sm font-medium transition-all ${
                    isSelected
                      ? 'border-green-700 bg-green-700 text-white'
                      : 'border-gray-300 text-gray-700 hover:border-green-700'
                  } ${!isAvailable ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

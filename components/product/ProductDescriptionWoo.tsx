'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ProductVariations } from './ProductVariations';
import { Minus, Plus, Truck, RefreshCcw, Shield, Package } from 'lucide-react';
import { useCart } from '@/components/providers/CartProvider';
import type { WooProductAttribute, WooProductVariation } from '@/lib/woocommerce/types';

type ProductAttribute = WooProductAttribute;

type ProductVariation = WooProductVariation & {
  databaseId?: number;
  attributes: {
    nodes: WooProductAttribute[];
  };
};

interface WooProduct {
  id: string;
  databaseId?: number;
  name: string;
  slug: string;
  __typename?: string;
  price?: string;
  regularPrice?: string;
  salePrice?: string;
  stockStatus?: string;
  shortDescription?: string;
  description?: string;
  attributes?: {
    nodes: ProductAttribute[];
  };
  image?: {
    sourceUrl?: string;
    url?: string;
  };
  variations?: {
    nodes: ProductVariation[];
  };
}

interface ProductDescriptionWooProps {
  product: WooProduct;
}

interface AccordionItemProps {
  title: string;
  icon: React.ReactNode;
  content: string | React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}

function AccordionItem({ title, icon, content, isOpen, onClick }: AccordionItemProps) {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-4 text-left transition-colors hover:text-[#101828] group"
      >
        <div className="flex items-center gap-3">
          <div className="text-gray-500 group-hover:text-[#101828] transition-colors">
            {icon}
          </div>
          <span className="font-moderat text-sm uppercase tracking-wider font-medium text-gray-900 group-hover:text-[#101828] transition-colors">
            {title}
          </span>
        </div>
        <span className={`text-gray-400 text-2xl font-light transition-all duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`}>
          +
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="text-gray-600 leading-relaxed text-sm animate-fadeIn">
          {typeof content === 'string' ? (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          ) : (
            content
          )}
        </div>
      </div>
    </div>
  );
}

export function ProductDescriptionWoo({ product }: ProductDescriptionWooProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  // Log temporal para depuración de variaciones en el componente
  // eslint-disable-next-line no-console
  console.log('PROPS PRODUCT EN ProductDescriptionWoo:', product);

  // Determinar si es un producto variable
  const isVariable = product.__typename === 'VariableProduct';
  const variations = isVariable ? product.variations?.nodes || [] : [];

  // Atributo de tallas (ej: pa_tallas-men)
  const sizeAttribute = product.attributes?.nodes?.find(
    (attr) => attr.name?.toLowerCase().includes('talla') || attr.name?.startsWith('pa_')
  );

  // Obtener precio y stock actual
  const currentPrice = cleanPrice(selectedVariation?.price) || cleanPrice(product.price) || 'Precio no disponible';
  const currentStockStatus = selectedVariation?.stockStatus || product.stockStatus;
  const stockQuantity = selectedVariation?.stockQuantity;

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);

  // Función para limpiar HTML entities de precios
  const cleanPrice = (price: string | undefined) => {
    if (!price) return price;
    return String(price)
      .replace(/&nbsp;/gi, ' ')
      .replace(/&#160;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Calcular cantidad máxima disponible
  const MAX_QUANTITY = stockQuantity && stockQuantity > 0 ? stockQuantity : 99;

  const handleAccordionClick = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  // Encontrar variación que coincida con la talla seleccionada
  const findVariationBySize = (size: string): ProductVariation | null => {
    if (!sizeAttribute?.options) return null;

    // Buscar por índice si options y variations coinciden en cantidad
    const sizeIndex = sizeAttribute.options.indexOf(size);
    if (sizeIndex !== -1 && variations[sizeIndex]) {
      return variations[sizeIndex];
    }

    // Fallback: buscar por cualquier coincidencia en attributes
    return variations.find((v) => {
      return v.attributes?.nodes?.some(
        (attr) => attr.value === size || attr.options?.includes(size)
      );
    }) || null;
  };

  // Cuando cambia la talla, buscar la variación correspondiente
  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    setSizeError(false);
    const matchedVariation = findVariationBySize(size);

    // DEBUG
    console.log('TALLA SELECCIONADA:', size);
    console.log('VARIACION ENCONTRADA:', matchedVariation ? 'SÍ' : 'NO');
    if (!matchedVariation && variations.length > 0 && variations[0]) {
      console.log('PRIMERA VARIACION attributes:', variations[0]?.attributes?.nodes);
    }

    setSelectedVariation(matchedVariation);
    setQuantity(1);
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= MAX_QUANTITY) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    // eslint-disable-next-line no-console
    console.log('DEBUG addToCart:', {
      sizeAttribute: !!sizeAttribute,
      selectedSize,
      variationsLength: variations.length,
      selectedVariation: !!selectedVariation
    });

    if (sizeAttribute && !selectedSize) {
      setSizeError(true);
      alert('Por favor selecciona una talla');
      return;
    }
    setSizeError(false);

    // Solo validar variación si hay variaciones Y no se ha seleccionado ninguna
    if (variations.length > 0 && !selectedVariation) {
      alert('Por favor selecciona una variación');
      return;
    }

    const productId = selectedVariation?.databaseId || product.databaseId || product.id;

    // Preparar datos del producto para evitar fetching innecesario
    // Nota: Pasamos datos mínimos ya que el carrito es local
    const productData: any = {
      title: product.name,
      handle: product.slug,
      priceRange: {
        minVariantPrice: { amount: product.price || '0', currencyCode: 'CLP' },
        maxVariantPrice: { amount: product.price || '0', currencyCode: 'CLP' }
      },
      featuredImage: product.image ? {
        url: product.image.sourceUrl,
        altText: (product.image as any).altText || product.name,
        width: 0,
        height: 0
      } : undefined
    };

    try {
      setIsAdding(true);
      const success = await addToCart(String(productId), quantity, productData);

      if (success) {
        // El carrito se abrirá automáticamente
        console.log('Producto agregado al carrito');
      }
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      alert('Error al agregar al carrito. Por favor intenta de nuevo.');
    } finally {
      setIsAdding(false);
    }
  };

  // Envío gratis - leer desde el AnnouncementBar
  const freeShippingThreshold = 80000; // $80.000 CLP

  return (
    <div className="space-y-6">
      {/* Título y Precio */}
      <div>
        <h1 className="font-belleza text-2xl lg:text-3xl font-light tracking-wide text-gray-900 mb-4">
          {product.name}
        </h1>

        <div className="flex items-baseline gap-3 mb-4">
          <p className="font-moderat text-2xl lg:text-3xl font-semibold text-gray-900">
            {currentPrice}
          </p>
          {product.salePrice && product.regularPrice && cleanPrice(product.regularPrice) !== cleanPrice(product.salePrice) && (
            <p className="text-sm text-gray-500 line-through">
              {cleanPrice(product.regularPrice)}
            </p>
          )}
        </div>

        {/* Descripción corta */}
        {product.shortDescription && (
          <div
            className="text-gray-600 text-sm leading-relaxed mb-4"
            dangerouslySetInnerHTML={{ __html: product.shortDescription }}
          />
        )}

        {/* Stock Status */}
        <div className="flex items-center gap-2">
          {currentStockStatus === 'IN_STOCK' ? (
            <span className="inline-flex items-center gap-1 text-sm text-[#101828]">
              <span className="w-2 h-2 rounded-full bg-[#101828]"></span>
              En stock
              {stockQuantity && stockQuantity > 0 && stockQuantity <= 10 && (
                <span className="text-xs text-gray-500">
                  (¡Solo {stockQuantity} disponibles!)
                </span>
              )}
            </span>
          ) : currentStockStatus === 'OUT_OF_STOCK' ? (
            <span className="inline-flex items-center gap-1 text-sm text-red-600">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              Agotado
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-sm text-yellow-600">
              <span className="w-2 h-2 rounded-full bg-yellow-600"></span>
              Bajo pedido
            </span>
          )}
        </div>
      </div>

      {/* Variaciones para productos variables */}
      {isVariable && variations.length > 0 && (
        <div className="py-4">
          <ProductVariations
            variations={variations}
            defaultPrice={cleanPrice(product.price) || 'Precio no disponible'}
            onVariationChange={(v) => setSelectedVariation(v)}
          />
        </div>
      )}

      {/* Selector de tallas */}
      {sizeAttribute && sizeAttribute.options && sizeAttribute.options.length > 0 && (
        <div className="py-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">Talla</h3>
            <button className="text-xs text-gray-500 hover:text-gray-700 underline">
              Guía de tallas
            </button>
          </div>
          {sizeError && (
            <p className="text-xs text-red-600 mb-2">Por favor selecciona una talla</p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {sizeAttribute.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSizeSelect(option)}
                className={`py-2 px-3 text-xs border-2 rounded-md font-medium transition-all text-center ${
                  selectedSize === option
                    ? 'border-[#101828] bg-[#101828] text-white'
                    : 'border-gray-300 text-gray-700 hover:border-[#101828]'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selector de cantidad */}
      <div className="flex items-center gap-4 py-2">
        <span className="text-sm font-medium text-gray-700">Cantidad:</span>
        <div className="flex items-center border border-gray-300 rounded-md bg-white">
          <button
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
            className="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-[#101828] hover:text-white rounded-l-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-12 text-center text-base font-semibold text-gray-900 select-none">
            {quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= MAX_QUANTITY}
            className="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-[#101828] hover:text-white rounded-r-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Atributos del producto */}
      {product.attributes && product.attributes.nodes.length > 0 && !isVariable && (
        <div className="py-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Especificaciones</h3>
          <div className="space-y-2">
            {product.attributes.nodes.map((attr, index) => (
              <div key={index} className="flex items-start justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">{attr.name}:</span>
                <span className="text-sm font-medium text-gray-900 text-right max-w-[60%]">
                  {attr.value || (attr.options?.join(', '))}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Atributos de variación seleccionada */}
      {selectedVariation && selectedVariation.attributes && selectedVariation.attributes.nodes.length > 0 && (
        <div className="py-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Especificaciones</h3>
          <div className="space-y-2">
            {selectedVariation.attributes.nodes.map((attr, index) => (
              <div key={index} className="flex items-start justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">{attr.name}:</span>
                <span className="text-sm font-medium text-gray-900 text-right max-w-[60%]">
                  {attr.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Acordeón de información */}
      <div className="space-y-1">
        {/* Descripción */}
        <AccordionItem
          title="Descripción"
          icon={<Shield className="h-5 w-5" />}
          isOpen={openAccordion === 0}
          onClick={() => handleAccordionClick(0)}
          content={
            product.description ? (
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
            ) : (
              <p className="text-gray-500">Descripción no disponible</p>
            )
          }
        />

        {/* Envío y Entrega */}
        <AccordionItem
          title="Envío y Entrega"
          icon={<Truck className="h-5 w-5" />}
          isOpen={openAccordion === 1}
          onClick={() => handleAccordionClick(1)}
          content={
            <ul className="space-y-2">
              <li>• Envío gratis en compras superiores a ${freeShippingThreshold.toLocaleString('es-CL')} CLP</li>
              <li>• Entrega en 3-5 días hábiles en ciudades principales</li>
              <li>• Entrega en 5-7 días hábiles en el resto del país</li>
              <li>• Seguimiento en tiempo real de tu pedido</li>
              <li>• Recibe directamente en tu domicilio</li>
            </ul>
          }
        />

        {/* Devoluciones */}
        <AccordionItem
          title="Devoluciones y Cambios"
          icon={<RefreshCcw className="h-5 w-5" />}
          isOpen={openAccordion === 2}
          onClick={() => handleAccordionClick(2)}
          content={
            <ul className="space-y-2">
              <li>• 30 días para devoluciones y cambios</li>
              <li>• Producto debe estar sin usar con etiquetas originales</li>
              <li>• Proceso de devolución gratuito</li>
              <li>• Reembolso en 5-10 días hábiles</li>
              <li>• Contáctanos para iniciar una devolución</li>
            </ul>
          }
        />

        {/* Información adicional (si hay variación seleccionada) */}
        {selectedVariation && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Variación seleccionada:</p>
            <p className="text-sm font-medium text-gray-900">{selectedVariation.name}</p>
          </div>
        )}
      </div>

      {/* Botón de compra */}
      <div className="sticky bottom-0 bg-white py-4 border-t border-gray-200">
        <button
          onClick={handleAddToCart}
          disabled={currentStockStatus === 'OUT_OF_STOCK' || isAdding}
          className={`w-full py-4 px-8 rounded-lg font-moderat text-lg tracking-wide uppercase transition-all duration-300 border-2 ${
            currentStockStatus === 'OUT_OF_STOCK' || isAdding
              ? 'bg-gray-400 text-gray-200 border-gray-400 cursor-not-allowed'
              : 'bg-[#101828] text-white border-[#101828] hover:bg-white hover:text-[#101828] shadow-md hover:shadow-xl'
          }`}
        >
          {isAdding ? 'Agregando...' : currentStockStatus === 'OUT_OF_STOCK' ? 'Agotado' : 'Agregar al Carrito'}
        </button>

        <div className="mt-4 text-center">
          <Link
            href="/search"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Continuar comprando
          </Link>
        </div>
      </div>
    </div>
  );
}

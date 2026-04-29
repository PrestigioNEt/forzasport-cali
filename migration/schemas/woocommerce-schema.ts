/**
 * SCHEMA WOOCOMMERCE GRAPHQL
 *
 * Definiciones de tipos basadas en WPGraphQL for WooCommerce
 * Referencia: https://woographql.com/docs/
 *
 * Este archivo es para referencia durante la migración.
 * Los tipos TypeScript reales se crearán en lib/woocommerce/types.ts
 */

// ============================================================================
// PRODUCT TYPES
// ============================================================================

/**
 * Interface base para productos
 * Todos los productos comparten estos campos
 */
interface Product {
  id: string; // ID (string como "product:123")
  slug: string; // URL-friendly name (equivalente a handle de Shopify)
  name: string; // Título del producto
  shortDescription: string; // Descripción corta (HTML)
  description: string; // Descripción completa (HTML)
  image?: MediaItem; // Imagen principal
  galleryImages?: ProductGallery; // Galería de imágenes
  onSale: boolean; // Está en oferta
  stockStatus: "IN_STOCK" | "OUT_OF_STOCK" | "ON_BACKORDER";
}

/**
 * Producto Simple (sin variaciones)
 */
interface SimpleProduct extends Product {
  type: "SIMPLE";
  price: string; // HTML: "<span class=\"...\">$10.00</span>"
  regularPrice: string; // Precio regular
  salePrice?: string; // Precio en oferta
  stockQuantity?: number; // Cantidad disponible
}

/**
 * Producto Variable (con variaciones como talla, color)
 */
interface VariableProduct extends Product {
  type: "VARIABLE";
  price: string; // Rango de precios: "$10.00 - $20.00"
  regularPrice: string;
  salePrice?: string;
  variations: ProductVariationConnection; // Lista de variaciones
  defaultVariation?: ProductVariation; // Variación por defecto
}

/**
 * Variación de Producto
 * Usado en VariableProduct
 */
interface ProductVariationConnection {
  nodes: ProductVariation[];
}

interface ProductVariation {
  id: string; // "product_variation:456"
  name: string; // "Producto - Talla M, Rojo"
  price: string;
  regularPrice: string;
  salePrice?: string;
  stockStatus: "IN_STOCK" | "OUT_OF_STOCK" | "ON_BACKORDER";
  stockQuantity?: number;
  attributes: ProductAttributeConnection; // Atributos de esta variación
  image?: MediaItem;
}

/**
 * Atributos de producto/variación
 * Equivalente a selectedOptions en Shopify
 */
interface ProductAttribute {
  name: string; // "Paño" o "Color"
  value: string; // "Algodón" o "Rojo"
}

interface ProductAttributeConnection {
  nodes: ProductAttribute[];
}

/**
 * Producto Externo (Affiliate)
 */
interface ExternalProduct extends Product {
  type: "EXTERNAL";
  price: string;
  regularPrice: string;
  salePrice?: string;
  externalUrl?: string; // URL del producto externo
  buttonText?: string; // Texto del botón (ej: "Buy Now")
}

/**
 * Producto Agrupado
 */
interface GroupedProductConnection {
  nodes: Product[];
}

interface GroupedProduct extends Product {
  type: "GROUPED";
  products: GroupedProductConnection; // Productos hijos
}

/**
 * Union Type: Cualquier tipo de producto
 */
type ProductUnion =
  | SimpleProduct
  | VariableProduct
  | ExternalProduct
  | GroupedProduct;

// ============================================================================
// IMAGE TYPES
// ============================================================================

interface MediaItem {
  id: string;
  sourceUrl: string; // URL completa de la imagen
  altText?: string;
  caption?: string;
  description?: string;
}

interface ProductGallery {
  nodes: MediaItem[];
}

// ============================================================================
// COLLECTION / CATEGORY TYPES
// ============================================================================

/**
 * Categoría de Producto
 * Equivalente a Collection en Shopify
 */
interface ProductCategory {
  id: string;
  slug: string; // URL-friendly name (handle en Shopify)
  name: string; // Nombre de la categoría
  description?: string;
  image?: MediaItem;
  count: number; // Cantidad de productos
}

interface ProductCategoryConnection {
  nodes: ProductCategory[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string;
  };
}

// ============================================================================
// CART TYPES
// ============================================================================

/**
 * Carrito de WooCommerce
 * Note: Session-based, no necesita cartId
 */
interface Cart {
  contents: CartContents;
  subtotal: string; // Subtotal (HTML)
  subtotalTax: string; // Subtotal de impuestos (HTML)
  total: string; // Total (HTML)
  totalTax: string; // Total de impuestos (HTML)
  shippingTotal: string; // Total de envío (HTML)
  discountTotal: string; // Total de descuentos (HTML)
  feeTotal: string; // Total de fees (HTML)
}

/**
 * Contenido del carrito
 */
interface CartContents {
  nodes: CartItem[];
}

/**
 * Item individual del carrito
 */
interface CartItem {
  key: string; // Identificador único en el carrito
  product: {
    node: ProductUnion; // Producto base
  };
  variation?: {
    node: ProductVariation; // Variación (si aplica)
  };
  quantity: number;
  subtotal: string; // Subtotal del item
  total: string; // Total del item
}

// ============================================================================
// ORDER TYPES
// ============================================================================

interface Order {
  id: string;
  orderKey: string; // Clave única de orden
  status: OrderStatus;
  date: string; // ISO 8601 date
  modified: string; // ISO 8601 date
  total: string; // Total (HTML)
  subtotal: string;
  shippingTotal: string;
  taxTotal: string;
  discountTotal: string;
  lineItems: OrderLineItemConnection;
  shippingLines: OrderShippingConnection;
  paymentMethod: string;
  paymentMethodTitle: string;
  customer?: Customer;
  billing: Address;
  shipping: Address;
}

type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "ON_HOLD"
  | "CANCELLED"
  | "REFUNDED"
  | "FAILED";

interface OrderLineItemConnection {
  nodes: OrderLineItem[];
}

interface OrderShippingConnection {
  nodes: any[];
}

interface OrderLineItem {
  id: string;
  product?: ProductUnion;
  variation?: ProductVariation;
  quantity: number;
  subtotal: string;
  total: string;
}

// ============================================================================
// CUSTOMER TYPES
// ============================================================================

interface Customer {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  billing: Address;
  shipping: Address;
}

interface Address {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  postcode: string;
  country: string;
  phone?: string;
}

// ============================================================================
// COUPON TYPES
// ============================================================================

interface Coupon {
  id: string;
  code: string; // Código del cupón
  description?: string;
  discountType: "PERCENT" | "FIXED_CART" | "FIXED_PRODUCT";
  amount: string; // Monto de descuento
  dateExpires?: string; // ISO 8601 date
}

// ============================================================================
// SHOP / STORE SETTINGS
// ============================================================================

interface ShopSettings {
  storeAddress: {
    address1: string;
    address2?: string;
    city: string;
    country: string;
    postcode: string;
  };
  currency: {
    code: string; // "USD", "EUR", etc.
    symbol: string; // "$", "€", etc.
    symbolPosition: "LEFT" | "RIGHT" | "LEFT_SPACE" | "RIGHT_SPACE";
    decimalSeparator: string;
    thousandSeparator: string;
    decimals: number;
  };
}

// ============================================================================
// QUERY INPUT TYPES
// ============================================================================

/**
 * Filtros para query de productos
 */
interface ProductWhereArgs {
  search?: string; // Búsqueda por texto
  category?: string; // Filtrar por categoría
  categoryIn?: string[]; // En categorías específicas
  categoryNotIn?: string[]; // Excluir categorías
  exclude?: string[]; // Excluir productos específicos
  include?: string[]; // Incluir productos específicos
  orderby?:
    | "DATE"
    | "ID"
    | "TITLE"
    | "SLUG"
    | "PRICE"
    | "POPULARITY"
    | "RATING"
    | "MENU_ORDER";
  order?: "ASC" | "DESC";
  onSale?: boolean; // Solo productos en oferta
  stockStatus?: "IN_STOCK" | "OUT_OF_STOCK";
  type?: string[]; // "SIMPLE", "VARIABLE", etc.
  featured?: boolean; // Productos destacados
}

/**
 * Paginación
 */
interface PaginationArgs {
  first?: number; // Cantidad de items
  last?: number;
  after?: string; // Cursor
  before?: string;
}

// ============================================================================
// MUTATION INPUT TYPES
// ============================================================================

/**
 * Input para addToCart mutation
 */
interface AddToCartInput {
  productId: number; // ID del producto
  quantity: number; // Cantidad
  variationId?: number; // ID de variación (opcional, para variables)
}

/**
 * Input para updateCartItems mutation
 */
interface UpdateCartItemInput {
  key: string; // Key del item en carrito
  quantity: number; // Nueva cantidad (0 para eliminar)
}

/**
 * Input para checkout mutation
 */
interface CheckoutInput {
  paymentMethod: string;
  paymentMethodTitle?: string;
  billing: Address;
  shipping?: Address;
  customerNote?: string;
}

// ============================================================================
// HELPERS PARA MIGRACIÓN
// ============================================================================

/**
 * Mapeo de tipos Shopify → WooCommerce
 */
export const typeMapping = {
  // Productos
  "Product": "ProductUnion (SimpleProduct | VariableProduct | ...)",
  "ProductVariant": "ProductVariation",
  "Collection": "ProductCategory",

  // Carrito
  "Cart": "Cart (session-based)",
  "CartLine": "CartItem",
  "CartLine.id": "CartItem.key",

  // Campos
  "Product.handle": "Product.slug",
  "Product.title": "Product.name",
  "Product.priceRange": "Product.price (HTML string)",
  "ProductVariant.selectedOptions": "ProductAttribute.nodes[]",
  "ProductImage.url": "MediaItem.sourceUrl",

  // Queries
  "getProduct($handle)": "product(id: $slug, idType: SLUG)",
  "getProducts($sortKey)": "products(where: {orderby: ...})",
  "getCollection($handle)": "productCategory(id: $slug, idType: SLUG)",
  "predictiveSearch($query)": "products(where: {search: $query})",
};

/**
 * Advertencias importantes
 */
export const importantNotes = [
  "⚠️ WooCommerce price es HTML string, no número",
  "⚠️ Carrito es session-based, no usa cartId",
  "⚠️ No hay native checkoutUrl como Shopify",
  "⚠️ Variations usan attributes.nodes en lugar de selectedOptions",
  "⚠️ removeCartItem no es nativo - usar quantity: 0 o custom",
  "⚠️ Productos variables tienen structure diferente a simples",
  "⚠️ IDs son strings (product:123) no integers nativos",
  "⚠️ Stock status es enum, no boolean",
];

// Note: Types cannot be exported as values in an object
// Use individual exports or 'export type' statements instead
export const woocommerceSchemaInfo = {
  // Helpers
  typeMapping,
  importantNotes,
};

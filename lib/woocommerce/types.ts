/**
 * WOOCOMMERCE GRAPHQL TYPES
 *
 * Tipos TypeScript basados en el schema de WPGraphQL for WooCommerce
 * Referencia: https://woographql.com/docs/
 */

// ============================================================================
// PRODUCT TYPES
// ============================================================================

export interface WooProduct {
  __typename?: 'SimpleProduct' | 'VariableProduct' | 'ExternalProduct' | 'GroupProduct';
  id: string;
  databaseId?: number;
  slug: string;
  name: string;
  shortDescription?: string;
  description?: string;
  price?: string;
  regularPrice?: string;
  salePrice?: string;
  stockStatus?: 'IN_STOCK' | 'OUT_OF_STOCK' | 'ON_BACKORDER';
  image?: WooMediaItem;
  galleryImages?: {
    nodes: WooMediaItem[];
  };
  variations?: {
    nodes: WooProductVariation[];
  };
  attributes?: {
    nodes: WooProductAttribute[];
  };
  modified?: string;
}

export interface WooProductVariation {
  id: string;
  databaseId?: number;
  name?: string;
  price?: string;
  regularPrice?: string;
  salePrice?: string;
  stockStatus?: 'IN_STOCK' | 'OUT_OF_STOCK' | 'ON_BACKORDER';
  stockQuantity?: number;
  attributes?: {
    nodes: WooProductAttribute[];
  };
  image?: WooMediaItem;
}

export interface WooProductAttribute {
  name: string;
  value?: string;
  options?: string[];
}

export interface WooMediaItem {
  sourceUrl: string;
  altText?: string;
  caption?: string;
}

// ============================================================================
// COLLECTION / CATEGORY TYPES
// ============================================================================

export interface WooCollection {
  id: string;
  slug: string;
  name: string;
  description?: string;
  image?: WooMediaItem;
  count?: number;
}

// ============================================================================
// CART TYPES
// ============================================================================

export interface WooCart {
  contents?: {
    nodes: WooCartItem[];
  };
  subtotal?: string;
  total?: string;
  totalTax?: string;
  shippingTotal?: string;
  discountTotal?: string;
  feeTotal?: string;
}

export interface WooCartItem {
  key: string;
  product?: {
    node?: WooProduct;
  };
  variation?: {
    node?: WooProductVariation;
  };
  quantity: number;
  subtotal?: string;
  total?: string;
}

// ============================================================================
// GRAPHQL OPERATION TYPES
// ============================================================================

export interface WooProductOperation {
  data: {
    product?: WooProduct;
  };
  variables: {
    slug: string;
  };
}

export interface WooProductsOperation {
  data: {
    products?: {
      nodes: WooProduct[];
    };
  };
  variables: {
    search?: string;
    orderby?: string;
    order?: string;
  };
}

export interface WooCollectionOperation {
  data: {
    productCategory?: WooCollection;
  };
  variables: {
    slug: string;
  };
}

export interface WooCollectionsOperation {
  data: {
    productCategories?: {
      nodes: WooCollection[];
    };
  };
}

export interface WooSearchOperation {
  data: {
    products?: {
      nodes: WooProduct[];
    };
  };
  variables: {
    search: string;
  };
}

export interface WooCartOperation {
  data: {
    cart?: WooCart;
  };
}

export interface WooAddToCartOperation {
  data: {
    addToCart?: {
      cart?: WooCart;
      success?: boolean;
      error?: string;
    };
  };
  variables: {
    productId: number;
    quantity: number;
  };
}

export interface WooUpdateCartOperation {
  data: {
    updateCartItems?: {
      cart?: WooCart;
      success?: boolean;
      error?: string;
    };
  };
  variables: {
    items: {
      key: string;
      quantity: number;
    }[];
  };
}

// ============================================================================
// TYPES REUTILIZADOS DEL APP (compatibilidad con código existente)
// ============================================================================

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  variants: any[];
  featuredImage: {
    url: string;
    altText: string;
    width: number;
    height: number;
  };
  images: {
    url: string;
    altText: string;
    width: number;
    height: number;
  }[];
  seo: {
    title: string;
    description: string;
  };
  tags: string[];
  updatedAt: string;
  collections: any[];
}

export interface Collection {
  handle: string;
  title: string;
  name?: string;
  description: string;
  seo: {
    title: string;
    description: string;
  };
  updatedAt: string;
  image?: {
    url: string;
    altText: string;
    width: number;
    height: number;
  };
  path: string;
}

export type Maybe<T> = T | null;

export type Connection<T> = {
  edges: Array<Edge<T>>;
};

export type Edge<T> = {
  node: T;
};

export type Cart = Omit<ShopifyCart, 'lines'> & {
  lines: CartItem[];
};

export type CartProduct = {
  id: string;
  handle: string;
  title: string;
  featuredImage: Image;
};

export type CartItem = {
  id: string | undefined;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: {
      name: string;
      value: string;
    }[];
    product: CartProduct;
  };
};

export type Collection = ShopifyCollection & {
  path: string;
};

export type Image = {
  url: string;
  altText: string;
  width: number;
  height: number;
};

export type Menu = {
  title: string;
  path: string;
};

export type Money = {
  amount: string;
  currencyCode: string;
};

export type Page = {
  id: string;
  title: string;
  handle: string;
  body: string;
  bodySummary: string;
  seo?: SEO;
  createdAt: string;
  updatedAt: string;
};

export type Product = Omit<ShopifyProduct, 'variants' | 'images' | 'collections'> & {
  variants: ProductVariant[];
  images: Image[];
  collections: ShopifyCollection[];
};

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable?: number;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  price: Money;
  compareAtPrice?: Money;
};

export type SEO = {
  title: string;
  description: string;
};

export type ShopifyCart = {
  id: string | undefined;
  checkoutUrl: string;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money;
  };
  lines: Connection<CartItem>;
  totalQuantity: number;
};

export type ShopifyCollection = {
  handle: string;
  title: string;
  description: string;
  seo: SEO;
  updatedAt: string;
  image?: Image;
};

export type ShopifyProduct = {
  id: string;
  handle: string;
  availableForSale: boolean;
  title: string;
  description: string;
  descriptionHtml: string;
  options: ProductOption[];
  priceRange: {
    maxVariantPrice: Money;
    minVariantPrice: Money;
  };
  variants: Connection<ProductVariant>;
  featuredImage: Image;
  images: Connection<Image>;
  seo: SEO;
  tags: string[];
  updatedAt: string;
  collections: Connection<ShopifyCollection>;
};

export type ShopifyCartOperation = {
  data: {
    cart: ShopifyCart;
  };
  variables: {
    cartId: string;
  };
};

export type ShopifyCreateCartOperation = {
  data: { cartCreate: { cart: ShopifyCart } };
};

export type ShopifyAddToCartOperation = {
  data: {
    cartLinesAdd: {
      cart: ShopifyCart;
    };
  };
  variables: {
    cartId: string;
    lines: {
      merchandiseId: string;
      quantity: number;
    }[];
  };
};

export type ShopifyRemoveFromCartOperation = {
  data: {
    cartLinesRemove: {
      cart: ShopifyCart;
    };
  };
  variables: {
    cartId: string;
    lineIds: string[];
  };
};

export type ShopifyUpdateCartOperation = {
  data: {
    cartLinesUpdate: {
      cart: ShopifyCart;
    };
  };
  variables: {
    cartId: string;
    lines: {
      id: string;
      merchandiseId: string;
      quantity: number;
    }[];
  };
};

export type ShopifyCollectionOperation = {
  data: {
    collection: ShopifyCollection;
  };
  variables: {
    handle: string;
  };
};

export type ShopifyCollectionProductsOperation = {
  data: {
    collection: {
      products: Connection<ShopifyProduct>;
    };
  };
  variables: {
    handle: string;
    reverse?: boolean;
    sortKey?: string;
  };
};

export type ShopifyCollectionsOperation = {
  data: {
    collections: Connection<ShopifyCollection>;
  };
};

export type ShopifyMenuOperation = {
  data: {
    menu?: {
      items: {
        title: string;
        url: string;
      }[];
    };
  };
  variables: {
    handle: string;
  };
};

export type ShopifyPageOperation = {
  data: { pageByHandle: Page };
  variables: { handle: string };
};

export type ShopifyPagesOperation = {
  data: {
    pages: Connection<Page>;
  };
};

export type ShopifyProductOperation = {
  data: { product: ShopifyProduct };
  variables: {
    handle: string;
  };
};

export type ShopifyProductRecommendationsOperation = {
  data: {
    productRecommendations: ShopifyProduct[];
  };
  variables: {
    productId: string;
  };
};

export type ShopifyProductsOperation = {
  data: {
    products: Connection<ShopifyProduct>;
  };
  variables: {
    query?: string;
    reverse?: boolean;
    sortKey?: string;
  };
};

export type PredictiveSearchQuery = {
  text: string;
  styledText: string;
};

export type PredictiveSearchProduct = {
  id: string;
  title: string;
  handle: string;
  availableForSale: boolean;
  priceRange: {
    minVariantPrice: Money;
  };
  featuredImage: Image;
};

export type PredictiveSearchCollection = {
  id: string;
  title: string;
  handle: string;
};

export type PredictiveSearchResult = {
  queries: PredictiveSearchQuery[];
  products: PredictiveSearchProduct[];
  collections: PredictiveSearchCollection[];
};

export type ShopifyPredictiveSearchOperation = {
  data: {
    predictiveSearch: PredictiveSearchResult;
  };
  variables: {
    query: string;
    limit?: number;
  };
};

// Metaobject types para contenido editable del home
export type MetaobjectField = {
  key: string;
  value: string;
  reference?: {
    image?: Image;
  };
};

export type Metaobject = {
  id: string;
  type: string;
  handle: string;
  fields: MetaobjectField[];
};

export type ShopifyMetaobjectOperation = {
  data: {
    metaobject: Metaobject;
  };
  variables: {
    handle: string;
    type: string;
  };
};

export type ShopifyMetaobjectsOperation = {
  data: {
    metaobjects: Connection<Metaobject>;
  };
  variables: {
    type: string;
    first?: number;
  };
};

// Tipos específicos para el contenido del home
export type HomeHero = {
  title?: string;
  description?: string;
  image?: string;
  buttonText?: string;
  buttonText2?: string;
  buttonUrl?: string;
  buttonUrl2?: string;
};

export type HomeSlide = {
  id: string;
  image?: string;
  tag?: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  href?: string;
};

export type HomeBrandSection = {
  title?: string;
  description?: string;
  quote?: string;
  image1?: string;
  image2?: string;
};

export type HomeNewsletter = {
  title?: string;
  description?: string;
};

export type HomeAnnouncement = {
  text?: string;
  enabled?: boolean;
};

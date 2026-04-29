/**
 * COMPARADOR: Shopify → WooCommerce Queries
 *
 * Este archivo ayuda a entender las diferencias entre las queries
 * de Shopify y WooCommerce para facilitar la migración.
 */

// ============================================================================
// QUERIES DE PRODUCTOS
// ============================================================================

export const shopifyProductQuery = `
# Shopify: Obtener producto por handle
query getProduct($handle: String!) {
  product(handle: $handle) {
    id
    handle
    title
    description
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 10) {
      nodes {
        id
        availableForSale
        price {
          amount
        }
        selectedOptions {
          name
          value
        }
      }
    }
    images(first: 5) {
      nodes {
        url
        altText
      }
    }
  }
}
`;

export const wooCommerceProductQuery = `
# WooCommerce: Obtener producto por slug
query getProduct($slug: ID!) {
  product(id: $slug, idType: SLUG) {
    id
    slug
    name
    description
    ... on SimpleProduct {
      price
      regularPrice
      stockStatus
    }
    ... on VariableProduct {
      price
      regularPrice
      variations {
        nodes {
          id
          price
          regularPrice
          stockStatus
          attributes {
            nodes {
              name
              value
            }
          }
        }
      }
    }
    image {
      sourceUrl
      altText
    }
    galleryImages {
      nodes {
        sourceUrl
        altText
      }
    }
  }
}
`;

// ============================================================================
// QUERIES DE CARRITO
// ============================================================================

export const shopifyCartQuery = `
# Shopify: Obtener carrito
query getCart($cartId: ID!) {
  cart(id: $cartId) {
    id
    checkoutUrl
    cost {
      subtotalAmount {
        amount
      }
      totalAmount {
        amount
      }
    }
    lines(first: 20) {
      nodes {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            price {
              amount
            }
            product {
              title
              handle
            }
          }
        }
      }
    }
  }
}
`;

export const wooCommerceCartQuery = `
# WooCommerce: Obtener carrito
# Nota: WPGraphQL usa session tokens, no cart ID como Shopify

query getCart {
  cart {
    contents {
      nodes {
        key
        product {
          node {
            id
            name
            slug
            ... on SimpleProduct {
              price
            }
          }
        }
        quantity
        subtotal
        total
      }
    }
    subtotal
    total
    shippingTotal
    feeTotal
    discountTotal
  }
}
`;

// ============================================================================
// MUTATIONS DE CARRITO
// ============================================================================

export const shopifyAddToCart = `
# Shopify: Agregar al carrito
mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart {
      id
      totalQuantity
    }
    userErrors {
      field
      message
    }
  }
}
`;

export const wooCommerceAddToCart = `
# WooCommerce: Agregar al carrito
# Nota: WPGraphQL usa diferentes mutations para diferentes tipos de productos

mutation addToCartSimpleProduct($productId: Int!, $quantity: Int) {
  addToCart(input: {
    productId: $productId
    quantity: $quantity
  }) {
    cart {
      subtotal
      total
    }
  }
}

# Para productos variables, necesitas especificar variación
mutation addToCartVariableProduct(
  $productId: Int!
  $quantity: Int
  $variationId: Int!
) {
  addToCart(input: {
    productId: $productId
    quantity: $quantity
    variationId: $variationId
  }) {
    cart {
      subtotal
      total
    }
  }
}
`;

// ============================================================================
// QUERIES DE COLECCIONES
// ============================================================================

export const shopifyCollectionsQuery = `
# Shopify: Obtener colecciones
query getCollections {
  collections(first: 20) {
    nodes {
      id
      handle
      title
      description
      image {
        url
      }
    }
  }
}
`;

export const wooCommerceCollectionsQuery = `
# WooCommerce: Obtener colecciones (categorías de producto)
query getProductCategories {
  productCategories(first: 20) {
    nodes {
      id
      slug
      name
      description
      image {
        sourceUrl
      }
    }
  }
}
`;

// ============================================================================
// QUERIES DE BÚSQUEDA
// ============================================================================

export const shopifySearchQuery = `
# Shopify: Búsqueda predictiva
query predictiveSearch($query: String!) {
  predictiveSearch(query: $query, first: 5) {
    products {
      nodes {
        id
        handle
        title
        priceRange {
          minVariantPrice {
            amount
          }
        }
        images {
          nodes {
            url
          }
        }
      }
    }
    collections {
      nodes {
        id
        handle
        title
      }
    }
  }
}
`;

export const wooCommerceSearchQuery = `
# WooCommerce: Búsqueda de productos
# Nota: No tiene "predictive search" nativo, se hace con parámetros

query searchProducts($search: String!) {
  products(where: {search: $search}, first: 5) {
    nodes {
      id
      slug
      name
      ... on SimpleProduct {
        price
      }
      ... on VariableProduct {
        price
      }
      image {
        sourceUrl
      }
    }
  }

  # También buscar categorías
  productCategories(where: {search: $search}, first: 5) {
    nodes {
      id
      slug
      name
    }
  }
}
`;

// ============================================================================
// HELPERS PARA DOCUMENTACIÓN
// ============================================================================

/**
 * Comparación de campos clave
 */
export const fieldMapping = {
  productId: {
    shopify: 'id',
    wooCommerce: 'id',
    notes: 'WooCommerce usa integer IDs, Shopify usa GIDs como "gid://shopify/Product/123"'
  },
  productSlug: {
    shopify: 'handle',
    wooCommerce: 'slug',
    notes: 'Mismo concepto, diferente nombre de campo'
  },
  productName: {
    shopify: 'title',
    wooCommerce: 'name',
    notes: 'Nombre del producto'
  },
  productImage: {
    shopify: 'images.nodes[0].url',
    wooCommerce: 'image.sourceUrl',
    notes: 'Estructura diferente de objetos'
  },
  productPrice: {
    shopify: 'priceRange.minVariantPrice.amount',
    wooCommerce: 'price',
    notes: 'Shopify tiene rango de precios, WooCommerce tiene precio simple'
  },
  variantOptions: {
    shopify: 'selectedOptions [{name, value}]',
    wooCommerce: 'attributes.nodes [{name, value}]',
    notes: 'Estructura similar pero diferente anidación'
  },
  cartItems: {
    shopify: 'cart.lines.nodes',
    wooCommerce: 'cart.contents.nodes',
    notes: 'Diferente nombre y estructura'
  }
};

/**
 * Patrones que se mantienen igual
 */
export const samePatterns = [
  'Usar fragments para reutilizar campos',
  'Server Actions para mutaciones',
  'Tags de Next.js para cache',
  'Context API para estado global',
  'useOptimistic para UI optimista'
];

/**
 * Cambios arquitectónicos necesarios
 */
export const architecturalChanges = [
  {
    area: 'Carrito',
    shopify: 'Cart ID + checkoutUrl',
    wooCommerce: 'Session-based cart + checkout manual',
    impact: 'Alto - requiere reimplementar flujo de checkout'
  },
  {
    area: 'Variaciones',
    shopify: 'ProductVariant con selectedOptions',
    wooCommerce: 'Variation con attributes nodes',
    impact: 'Medio - requiere adaptar VariantSelector'
  },
  {
    area: 'Imágenes',
    shopify: 'images.nodes [] con url',
    wooCommerce: 'image + galleryImages.nodes con sourceUrl',
    impact: 'Bajo - simple renombre de campos'
  }
];

/**
 * Exportar todo como documento
 */
export const migrationNotes = `
## Notas Clave de Migración

### Diferencias Importantes

1. **Identificadores**:
   - Shopify: GIDs (gid://shopify/Product/123)
   - WooCommerce: Integers (123)

2. **Carrito**:
   - Shopify: CheckoutUrl nativo para redirección
   - WooCommerce: Debes implementar tu propio checkout

3. **Variantes**:
   - Shopify: Flat structure con selectedOptions
   - WooCommerce: Nested attributes.nodes

4. **Queries**:
   - Shopify: Más maduro, mejor paginación
   - WooCommerce: Funcional pero menos documentado

### Recomendaciones
1. Mantener la estructura de carpetas existente
2. Renombrar lib/shopify → lib/woocommerce gradualmente
3. Crear adapter functions para tipos incompatibles
4. Testear cada módulo antes de pasar al siguiente
`;

export default {
  shopifyProductQuery,
  wooCommerceProductQuery,
  shopifyCartQuery,
  wooCommerceCartQuery,
  shopifyAddToCart,
  wooCommerceAddToCart,
  shopifyCollectionsQuery,
  wooCommerceCollectionsQuery,
  shopifySearchQuery,
  wooCommerceSearchQuery,
  fieldMapping,
  samePatterns,
  architecturalChanges,
  migrationNotes
};

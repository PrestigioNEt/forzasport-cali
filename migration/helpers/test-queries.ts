/**
 * TESTER DE QUERIES WOOCOMMERCE
 *
 * Este archivo contiene queries listas para probar en GraphiQL
 * una vez que instales WPGraphQL.
 *
 * Cómo usar:
 * 1. Ve a: /wp-admin/admin.php?page=graphiql-ide
 * 2. Copia y pega las queries de abajo
 * 3. Ejecuta y verifica que funcionen
 */

// ============================================================================
// TEST 1: Verificar que WPGraphQL está funcionando
// ============================================================================

export const testHealthCheck = `
# TEST 1: Health Check
# Verifica que el endpoint GraphQL está funcionando

{
  __schema {
    types {
      name
    }
  }
}
`;

// ============================================================================
// TEST 2: Listar productos básicos
// ============================================================================

export const testListProducts = `
# TEST 2: Listar Productos
# Debería retornar productos de tu tienda WooCommerce

query GetProducts {
  products(first: 10) {
    nodes {
      id
      slug
      name
      price
      regularPrice
      onSale
      stockStatus
      image {
        sourceUrl
        altText
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
`;

// ============================================================================
// TEST 3: Obtener producto individual
// ============================================================================

export const testGetProduct = `
# TEST 3: Producto Individual
# Reemplaza 'tu-producto-slug' con el slug de un producto real

query GetProduct {
  product(id: "tu-producto-slug", idType: SLUG) {
    id
    slug
    name
    shortDescription
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
    ... on ProductWithAttributes {
      attributes {
        nodes {
          name
          options
        }
      }
    }
  }
}
`;

// ============================================================================
// TEST 4: Obtener categorías (colecciones)
// ============================================================================

export const testGetCategories = `
# TEST 4: Categorías de Productos
# Equivalente a "Collections" en Shopify

query GetCategories {
  productCategories(first: 20) {
    nodes {
      id
      slug
      name
      description
      count
      image {
        sourceUrl
      }
    }
  }
}
`;

// ============================================================================
// TEST 5: Productos por categoría
// ============================================================================

export const testProductsByCategory = `
# TEST 5: Productos por Categoría
# Reemplaza 'tu-categoria-slug' con una categoría real

query GetProductsByCategory {
  productCategory(id: "tu-categoria-slug", idType: SLUG) {
    name
    description
    products {
      nodes {
        id
        slug
        name
        price
        image {
          sourceUrl
        }
      }
    }
  }
}
`;

// ============================================================================
// TEST 6: Búsqueda de productos
// ============================================================================

export const testSearchProducts = `
# TEST 6: Búsqueda
# Reemplaza 'termino-busqueda' con lo que quieras buscar

query SearchProducts {
  products(where: {search: "termino-busqueda"}, first: 10) {
    nodes {
      id
      slug
      name
      price
      image {
        sourceUrl
      }
    }
  }
}
`;

// ============================================================================
// TEST 7: Ver carrito actual
// ============================================================================

export const testGetCart = `
# TEST 7: Ver Carrito
# Retorna el carrito de la sesión actual

query GetCart {
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
            image {
              sourceUrl
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
    discountTotal
    feeTotal
  }
}
`;

// ============================================================================
// TEST 8: Agregar al carrito (Mutation)
// ============================================================================

export const testAddToCart = `
# TEST 8: Agregar al Carrito (Simple Product)
# Reemplaza 123 con el ID de un producto simple real

mutation AddToCart {
  addToCart(input: {
    productId: 123
    quantity: 1
  }) {
    cart {
      subtotal
      total
    }
    success
    error
  }
}
`;

// ============================================================================
// TEST 9: Agregar producto variable al carrito
// ============================================================================

export const testAddVariableToCart = `
# TEST 9: Agregar al Carrito (Variable Product)
# Reemplaza con IDs reales

mutation AddVariableToCart {
  addToCart(input: {
    productId: 456        # ID del producto padre
    quantity: 1
    variationId: 789     # ID de la variación específica
  }) {
    cart {
      contents {
        nodes {
          product {
            node {
              name
            }
          }
          quantity
        }
      }
      subtotal
      total
    }
    success
    error
  }
}
`;

// ============================================================================
// TEST 10: Actualizar cantidad del carrito
// ============================================================================

export const testUpdateCart = `
# TEST 10: Actualizar Cantidad
# Reemplaza 'item-key' con la key del item del carrito

mutation UpdateCart {
  updateCartItems(input: {
    items: [{
      key: "item-key"
      quantity: 2
    }]
  }) {
    cart {
      subtotal
      total
    }
    success
    error
  }
}
`;

// ============================================================================
// TEST 11: Información de la tienda
// ============================================================================

export const testShopInfo = `
# TEST 11: Info de la Tienda

query GetShopInfo {
  generalSettings {
    dateFormat
    timeFormat
    timezone
    language
  }

  wcSettings {
    storeAddress {
      address1
      address2
      city
      country
      postcode
    }
    currency {
      code
      symbol
      symbolPosition
      decimalSeparator
      thousandSeparator
    }
  }
}
`;

// ============================================================================
// TEST 12: Explorar schema completo
// ============================================================================

export const testExploreSchema = `
# TEST 12: Explorar Tipos Disponibles
# Útil para ver qué tipos de productos tienes

{
  __type(name: "Product") {
    kind
    possibleTypes {
      name
    }
  }
}
`;

// ============================================================================
// DOCUMENTACIÓN DE TESTS
// ============================================================================

/**
 * Orden recomendado de tests:
 *
 * 1. ✅ testHealthCheck - Verificar GraphQL funciona
 * 2. ✅ testListProducts - Ver productos retornan
 * 3. ✅ testGetProduct - Ver producto individual
 * 4. ✅ testGetCategories - Ver categorías
 * 5. ✅ testProductsByCategory - Ver productos por categoría
 * 6. ✅ testSearchProducts - Ver búsqueda funciona
 * 7. ✅ testShopInfo - Ver configuración de tienda
 * 8. ✅ testGetCart - Ver carrito (puede estar vacío)
 * 9. ✅ testAddToCart - Probar agregar item (necesita producto ID)
 * 10. ✅ testUpdateCart - Probar actualizar cantidad
 *
 * Tips:
 * - Usa GraphiQL IDE: /wp-admin/admin.php?page=graphiql-ide
 * - El sidebar derecho muestra el schema completo
 * - Ctrl+Space para autocomplete
 * - Haz hover sobre campos para ver documentación
 */

export default {
  testHealthCheck,
  testListProducts,
  testGetProduct,
  testGetCategories,
  testProductsByCategory,
  testSearchProducts,
  testGetCart,
  testAddToCart,
  testAddVariableToCart,
  testUpdateCart,
  testShopInfo,
  testExploreSchema
};

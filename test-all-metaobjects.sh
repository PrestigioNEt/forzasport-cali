#!/bin/bash
source .env

echo "🧪 Probando todos los metaobjects de Shopify"
echo "=============================================="
echo ""

# Test 1: Home Hero
echo "1️⃣ Home Hero (home_hero)"
curl -s -X POST \
  "https://${SHOPIFY_STORE_DOMAIN}/api/2024-07/graphql.json" \
  -H "Content-Type: application/json" \
  -H "X-Shopify-Storefront-Access-Token: ${SHOPIFY_STOREFRONT_ACCESS_TOKEN}" \
  -d '{
    "query": "query { metaobjects(type: \"home_hero\", first: 5) { edges { node { id handle fields { key value } } } } }"
  }' | jq '.data.metaobjects.edges[] | .node | {handle, fields: [.fields[] | {key, value}]}'

echo ""
echo "---"
echo ""

# Test 2: Seasonal Banner Slide
echo "2️⃣ Seasonal Banner Slide (seasonal_banner_slide)"
curl -s -X POST \
  "https://${SHOPIFY_STORE_DOMAIN}/api/2024-07/graphql.json" \
  -H "Content-Type: application/json" \
  -H "X-Shopify-Storefront-Access-Token: ${SHOPIFY_STOREFRONT_ACCESS_TOKEN}" \
  -d '{
    "query": "query { metaobjects(type: \"seasonal_banner_slide\", first: 5) { edges { node { id handle fields { key value } } } } }"
  }' | jq '.data.metaobjects.edges[] | .node | {handle, fields: [.fields[] | {key, value}]}'

echo ""
echo "---"
echo ""

# Test 3: Announcement
echo "3️⃣ Announcement (announc)"
curl -s -X POST \
  "https://${SHOPIFY_STORE_DOMAIN}/api/2024-07/graphql.json" \
  -H "Content-Type: application/json" \
  -H "X-Shopify-Storefront-Access-Token: ${SHOPIFY_STOREFRONT_ACCESS_TOKEN}" \
  -d '{
    "query": "query { metaobjects(type: \"announc\", first: 5) { edges { node { id handle fields { key value } } } } }"
  }' | jq '.data.metaobjects.edges[] | .node | {handle, fields: [.fields[] | {key, value}]}'

echo ""
echo "---"
echo ""

# Test 4: Imágenes nuevas
echo "4️⃣ Imagenes nuevas (imagenes_nuevas)"
curl -s -X POST \
  "https://${SHOPIFY_STORE_DOMAIN}/api/2024-07/graphql.json" \
  -H "Content-Type: application/json" \
  -H "X-Shopify-Storefront-Access-Token: ${SHOPIFY_STOREFRONT_ACCESS_TOKEN}" \
  -d '{
    "query": "query { metaobjects(type: \"imagenes_nuevas\", first: 5) { edges { node { id handle fields { key value } } } } }"
  }' | jq '.data.metaobjects.edges[] | .node | {handle, fields: [.fields[] | {key, value}]}'

echo ""
echo "✅ Pruebas completadas"

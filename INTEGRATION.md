# Juan Becerra - Integración de Diseño con Shopify

Este proyecto integra el diseño personalizado de Juan Becerra con la funcionalidad completa de Shopify Commerce.

## 🎯 Lo que se Integró

### ✅ Componentes de Diseño Personalizados
Todos los componentes visuales de `juan-Becerra` fueron migrados a `components/custom/`:

- **AnnouncementBar.jsx** - Barra de anuncios superior
- **HeroSection.jsx** - Hero section principal con imagen de fondo
- **CategorySection.jsx** - Sección de categorías
- **SeasonalBanner.jsx** - Banner estacional
- **FeaturedProducts.jsx** - Carrusel de productos destacados (adaptado para Shopify)
- **BrandPhilosophy.tsx** - Filosofía de marca
- **Newsletter.tsx** - Suscripción a newsletter
- **InstagramFeed.tsx** - Feed de Instagram
- **FooterCustom.jsx** - Footer personalizado
- **NavbarIntegrated.tsx** - Navbar personalizado con carrito de Shopify

### ✅ Integración con Shopify
- Productos dinámicos desde Shopify GraphQL API
- Carrito de compras funcional
- Sistema de checkout completo
- Gestión de colecciones y productos en tiempo real

### ✅ Assets y Estilos
- Fuentes personalizadas (Belleza y Moderat)
- Paleta de colores de marca
- Imágenes y assets públicos
- Estilos globales CSS

## 📁 Estructura del Proyecto

\`\`\`
juan-becerra-integrated/
├── app/
│   ├── page.tsx              # Home page con diseño integrado
│   ├── layout.tsx            # Layout con navbar personalizado
│   └── globals.css           # Estilos globales + marca
├── components/
│   ├── custom/               # Componentes de diseño personalizado
│   ├── cart/                 # Sistema de carrito de Shopify
│   ├── layout/               # Componentes de layout originales
│   └── ...
├── fonts/
│   ├── Belleza-Regular.ttf
│   └── Moderat-Black.ttf
├── lib/
│   └── shopify/              # Integración con Shopify API
├── public/                   # Assets públicos
└── .env                      # Variables de entorno
\`\`\`

## 🚀 Instalación y Uso

### 1. Instalar Dependencias

\`\`\`bash
cd juan-becerra-integrated
pnpm install
# o
npm install
\`\`\`

### 2. Verificar Variables de Entorno

El archivo \`.env\` ya está configurado con:

\`\`\`env
COMPANY_NAME="Juan Becerra"
SITE_NAME="Juan Becerra - Marroquinería de Lujo"
SHOPIFY_STOREFRONT_ACCESS_TOKEN="91979f5f707d723525e24106eeeaa7a2"
SHOPIFY_STORE_DOMAIN="juan-becerra.myshopify.com"
SHOPIFY_REVALIDATION_SECRET=""
\`\`\`

### 3. Ejecutar en Desarrollo

\`\`\`bash
pnpm dev
# o
npm run dev
\`\`\`

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### 4. Build para Producción

\`\`\`bash
pnpm build
pnpm start
# o
npm run build
npm start
\`\`\`

## 🎨 Características Principales

### Home Page
La página principal incluye:
1. **AnnouncementBar** - Barra superior con ofertas
2. **Navbar Integrado** - Con carrito funcional de Shopify
3. **HeroSection** - Banner principal con imagen
4. **CategorySection** - Categorías de productos
5. **SeasonalBanner** - Banner estacional
6. **FeaturedProducts** - Productos destacados desde Shopify
7. **BrandPhilosophy** - Filosofía de marca
8. **Newsletter** - Suscripción
9. **InstagramFeed** - Feed social
10. **Footer** - Footer personalizado

### Datos Dinámicos
- Los productos se cargan desde Shopify en tiempo real
- El carrito es completamente funcional
- Las colecciones se sincronizan automáticamente
- Sistema de checkout integrado

## 🔧 Personalización

### Modificar Productos Destacados
Edita \`app/page.tsx\` en la función \`FeaturedProductsSection\`:

\`\`\`typescript
const products = await getProducts({
  sortKey: 'BEST_SELLING',  // Cambiar criterio
  reverse: false             // Orden
});
\`\`\`

### Cambiar Colores de Marca
Edita \`app/globals.css\`:

\`\`\`css
:root {
  --brand-primary: #000000;
  --brand-accent: #C0A080;
  /* etc... */
}
\`\`\`

### Modificar Navegación
Edita \`components/custom/NavbarIntegrated.tsx\`:

\`\`\`typescript
const navLinks = [
  { href: "/search", text: "Nueva Colección", highlight: false },
  // Agregar más links...
];
\`\`\`

## 📦 Dependencias Nuevas Agregadas

- \`lucide-react\` - Iconos
- \`react-slick\` - Carrusel de productos
- \`slick-carousel\` - Estilos de carrusel

## ⚠️ Notas Importantes

1. **Fuentes Personalizadas**: Las fuentes Belleza y Moderat están cargadas localmente desde \`/fonts\`

2. **Navbar**: Se usa \`NavbarIntegrated\` que combina el diseño personalizado con el carrito de Shopify

3. **Imágenes**: Todas las imágenes públicas están en \`/public\`

4. **Productos**: Los productos se adaptan del formato Shopify al formato esperado por los componentes

## 🔄 Próximos Pasos

### Opcional:
1. Configurar páginas de producto individuales con el diseño personalizado
2. Crear página de colecciones personalizada
3. Agregar página "Sobre Nosotros"
4. Implementar búsqueda personalizada
5. Agregar más secciones personalizadas

### Para Deploy:
1. Subir a GitHub
2. Conectar con Vercel
3. Configurar variables de entorno en Vercel
4. Deploy automático

## 📝 Comandos Útiles

\`\`\`bash
# Desarrollo
pnpm dev

# Build
pnpm build

# Producción
pnpm start

# Linting
pnpm prettier

# Verificar formato
pnpm prettier:check
\`\`\`

## 🤝 Soporte

Si encuentras algún problema:
1. Verifica que las dependencias estén instaladas
2. Revisa que el archivo \`.env\` esté configurado
3. Limpia caché: \`rm -rf .next\` y vuelve a hacer build

---

**¡Integración completada exitosamente! 🎉**

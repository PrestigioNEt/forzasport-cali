# Pinneacle Perfumería - Tienda E-commerce

Tienda de e-commerce de perfumería construida con Next.js 15 y WooCommerce.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)

## 🎯 Características

### ✅ Diseño Personalizado
- **Marca Pinneacle**: Colores corporativos (#101828), tipografías exclusivas
- **Layout responsive**: Diseño adaptable a todos los dispositivos
- **Grid de 4 columnas**: Presentación optimizada de productos
- **Componentes personalizados**: Hero, banners, categorías, productos destacados

### ✅ Integración WooCommerce
- **Productos dinámicos**: Catálogo completo desde WooCommerce via GraphQL
- **Carrito local**: Sistema de carrito con persistencia en localStorage
- **Búsqueda AJAX**: Búsqueda en tiempo real con debouncing
- **Productos variables**: Soporte para variaciones (tamaño, fragrance, etc.)
- **Precios CLP**: Formato chileno con separadores de miles

### ✅ Funcionalidades
- **Checkout WhatsApp**: Proceso de compra vía WhatsApp
- **Productos vistos**: Tracking de productos visitados
- **Stock en tiempo real**: Indicadores de disponibilidad
- **Páginas informativas**: Políticas, términos, envíos (Chile)

## 🚀 Quick Start

### Requisitos Previos

- Node.js 18+
- pnpm (recomendado) o npm
- Cuenta de WooCommerce con GraphQL API habilitada

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/cristiansk8/pinneacle.git
cd pinneacle

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local
```

### Configuración de Variables de Entorno

Crear archivo `.env.local`:

```env
# WooCommerce GraphQL API
NEXT_PUBLIC_WOOCOMMERCE_URL=https://tu-sitio.com
NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY=tu_consumer_key
NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET=tu_consumer_secret

# Configuración del sitio
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
NEXT_PUBLIC_PHONE_NUMBER=56946152919
```

### Ejecutar en Desarrollo

```bash
pnpm dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

### Build de Producción

```bash
pnpm build
pnpm start
```

## 📁 Estructura del Proyecto

```
pinneacle/
├── app/                      # App Router de Next.js 15
│   ├── api/                  # API Routes
│   ├── cart/                 # Página del carrito
│   ├── checkout/             # Página de checkout
│   ├── product/[slug]/       # Páginas de producto
│   ├── search/               # Páginas de búsqueda y categorías
│   └── page.tsx              # Homepage
│
├── components/               # Componentes React
│   ├── cart/                 # Sistema de carrito
│   ├── custom/               # Componentes personalizados
│   ├── layout/               # Layout components
│   ├── product/              # Componentes de producto
│   └── providers/            # Context providers
│
├── lib/                      # Utilidades y configuración
│   └── woocommerce/          # Integración WooCommerce
│
└── docs/                     # Documentación técnica
    ├── ARQUITECTURA_CARRITO.md
    └── GUIA_DESARROLLO.md
```

## 🛠️ Stack Tecnológico

### Frontend
- **[Next.js 15](https://nextjs.org/)** - Framework React con App Router
- **[React 19](https://react.dev/)** - Biblioteca de UI
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Framework CSS utilitario

### Backend
- **[WooCommerce GraphQL API](https://woocommerce.github.io/woocommerce-rest-api-docs/)** - Gestión de productos
- **Next.js API Routes** - Endpoints personalizados

### Herramientas
- **ESLint** - Linting de código
- **Prettier** - Formateo de código
- **Sentry** - Monitoreo de errores

## 📚 Documentación

- **[Documentación Técnica](./DOCUMENTACION_TECNICA.md)** - Guía completa del proyecto
- **[Arquitectura del Carrito](./docs/ARQUITECTURA_CARRITO.md)** - Sistema de carrito local
- **[Guía de Desarrollo](./docs/GUIA_DESARROLLO.md)** - Convenciones y buenas prácticas

## 🎨 Características de UI

### Colores Corporativos
```css
Color principal: #101828 (azul oscuro)
Hover: #1a2332 (azul ligeramente más claro)
Invertido: Blanco con texto #101828
```

### Layout de Productos
- **Mobile**: 2 columnas
- **Desktop**: 4 columnas
- **Gap**: 24px (1.5rem)

### Componentes Principales
- **WooNavbar**: Navegación con búsqueda AJAX y menú de categorías
- **ProductDescriptionWoo**: Detalle de producto con variaciones
- **CartDrawer**: Panel lateral del carrito
- **RecentlyViewedProducts**: Productos vistos recientemente
- **BannerCarousel**: Carrusel de banners principales

## 🔧 Scripts Disponibles

```bash
# Desarrollo
pnpm dev              # Servidor de desarrollo

# Build
pnpm build            # Build de producción
pnpm start            # Iniciar producción

# Calidad de código
pnpm lint             # Ejecutar ESLint
pnpm lint:fix         # Auto-corregir problemas
pnpm prettier         # Formatear código
pnpm prettier:check   # Verificar formateo
pnpm test             # Ejecutar tests (lint + prettier)
```

## 🌐 Despliegue

### Vercel (Recomendado)

1. Fork el repositorio
2. Importar en [Vercel](https://vercel.com)
3. Configurar variables de entorno
4. Deploy automático en cada push a `main`

### Otros Proveedores

El proyecto puede desplegarse en cualquier plataforma que soporte Next.js:
- Netlify
- Railway
- AWS Amplify
- Docker containers

## 📱 Páginas del Sitio

- **/** - Homepage con banners y productos destacados
- **/search** - Buscador de productos
- **/search/[collection]** - Páginas de categorías
- **/product/[slug]** - Páginas individuales de producto
- **/cart** - Carrito de compras
- **/checkout** - Checkout vía WhatsApp

### Páginas Informativas
- **/politica-envios** - Política de envíos (Chile)
- **/politica-reembolso** - Política de reembolsos
- **/politica-proteccion-datos** - Protección de datos personales
- **/terminos-y-condiciones** - Términos y condiciones
- **/terminos-del-servicio** - Términos del servicio

## 🛒 Carrito de Compras

El carrito utiliza **localStorage** para persistencia:

- ✅ Sin backend adicional
- ✅ Persistencia entre sesiones
- ✅ Actualizaciones optimistas
- ✅ Soporte para cantidades y eliminación
- ✅ Checkout vía WhatsApp

## 🔍 Búsqueda AJAX

Búsqueda en tiempo real con:
- Debouncing de 300ms
- Máximo 8 resultados
- Formato CLP en precios
- Imágenes y precios actualizados

## 📞 Contacto

- **Email**: contacto@pinneacleperfumeria.com
- **Teléfono**: +56 9 4615 2919
- **Sitio**: [pinneacleperfumeria.com](https://pinneacleperfumeria.com)

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'feat: add amazing feature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

Ver la [Guía de Desarrollo](./docs/GUIA_DESARROLLO.md) para más detalles sobre convenciones.

## 📄 Licencia

Este proyecto es propiedad de Pinneacle Perfumería. Todos los derechos reservados.

## 👥 Autor

**Cristian** - [Github](https://github.com/cristiansk8)

---

**Versión**: 1.0.0
**Última actualización**: Marzo 2026

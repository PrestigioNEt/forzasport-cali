# 📚 Índice de Documentación - Pinneacle Perfumería

Bienvenido a la documentación técnica de Pinneacle Perfumería. Esta documentación está diseñada para desarrolladores que trabajan en el proyecto o necesitan entender la arquitectura del sistema.

## 🚀 Inicio Rápido

Si es tu primera vez trabajando en este proyecto, comienza con:

1. **[README.md](../README.md)** - Visión general del proyecto y configuración inicial
2. **[.env.example](../.env.example)** - Plantilla de variables de entorno

## 📖 Documentación Principal

### [Documentación Técnica](../DOCUMENTACION_TECNICA.md)
Guía completa del proyecto que incluye:
- Stack tecnológico
- Estructura del proyecto
- Configuración del entorno
- Componentes principales
- API Routes
- Integración con WooCommerce
- Scripts disponibles
- Buenas prácticas
- Troubleshooting

**Ideal para**: Desarrolladores nuevos en el proyecto, revisión general de arquitectura

### [Arquitectura del Carrito](./ARQUITECTURA_CARRITO.md)
Documentación profunda del sistema de carrito de compras:
- Arquitectura de datos
- Flujo de usuario completo
- Componentes del carrito
- Persistencia con localStorage
- Integración con WhatsApp
- Debugging y testing
- Troubleshooting específico

**Ideal para**: Mantenimiento del carrito, debugging, nuevas funcionalidades de checkout

### [Guía de Desarrollo](./GUIA_DESARROLLO.md)
Convenciones y mejores prácticas:
- Nomenclatura de archivos y variables
- Estructura de componentes
- Guía de estilos (colores, tipografía, espaciado)
- Patrones de componentes
- TypeScript best practices
- Testing y debugging
- Git workflow
- Code review checklist

**Ideal para**: Desarrolladores que contribuyen código, revisión de código

## 🎯 Por Tema

### Configuración e Instalación
- **[README.md](../README.md)** - Instalación y configuración inicial
- **[.env.example](../.env.example)** - Variables de entorno necesarias

### Arquitectura
- **[Documentación Técnica - Arquitectura](../DOCUMENTACION_TECNICA.md#arquitectura)** - Visión general de arquitectura
- **[Arquitectura del Carrito](./ARQUITECTURA_CARRITO.md#arquitectura-de-datos)** - Arquitectura específica del carrito

### Componentes
- **[Documentación Técnica - Componentes](../DOCUMENTACION_TECNICA.md#componentes-principales)** - Componentes principales del sistema
- **[Guía de Desarrollo - Patrones](./GUIA_DESARROLLO.md#patrones-de-componentes)** - Patrones de componentes reutilizables

### Estilos
- **[Guía de Desarrollo - Estilos](./GUIA_DESARROLLO.md#guía-de-estilos)** - Colores, tipografía, espaciado
- **[Documentación Técnica - Estilos](../DOCUMENTACION_TECNICA.md#estilos-y-ui)** - Configuración de Tailwind CSS

### Integraciones
- **[Documentación Técnica - WooCommerce](../DOCUMENTACION_TECNICA.md#integración-con-woocommerce)** - Integración con GraphQL API
- **[Arquitectura del Carrito - WhatsApp](./ARQUITECTURA_CARRITO.md#integración-con-whatsapp)** - Checkout vía WhatsApp

## 🔧 Referencias Rápidas

### Scripts Comunes
```bash
pnpm dev              # Desarrollo
pnpm build            # Build de producción
pnpm start            # Iniciar producción
pnpm lint             # Linting
pnpm prettier         # Formatear código
```

### Colores Corporativos
```css
Principal: #101828 (azul oscuro)
Hover: #1a2332
Invertido: Blanco con texto #101828
```

### Estructura de Directorios
```
app/              # Páginas y API routes
components/       # Componentes React
lib/             # Utilidades y configuración
docs/            # Documentación técnica
public/          # Archivos estáticos
```

## 📝 Glosario

- **WooCommerce**: Plataforma de e-commerce utilizada como backend
- **GraphQL API**: API de WooCommerce para obtener productos
- **localStorage**: Almacenamiento local del navegador para persistencia del carrito
- **Server Component**: Componente de React que se renderiza en el servidor
- **Client Component**: Componente de React con interactividad (useState, useEffect)
- **CLP**: Peso Chileno, formato de moneda usado ($XX.XXX)
- **Checkout**: Proceso finalización de compra (vía WhatsApp)

## 🆘 Ayuda y Soporte

### Problemas Comunes
- **Carrito no persiste**: Ver [Troubleshooting - Carrito](./ARQUITECTURA_CARRITO.md#problema-carrito-no-persiste)
- **Productos no aparecen**: Ver [Troubleshooting - General](../DOCUMENTACION_TECNICA.md#problemas-comunes)
- **Build falla**: Ejecutar `pnpm lint` y `pnpm prettier:check`

### Contacto del Proyecto
- **Email**: contacto@pinneacleperfumeria.com
- **Teléfono**: +56 9 4615 2919
- **GitHub**: [cristiansk8/pinneacle](https://github.com/cristiansk8/pinneacle)

## 📅 Actualizaciones

- **Marzo 2026**: Creación de documentación técnica completa
- **Marzo 2026**: Implementación de carrito local
- **Marzo 2026**: Migración de Shopify a WooCommerce

## 🤝 Contribuir a la Documentación

Si encuentras errores o mejoras en la documentación:

1. Editar el archivo correspondiente
2. Seguir el formato markdown existente
3. Agregar ejemplos cuando sea relevante
4. Actualizar la fecha de la última modificación

Para nuevas secciones de documentación:
1. Crear archivo en `docs/`
2. Agregar enlace a este índice
3. Seguir la estructura establecida

---

**Versión**: 1.0.0
**Última actualización**: Marzo 2026

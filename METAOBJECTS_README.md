# 📚 Documentación de Metaobjects - Juan Becerra

Bienvenido a la documentación completa para configurar y gestionar el contenido editable de la página de inicio usando Shopify Metaobjects.

## 📖 Guías Disponibles

### 🔥 NUEVO: [Guía de Actualización](./METAOBJECTS_UPDATE_GUIDE.md)
**Para quién**: Si YA tienes metaobjects pero los botones del Hero van siempre a /search/todos

**Qué incluye**:
- Cómo agregar campos de URL a Home Hero
- Paso a paso para actualizar (5 minutos)
- Configuración de URLs dinámicas
- Ideas de configuración de botones

**Tiempo estimado**: 5 minutos

📄 [Abrir Guía de Actualización →](./METAOBJECTS_UPDATE_GUIDE.md)

---

### ✅ [Checklist de Revisión](./METAOBJECTS_CHECKLIST.md)
**Para quién**: Para verificar que TODO está correctamente configurado

**Qué incluye**:
- Checklist completo de todas las definiciones
- Verificación de campos obligatorios
- Validación de entradas de contenido
- Lista de campos actualizados (v2.0)

**Tiempo estimado**: 10-15 minutos

📄 [Abrir Checklist →](./METAOBJECTS_CHECKLIST.md)

---

### 🔍 [Guía de Inspección](./METAOBJECTS_INSPECTION_GUIDE.md)
**Para quién**: Para revisar y diagnosticar problemas en metaobjects existentes

**Qué incluye**:
- Cómo verificar cada metaobject paso a paso
- Inspección rápida (5 min) o detallada (15 min)
- Solución de problemas comunes
- Testing en el sitio web

**Tiempo estimado**: 5-15 minutos

📄 [Abrir Guía de Inspección →](./METAOBJECTS_INSPECTION_GUIDE.md)

---

### 1. 🎓 [Tutorial Completo](./SHOPIFY_METAOBJECTS_TUTORIAL.md)
**Para quién**: Personas que nunca han usado Metaobjects o necesitan instrucciones detalladas paso a paso.

**Qué incluye**:
- Introducción a Metaobjects
- Paso a paso detallado con explicaciones
- Cómo crear cada definición con todos sus campos
- Cómo crear las entradas de contenido
- Tips y mejores prácticas
- Solución de problemas comunes
- Checklist final

**Tiempo estimado**: 30-45 minutos

📄 [Abrir Tutorial Completo →](./SHOPIFY_METAOBJECTS_TUTORIAL.md)

---

### 2. ⚡ [Referencia Rápida](./QUICK_REFERENCE.md)
**Para quién**: Personas que ya configuraron los metaobjects y necesitan consultar información específica rápidamente.

**Qué incluye**:
- Tabla de handles requeridos
- Estructura resumida de cada definición
- Especificaciones de imágenes
- Atajos comunes
- Errores frecuentes

**Tiempo estimado**: 2-3 minutos de consulta

📄 [Abrir Referencia Rápida →](./QUICK_REFERENCE.md)

---

### 3. 🎨 [Guía Visual](./VISUAL_GUIDE.md)
**Para quién**: Personas que aprenden mejor con ejemplos visuales y quieren ver cómo se ve cada paso en Shopify.

**Qué incluye**:
- Diagramas ASCII de cada pantalla
- Representación visual de formularios
- Ejemplos de cómo se ven los campos
- Checklist visual
- Identificación de elementos clave

**Tiempo estimado**: 15-20 minutos

📄 [Abrir Guía Visual →](./VISUAL_GUIDE.md)

---

### 4. 📋 [Guía Original](./METAOBJECTS_GUIDE.md)
**Para quién**: Referencia técnica completa con toda la información en un solo documento.

**Qué incluye**:
- Explicación técnica de Metaobjects
- Todas las definiciones y campos
- Contenido inicial recomendado
- Instrucciones de uso

**Tiempo estimado**: 20-25 minutos

📄 [Abrir Guía Original →](./METAOBJECTS_GUIDE.md)

---

## 🚀 Inicio Rápido

Si es tu primera vez, sigue este orden:

1. **Lee** el [Tutorial Completo](./SHOPIFY_METAOBJECTS_TUTORIAL.md) (30 min)
2. **Configura** siguiendo los pasos del tutorial
3. **Guarda** la [Referencia Rápida](./QUICK_REFERENCE.md) para consultas futuras
4. **Usa** la [Guía Visual](./VISUAL_GUIDE.md) si te pierdes

---

## 🎯 ¿Qué se puede editar?

Una vez configurado, podrás editar desde Shopify Admin:

### ✅ Barra de Anuncio Superior
- Texto del anuncio
- Activar/desactivar visibilidad

### ✅ Sección Hero (Banner Principal)
- Título principal
- Descripción
- Imagen de fondo
- Texto de los 2 botones

### ✅ Banner Estacional (Slides)
- Crear múltiples slides
- Imagen de cada slide
- Tag, título y subtítulo
- Texto del botón y enlace
- Ordenar slides

### ✅ Sección de Filosofía de Marca
- Título de la sección
- Descripción
- Frase/cita inspiradora
- 2 imágenes laterales

### ✅ Newsletter
- Título de la sección
- Descripción/llamado a la acción

---

## ⏱️ Tiempos Estimados

| Tarea | Tiempo |
|-------|--------|
| Configuración inicial completa | 30-45 min |
| Editar texto de un componente | 2-3 min |
| Cambiar una imagen | 3-5 min |
| Agregar un nuevo slide | 5-7 min |

---

## 🔑 Handles Importantes (Copiar y Pegar)

```
home-hero
slide-1
slide-2
brand-philosophy
newsletter
announcement
```

Estos handles DEBEN ser exactamente así (con guiones, en minúsculas).

---

## 📊 Estructura del Proyecto

```
juan-becerra/
├── METAOBJECTS_README.md        ← Estás aquí
├── SHOPIFY_METAOBJECTS_TUTORIAL.md  ← Tutorial completo
├── QUICK_REFERENCE.md                ← Referencia rápida
├── VISUAL_GUIDE.md                   ← Guía visual
├── METAOBJECTS_GUIDE.md              ← Guía original
└── lib/shopify/
    ├── queries/metaobject.ts         ← Queries GraphQL
    ├── types.ts                      ← Tipos TypeScript
    └── index.ts                      ← Funciones de Shopify
```

---

## 🆘 Soporte

### Preguntas Frecuentes

**P: ¿Cuánto tarda en verse un cambio en el sitio?**
R: Entre 1-5 minutos. Usa Ctrl+F5 para refrescar.

**P: ¿Puedo agregar más slides?**
R: Sí, solo crea una nueva entrada de "Home Slide" con un handle único.

**P: ¿Qué pasa si uso un handle diferente?**
R: El sitio no encontrará el contenido. Usa exactamente los handles indicados.

**P: ¿Puedo cambiar el handle después de crear la entrada?**
R: No es recomendable. Es mejor crear una nueva entrada con el handle correcto.

**P: Las imágenes se ven pixeladas, ¿por qué?**
R: Usa imágenes de al menos 1920px de ancho para fondos grandes.

---

## 📞 Contacto

Si tienes problemas técnicos o necesitas ayuda:

1. Revisa la sección "Solución de Problemas" del [Tutorial Completo](./SHOPIFY_METAOBJECTS_TUTORIAL.md)
2. Consulta la [Referencia Rápida](./QUICK_REFERENCE.md) para errores comunes
3. Contacta al desarrollador con:
   - Captura de pantalla del problema
   - Descripción de qué intentabas hacer
   - El tipo de metaobject y handle que usaste

---

## 🎓 Recursos Adicionales

- [Shopify Metaobjects Documentation](https://help.shopify.com/en/manual/custom-data/metaobjects)
- [Shopify Admin Help](https://help.shopify.com/)
- [GraphQL Admin API](https://shopify.dev/docs/api/admin-graphql)

---

## 📅 Historial de Cambios

**v1.0 - 25 de Noviembre 2025**
- Implementación inicial de Metaobjects
- 5 tipos de contenido editable
- Documentación completa en 4 guías

---

## ✨ Próximas Mejoras Planeadas

- [ ] Metaobject para Instagram Feed
- [ ] Metaobject para colores de tema
- [ ] Preview en tiempo real desde Shopify
- [ ] Backup automático de contenido

---

**Creado por**: Claude Code
**Fecha**: 25 de Noviembre 2025
**Versión**: 1.0

---

## 🎉 ¡Comienza Ahora!

👉 [Ir al Tutorial Completo](./SHOPIFY_METAOBJECTS_TUTORIAL.md)

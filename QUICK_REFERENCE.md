# 📋 Referencia Rápida - Metaobjects Juan Becerra

## 🎯 Handles que DEBES usar (exactamente así):

| Metaobject | Handle | Ubicación |
|-----------|---------|-----------|
| Hero Principal | `home-hero` | Content → Metaobjects → Home Hero |
| Slide 1 | `slide-1` | Content → Metaobjects → Home Slide |
| Slide 2 | `slide-2` | Content → Metaobjects → Home Slide |
| Filosofía de Marca | `brand-philosophy` | Content → Metaobjects → Home Brand Section |
| Newsletter | `newsletter` | Content → Metaobjects → Home Newsletter |
| Anuncio Superior | `announcement` | Content → Metaobjects → Home Announcement |

---

## 🏗️ Estructura de Definiciones

### 1. Home Hero (Type: `home_hero`)
✅ One entry per store: YES

| Campo | Tipo | Key |
|-------|------|-----|
| Título | Single line text | `title` |
| Descripción | Multi-line text | `description` |
| Imagen | File (Image) | `image` |
| Texto Botón 1 | Single line text | `button_text` |
| Texto Botón 2 | Single line text | `button_text_2` |

---

### 2. Home Slide (Type: `home_slide`)
✅ One entry per store: NO (múltiples entradas)

| Campo | Tipo | Key |
|-------|------|-----|
| Imagen | File (Image) | `image` |
| Tag | Single line text | `tag` |
| Título | Single line text | `title` |
| Subtítulo | Multi-line text | `subtitle` |
| Texto del Botón | Single line text | `button_text` |
| Enlace | Single line text | `href` |

---

### 3. Home Brand Section (Type: `home_brand_section`)
✅ One entry per store: YES

| Campo | Tipo | Key |
|-------|------|-----|
| Título | Single line text | `title` |
| Descripción | Multi-line text | `description` |
| Cita | Multi-line text | `quote` |
| Imagen 1 | File (Image) | `image_1` |
| Imagen 2 | File (Image) | `image_2` |

---

### 4. Home Newsletter (Type: `home_newsletter`)
✅ One entry per store: YES

| Campo | Tipo | Key |
|-------|------|-----|
| Título | Single line text | `title` |
| Descripción | Multi-line text | `description` |

---

### 5. Home Announcement (Type: `home_announcement`)
✅ One entry per store: YES

| Campo | Tipo | Key |
|-------|------|-----|
| Texto | Single line text | `text` |
| Habilitado | Single line text | `enabled` |

💡 Para el campo "Habilitado": escribe `true` o `false`

---

## 🚀 Flujo Rápido de Configuración

### Crear Definiciones:
```
1. Settings → Custom data → Metaobjects
2. Add definition (5 veces)
3. Copiar estructura de arriba
4. Save cada una
```

### Crear Contenido:
```
1. Content → Metaobjects
2. Seleccionar tipo
3. Add entry
4. Poner el handle EXACTO
5. Llenar campos
6. Save
```

---

## 📐 Especificaciones de Imágenes

| Ubicación | Tamaño Recomendado | Formato |
|-----------|-------------------|---------|
| Hero Principal | 1920x1080px | JPG/WEBP |
| Slides | 1920x1080px | JPG/WEBP |
| Brand Section | 800x1000px | JPG/WEBP |
| Peso máximo | 500KB | - |

---

## ⚡ Atajos

**Editar contenido:**
Content → Metaobjects → [Seleccionar tipo] → Click en entrada → Editar → Save

**Agregar slide nuevo:**
Content → Metaobjects → Home Slide → Add entry → Handle: `slide-3` → Llenar → Save

**Desactivar anuncio:**
Content → Metaobjects → Home Announcement → announcement → Cambiar "true" a "false" → Save

---

## 🔥 Errores Comunes

| Error | Solución |
|-------|----------|
| Handle incorrecto | Revisar tabla de handles arriba |
| Imagen no aparece | Verificar que se subió y formato es correcto |
| Cambios no se ven | Esperar 5 min + Ctrl+F5 |
| "Handle already exists" | Estás duplicando, usa otro nombre |

---

## 📞 Contacto Desarrollador

Si necesitas ayuda, envía:
- Captura de pantalla del error
- Qué estabas intentando hacer
- El tipo de metaobject y handle que usaste

---

**Última actualización:** 25/Nov/2025

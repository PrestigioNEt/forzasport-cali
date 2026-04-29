# ✅ Checklist de Metaobjects - Juan Becerra

## 📋 Guía de Revisión Completa

Usa este checklist para revisar y validar que todos los metaobjects estén correctamente configurados en Shopify.

---

## 🎯 PASO 1: Verificar Definiciones de Metaobjects

Ve a: **Settings → Custom data → Metaobjects**

### ✅ Definición 1: Home Hero
- [ ] **Name**: `Home Hero`
- [ ] **Type**: `home_hero`
- [ ] **One entry per store**: ✅ Activado

**Campos requeridos (7 campos):**
- [ ] `title` - Single line text
- [ ] `description` - Multi-line text
- [ ] `background_image` - File (Image)
- [ ] `primary_button_text` - Single line text
- [ ] `primary_button_url` - Single line text ⭐ NUEVO
- [ ] `secondary_button_text` - Single line text
- [ ] `secondary_button_url` - Single line text ⭐ NUEVO

---

### ✅ Definición 2: Home Slide
- [ ] **Name**: `Home Slide`
- [ ] **Type**: `home_slide`
- [ ] **One entry per store**: ❌ Desactivado (múltiples entradas)

**Campos requeridos (6 campos):**
- [ ] `image` - File (Image)
- [ ] `tag` - Single line text
- [ ] `title` - Single line text
- [ ] `subtitle` - Multi-line text
- [ ] `button_text` - Single line text
- [ ] `href` - Single line text

---

### ✅ Definición 3: Home Brand Section
- [ ] **Name**: `Home Brand Section`
- [ ] **Type**: `home_brand_section`
- [ ] **One entry per store**: ✅ Activado

**Campos requeridos (5 campos):**
- [ ] `title` - Single line text
- [ ] `description` - Multi-line text
- [ ] `quote` - Multi-line text
- [ ] `image_1` - File (Image)
- [ ] `image_2` - File (Image)

---

### ✅ Definición 4: Home Newsletter
- [ ] **Name**: `Home Newsletter`
- [ ] **Type**: `home_newsletter`
- [ ] **One entry per store**: ✅ Activado

**Campos requeridos (2 campos):**
- [ ] `title` - Single line text
- [ ] `description` - Multi-line text

---

### ✅ Definición 5: Home Announcement
- [ ] **Name**: `Home Announcement`
- [ ] **Type**: `home_announcement`
- [ ] **One entry per store**: ✅ Activado

**Campos requeridos (2 campos):**
- [ ] `text` - Single line text
- [ ] `enabled` - Single line text

---

## 🎯 PASO 2: Verificar Entradas de Contenido

Ve a: **Content → Metaobjects**

### ✅ Entrada 1: Home Hero
**Tipo**: Home Hero
**Handle**: `home-hero` (exactamente así, con guión)

**Contenido a verificar:**
- [ ] Título está lleno
- [ ] Descripción está llena
- [ ] Imagen de fondo está cargada (min 1920px ancho)
- [ ] Texto del botón primario está lleno
- [ ] **URL del botón primario está llena** (ej: `/search/nuevos-productos`) ⭐
- [ ] Texto del botón secundario está lleno
- [ ] **URL del botón secundario está llena** (ej: `/search/lookbook`) ⭐

**Ejemplo de URLs válidas:**
- `/search/todos`
- `/search/nuevos-productos`
- `/search/ofertas`
- `/search/accesorios`
- `/search/[nombre-coleccion]`

---

### ✅ Entrada 2: Home Slide 1
**Tipo**: Home Slide
**Handle**: `slide-1`

**Contenido a verificar:**
- [ ] Imagen cargada (1920x1080px recomendado)
- [ ] Tag lleno (ej: "Nueva Temporada")
- [ ] Título lleno
- [ ] Subtítulo lleno
- [ ] Texto del botón lleno
- [ ] URL/href lleno (ej: `/search`)

---

### ✅ Entrada 3: Home Slide 2
**Tipo**: Home Slide
**Handle**: `slide-2`

**Contenido a verificar:**
- [ ] Imagen cargada (1920x1080px recomendado)
- [ ] Tag lleno
- [ ] Título lleno
- [ ] Subtítulo lleno
- [ ] Texto del botón lleno
- [ ] URL/href lleno

---

### ✅ Entrada 4: Brand Philosophy
**Tipo**: Home Brand Section
**Handle**: `brand-philosophy`

**Contenido a verificar:**
- [ ] Título lleno
- [ ] Descripción llena
- [ ] Cita/Quote llena
- [ ] Imagen 1 cargada (800x1000px recomendado)
- [ ] Imagen 2 cargada (800x1000px recomendado)

---

### ✅ Entrada 5: Newsletter
**Tipo**: Home Newsletter
**Handle**: `newsletter`

**Contenido a verificar:**
- [ ] Título lleno
- [ ] Descripción llena

---

### ✅ Entrada 6: Announcement
**Tipo**: Home Announcement
**Handle**: `announcement`

**Contenido a verificar:**
- [ ] Texto del anuncio lleno
- [ ] Campo "enabled" con valor `true` o `false`

---

## 🎯 PASO 3: Validación Visual en el Sitio

Ve a tu sitio web y verifica que se muestre correctamente:

### Hero Section (Banner principal)
- [ ] Título se ve correctamente
- [ ] Descripción se ve correctamente
- [ ] Imagen de fondo se muestra en alta calidad
- [ ] Botón primario muestra el texto correcto ⭐
- [ ] **Botón primario lleva a la URL correcta al hacer click** ⭐
- [ ] Botón secundario muestra el texto correcto ⭐
- [ ] **Botón secundario lleva a la URL correcta al hacer click** ⭐

### Seasonal Banner (Slides)
- [ ] Los slides se muestran correctamente
- [ ] Imágenes cargan en alta calidad
- [ ] Navegación entre slides funciona
- [ ] Los enlaces de los botones funcionan

### Brand Philosophy
- [ ] Título y descripción se muestran
- [ ] Ambas imágenes cargan correctamente
- [ ] La cita se muestra con el estilo correcto

### Newsletter
- [ ] Sección se muestra con título correcto
- [ ] El formulario funciona

### Announcement Bar
- [ ] Se muestra en la parte superior si está habilitado
- [ ] Texto es correcto
- [ ] No se muestra si está en `false`

---

## 🔧 SOLUCIÓN DE PROBLEMAS

### ❌ "No veo el contenido del metaobject"

**Posibles causas:**
1. Handle incorrecto → Verifica que sea exactamente como se indica
2. Campos vacíos → Llena todos los campos requeridos
3. Cache → Espera 5 minutos y refresca con Ctrl+F5

**Cómo verificar el handle:**
1. Ve a Content → Metaobjects
2. Selecciona el tipo de metaobject
3. Haz click en la entrada
4. Verifica que el "Handle" sea exactamente como se indica arriba

---

### ❌ "Los botones del Hero van al mismo lugar"

**Solución:**
1. Ve a Content → Metaobjects → Home Hero → home-hero
2. Verifica que los campos `primary_button_url` y `secondary_button_url` existan
3. Si no existen, ve a Settings → Custom data → Metaobjects → Home Hero
4. Edita la definición y agrega los dos campos nuevos:
   - `primary_button_url` - Single line text
   - `secondary_button_url` - Single line text
5. Guarda la definición
6. Regresa a la entrada `home-hero` y llena las URLs

---

### ❌ "Las imágenes se ven pixeladas"

**Solución:**
- Usa imágenes de al menos 1920px de ancho para hero/slides
- Usa formato WEBP o JPG optimizado
- Máximo 500KB de peso por imagen

---

### ❌ "Cambios no se reflejan en el sitio"

**Solución:**
1. Espera 1-5 minutos (cache de Vercel)
2. Refresca con Ctrl+F5 (forzar recarga)
3. Si persiste, contacta al desarrollador

---

## 📊 RESUMEN DE CAMPOS ACTUALIZADOS

### Cambios Recientes (Diciembre 2024)

Se agregaron 2 campos nuevos a **Home Hero**:

1. **primary_button_url** → URL del botón primario
2. **secondary_button_url** → URL del botón secundario

**Importante:** Si tu Home Hero ya estaba configurado ANTES de este cambio, necesitas:
1. Agregar los 2 campos nuevos a la definición
2. Llenar las URLs en la entrada `home-hero`

---

## 🎓 CAMPOS CLAVE (Key) - RESUMEN

**IMPORTANTE:** Los "keys" deben ser exactamente como se indican aquí.

### Home Hero
```
title
description
background_image  ⭐ (NO "image")
primary_button_text
primary_button_url  ⭐ NUEVO
secondary_button_text
secondary_button_url  ⭐ NUEVO
```

### Home Slide
```
image
tag
title
subtitle
button_text
href
```

### Home Brand Section
```
title
description
quote
image_1
image_2
```

### Home Newsletter
```
title
description
```

### Home Announcement
```
text
enabled
```

---

## 📞 SOPORTE

Si necesitas ayuda técnica, contacta al desarrollador con:
- ✅ Captura de pantalla del problema
- ✅ Descripción de lo que intentaste hacer
- ✅ Handle y tipo de metaobject que estás configurando
- ✅ Error específico que ves (si hay alguno)

---

## ✨ SIGUIENTE PASO

Una vez completado todo el checklist:
- Todos los checkboxes deben estar marcados ✅
- El sitio debe mostrar todo el contenido correctamente
- Los cambios que hagas en Shopify deben reflejarse en el sitio (1-5 min)

---

**Última actualización**: Diciembre 10, 2025
**Versión**: 2.0 (con URLs dinámicas para botones)

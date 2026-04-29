# 🔍 Guía de Inspección de Metaobjects - Juan Becerra

## 📍 Cómo Acceder a Metaobjects en Shopify

### Opción 1: Verificar Definiciones
```
Shopify Admin → Settings (⚙️) → Custom data → Metaobjects
```

### Opción 2: Verificar Contenido
```
Shopify Admin → Content → Metaobjects
```

---

## 🎯 INSPECCIÓN RÁPIDA (5 minutos)

### ✅ 1. Verificar que existen las 5 definiciones

Ve a: **Settings → Custom data → Metaobjects**

Debes ver exactamente estas 5 definiciones:

| # | Nombre | Type | One entry |
|---|--------|------|-----------|
| 1 | Home Hero | `home_hero` | ✅ Yes |
| 2 | Home Slide | `home_slide` | ❌ No |
| 3 | Home Brand Section | `home_brand_section` | ✅ Yes |
| 4 | Home Newsletter | `home_newsletter` | ✅ Yes |
| 5 | Home Announcement | `home_announcement` | ✅ Yes |

**Si falta alguna**: Necesitas crearla siguiendo METAOBJECTS_GUIDE.md

---

### ✅ 2. Verificar Campos de Home Hero (IMPORTANTE)

Haz click en **Home Hero** en la lista de definiciones.

Verifica que tenga estos 7 campos:

```
✅ title (Single line text)
✅ description (Multi-line text)
✅ background_image (File) ⭐ Nota: NO debe ser "image", debe ser "background_image"
✅ primary_button_text (Single line text)
✅ primary_button_url (Single line text) ⭐ NUEVO - Si no existe, agrégalo
✅ secondary_button_text (Single line text)
✅ secondary_button_url (Single line text) ⭐ NUEVO - Si no existe, agrégalo
```

**Si faltan los campos de URL:**

1. Click en **Home Hero** (la definición)
2. Click en **Add field**
3. Agrega cada campo faltante:
   - **Name**: "URL del Botón Primario"
   - **Type**: Single line text
   - **Key**: `primary_button_url`
   - Save

4. Repite para el segundo:
   - **Name**: "URL del Botón Secundario"
   - **Type**: Single line text
   - **Key**: `secondary_button_url`
   - Save

---

### ✅ 3. Verificar que existe el contenido

Ve a: **Content → Metaobjects**

Debes ver al menos estas 6 entradas (pueden haber más slides):

**Home Hero:**
- [ ] 1 entrada con handle: `home-hero`

**Home Slide:**
- [ ] Al menos 1 entrada (puede ser `slide-1`, `slide-2`, etc.)

**Home Brand Section:**
- [ ] 1 entrada con handle: `brand-philosophy`

**Home Newsletter:**
- [ ] 1 entrada con handle: `newsletter`

**Home Announcement:**
- [ ] 1 entrada con handle: `announcement`

---

## 🔎 INSPECCIÓN DETALLADA (15 minutos)

### 📝 Revisar: Home Hero (home-hero)

Ve a: **Content → Metaobjects → Home Hero → home-hero**

Verifica:
```
✅ Título: [debe tener texto]
✅ Descripción: [debe tener texto]
✅ Imagen de fondo: [debe mostrar preview de imagen]
✅ Texto Botón Primario: [ej: "Explorar Productos"]
✅ URL Botón Primario: [ej: "/search/nuevos-productos"]  ⭐ NUEVO
✅ Texto Botón Secundario: [ej: "Ver Descuentos"]
✅ URL Botón Secundario: [ej: "/search/ofertas"]  ⭐ NUEVO
```

**Importante**: Las URLs deben empezar con `/` (slash)

**URLs válidas de ejemplo:**
- `/search/todos`
- `/search/nuevos-productos`
- `/search/ofertas`
- `/search/accesorios`
- `/search/hombres`
- `/search/mujeres`

**URLs inválidas (NO usar):**
- `search/todos` ❌ (falta el /)
- `https://...` ❌ (no uses URL completa)
- `www...` ❌ (no uses URL externa)

---

### 📝 Revisar: Home Slides

Ve a: **Content → Metaobjects → Home Slide**

Para cada slide que tengas (mínimo 1):

```
✅ Handle: slide-1, slide-2, etc. (único para cada uno)
✅ Imagen: [debe mostrar preview]
✅ Tag: [texto corto, ej: "Nueva Temporada"]
✅ Título: [texto principal del slide]
✅ Subtítulo: [descripción]
✅ Texto del Botón: [ej: "Ver la Colección"]
✅ Enlace (href): [ej: "/search" o "/search/accesorios"]
```

**Cuántos slides necesito?**
- Mínimo: 1
- Recomendado: 2-3
- Máximo: No hay límite, pero 5-6 es óptimo

---

### 📝 Revisar: Brand Philosophy (brand-philosophy)

Ve a: **Content → Metaobjects → Home Brand Section → brand-philosophy**

```
✅ Título: [texto]
✅ Descripción: [texto largo]
✅ Cita: [frase inspiradora]
✅ Imagen 1: [debe mostrar preview]
✅ Imagen 2: [debe mostrar preview]
```

---

### 📝 Revisar: Newsletter (newsletter)

Ve a: **Content → Metaobjects → Home Newsletter → newsletter**

```
✅ Título: [ej: "Suscríbete a nuestro Newsletter"]
✅ Descripción: [llamado a la acción]
```

---

### 📝 Revisar: Announcement (announcement)

Ve a: **Content → Metaobjects → Home Announcement → announcement**

```
✅ Texto: [ej: "ENVÍO GRATIS DESDE $150.000 COP"]
✅ Habilitado: "true" o "false"
```

**Opciones del campo Habilitado:**
- `true` → La barra de anuncio SE MUESTRA
- `false` → La barra de anuncio NO se muestra

---

## 🧪 PROBAR EN EL SITIO

Después de verificar todo en Shopify Admin, abre tu sitio web:

### 1. Probar Hero Section
- [ ] Abre: `https://tu-sitio.com` (o el dominio de Vercel)
- [ ] Verifica que el título y descripción coincidan con Shopify
- [ ] Verifica que la imagen de fondo sea la correcta
- [ ] **Click en el Botón Primario** → Debe ir a la URL que configuraste ⭐
- [ ] **Click en el Botón Secundario** → Debe ir a la URL que configuraste ⭐

### 2. Probar Slides
- [ ] Los slides aparecen
- [ ] Puedes navegar entre ellos (flechas o dots)
- [ ] Las imágenes se ven bien
- [ ] Click en botones lleva a las URLs correctas

### 3. Probar Brand Philosophy
- [ ] Sección aparece más abajo en el home
- [ ] Título y descripción coinciden
- [ ] Ambas imágenes cargan

### 4. Probar Newsletter
- [ ] Sección de newsletter aparece
- [ ] Texto es correcto
- [ ] Formulario está presente

### 5. Probar Announcement
- [ ] Si está en "true", aparece arriba de todo
- [ ] Si está en "false", NO aparece
- [ ] Texto es el correcto

---

## 🚨 PROBLEMAS COMUNES Y SOLUCIONES

### Problema 1: "No veo los campos de URL en Home Hero"

**Causa**: Los campos fueron agregados recientemente y tu definición no los tiene.

**Solución**:
1. Ve a Settings → Custom data → Metaobjects
2. Click en "Home Hero"
3. Click en "Add field"
4. Agrega `primary_button_url` (Single line text)
5. Agrega `secondary_button_url` (Single line text)
6. Save
7. Ve a Content → Metaobjects → Home Hero → home-hero
8. Llena las nuevas URLs
9. Save

---

### Problema 2: "Los botones me llevan a /search/todos siempre"

**Causa**: Las URLs no están configuradas en el metaobject.

**Solución**:
1. Ve a Content → Metaobjects → Home Hero → home-hero
2. Busca los campos de URL (si no existen, ver Problema 1)
3. Llena con las URLs deseadas
4. Save
5. Espera 2-5 minutos
6. Refresca el sitio con Ctrl+F5

---

### Problema 3: "El handle está incorrecto"

**Causa**: Usaste un handle diferente al requerido.

**Solución**:
No puedes cambiar el handle después de creado. Tienes 2 opciones:

**Opción A (más fácil):**
1. Crea una nueva entrada con el handle correcto
2. Copia el contenido de la entrada incorrecta
3. Elimina la entrada incorrecta

**Opción B:**
1. El código puede funcionar con cualquier handle si lo modificas
2. Contacta al desarrollador para ajustar el código

---

### Problema 4: "No veo cambios en el sitio"

**Pasos a seguir:**

1. **Espera 2-5 minutos** (Vercel tiene cache)
2. **Refresca con Ctrl+F5** (fuerza recarga)
3. **Abre en incógnito** para descartar cache del navegador
4. **Verifica en Shopify** que guardaste los cambios (botón Save)
5. Si aún no funciona, espera 15 minutos más
6. Si después de 15 min no aparece, hay un problema técnico

---

## 📊 CHECKLIST FINAL

Marca cuando hayas completado:

- [ ] Las 5 definiciones existen en Settings → Custom data
- [ ] Home Hero tiene los 7 campos (incluyendo las 2 URLs nuevas)
- [ ] Las 6 entradas de contenido existen con handles correctos
- [ ] Todos los campos obligatorios están llenos
- [ ] Las imágenes cargan y se ven bien
- [ ] Las URLs de los botones están configuradas y funcionan
- [ ] El announcement se activa/desactiva correctamente
- [ ] Los slides se muestran y navegan correctamente
- [ ] Hice cambios de prueba y se reflejaron en el sitio

---

## 🎯 RESUMEN DE HANDLES REQUERIDOS

Copia y pega estos handles EXACTAMENTE:

```
home-hero
slide-1
brand-philosophy
newsletter
announcement
```

Para slides adicionales:
```
slide-2
slide-3
slide-4
etc.
```

---

## 📱 CONTACTO

¿Necesitas ayuda? Envía al desarrollador:

1. Captura de pantalla de la definición problemática
2. Captura de pantalla de la entrada de contenido
3. Descripción de qué no funciona
4. URL del sitio donde se ve el problema

---

**Creado**: Diciembre 10, 2025
**Versión**: 2.0 (con URLs dinámicas)
**Archivo**: METAOBJECTS_INSPECTION_GUIDE.md

# Tutorial Completo: Configurar Metaobjects en Shopify

## 📌 Introducción

Esta guía te enseñará paso a paso cómo configurar los Metaobjects en Shopify para que puedas editar el contenido de la página de inicio de Juan Becerra sin necesidad de programar.

---

## 🎯 Parte 1: Crear las Definiciones de Metaobjects

Las "definiciones" son como plantillas que definen qué tipo de contenido puedes editar.

### Paso 1.1: Acceder a la configuración de Metaobjects

1. Inicia sesión en tu **Shopify Admin** (tutienda.myshopify.com/admin)
2. En el menú lateral izquierdo, haz clic en **Settings** (⚙️ Configuración) - está al final del menú
3. En la página de Settings, busca la sección **Custom data** y haz clic
4. Verás varias opciones, haz clic en **Metaobjects**

### Paso 1.2: Crear la primera definición (Hero Section)

1. Haz clic en el botón azul **Add definition**

2. Completa el formulario de la definición:
   - **Name**: Escribe `Home Hero` (este es el nombre que verás en el admin)
   - **Type**: Se generará automáticamente como `home_hero` (NO lo cambies)
   - **Description** (opcional): "Contenido de la sección principal del home"

3. **IMPORTANTE**: Activa la opción **One entry per store**
   - Esto significa que solo podrás crear UNA entrada de este tipo
   - Es perfecta para contenido único como el hero principal

4. En la sección **Fields** (Campos), haz clic en **Add field**

5. Agrega el primer campo:
   - **Name**: `Título`
   - **Type**: Selecciona `Single line text`
   - **Key**: Se genera automáticamente como `title` - ✅ déjalo así
   - Haz clic en **Add**

6. Repite el proceso para agregar los siguientes campos:

   **Campo 2:**
   - Name: `Descripción`
   - Type: `Multi-line text`
   - Key: `description` ✅

   **Campo 3:**
   - Name: `Imagen`
   - Type: `File` → Selecciona `Image`
   - Key: `image` ✅

   **Campo 4:**
   - Name: `Texto Botón 1`
   - Type: `Single line text`
   - Key: `button_text` ✅

   **Campo 5:**
   - Name: `Texto Botón 2`
   - Type: `Single line text`
   - Key: `button_text_2` ✅

7. Haz clic en **Save** (arriba a la derecha)

✅ **¡Primera definición creada!**

---

### Paso 1.3: Crear segunda definición (Home Slide)

Esta definición es para los slides del banner que rota.

1. Regresa a **Settings** → **Custom data** → **Metaobjects**
2. Haz clic en **Add definition**

3. Completa:
   - **Name**: `Home Slide`
   - **Type**: `home_slide` (automático)
   - **Description**: "Slides del banner estacional"
   - **One entry per store**: ❌ NO actives esta opción (queremos poder crear varios slides)

4. Agrega estos campos (con **Add field**):

   **Campo 1:**
   - Name: `Imagen`
   - Type: `File` → `Image`
   - Key: `image` ✅

   **Campo 2:**
   - Name: `Tag`
   - Type: `Single line text`
   - Key: `tag` ✅

   **Campo 3:**
   - Name: `Título`
   - Type: `Single line text`
   - Key: `title` ✅

   **Campo 4:**
   - Name: `Subtítulo`
   - Type: `Multi-line text`
   - Key: `subtitle` ✅

   **Campo 5:**
   - Name: `Texto del Botón`
   - Type: `Single line text`
   - Key: `button_text` ✅

   **Campo 6:**
   - Name: `Enlace`
   - Type: `Single line text`
   - Key: `href` ✅

5. **Save**

✅ **Segunda definición creada!**

---

### Paso 1.4: Crear tercera definición (Brand Section)

1. **Add definition** nuevamente
2. Completa:
   - Name: `Home Brand Section`
   - Type: `home_brand_section` (automático)
   - Description: "Sección de filosofía de marca"
   - One entry per store: ✅ ACTIVAR

3. Campos:

   **Campo 1:**
   - Name: `Título`
   - Type: `Single line text`
   - Key: `title` ✅

   **Campo 2:**
   - Name: `Descripción`
   - Type: `Multi-line text`
   - Key: `description` ✅

   **Campo 3:**
   - Name: `Cita`
   - Type: `Multi-line text`
   - Key: `quote` ✅

   **Campo 4:**
   - Name: `Imagen 1`
   - Type: `File` → `Image`
   - Key: `image_1` ✅

   **Campo 5:**
   - Name: `Imagen 2`
   - Type: `File` → `Image`
   - Key: `image_2` ✅

4. **Save**

✅ **Tercera definición creada!**

---

### Paso 1.5: Crear cuarta definición (Newsletter)

1. **Add definition**
2. Completa:
   - Name: `Home Newsletter`
   - Type: `home_newsletter`
   - One entry per store: ✅ ACTIVAR

3. Campos:

   **Campo 1:**
   - Name: `Título`
   - Type: `Single line text`
   - Key: `title` ✅

   **Campo 2:**
   - Name: `Descripción`
   - Type: `Multi-line text`
   - Key: `description` ✅

4. **Save**

✅ **Cuarta definición creada!**

---

### Paso 1.6: Crear quinta definición (Announcement)

1. **Add definition**
2. Completa:
   - Name: `Home Announcement`
   - Type: `home_announcement`
   - One entry per store: ✅ ACTIVAR

3. Campos:

   **Campo 1:**
   - Name: `Texto`
   - Type: `Single line text`
   - Key: `text` ✅

   **Campo 2:**
   - Name: `Habilitado`
   - Type: `Single line text`
   - Key: `enabled` ✅
   - Description: "Escribe 'true' para activar o 'false' para desactivar"

4. **Save**

✅ **¡Todas las definiciones creadas!**

---

## 🎨 Parte 2: Crear las Entradas de Contenido

Ahora que tienes las "plantillas" (definiciones), vamos a crear el contenido real.

### Paso 2.1: Crear entrada del Hero Section

1. En el menú lateral de Shopify, ve a **Content** → **Metaobjects**
   - Nota: Ya no estamos en Settings, ahora estamos en Content

2. Verás una lista de tipos de metaobjects que creaste. Haz clic en **Home Hero**

3. Haz clic en **Add entry**

4. **MUY IMPORTANTE**: En el campo **Handle**, escribe exactamente: `home-hero`
   - ⚠️ El handle debe ser exactamente `home-hero` (con guión, todo en minúsculas)
   - Este es el identificador que el sitio web buscará

5. Completa los campos:

   ```
   Título: Nueva Colección

   Descripción: Descubre las últimas tendencias en moda premium. Elegancia y sofisticación en cada pieza.

   Imagen: Haz clic en "Add file" → Arrastra tu imagen o búscala

   Texto Botón 1: Explorar Colección

   Texto Botón 2: Ver Lookbook
   ```

6. **Save**

✅ **Hero configurado!**

---

### Paso 2.2: Crear los Slides (2 slides)

#### Slide 1:

1. Ve a **Content** → **Metaobjects** → **Home Slide**
2. **Add entry**
3. **Handle**: `slide-1` ⚠️ Exactamente así
4. Completa:

   ```
   Imagen: Sube tu imagen de sacos o productos

   Tag: Nueva Temporada

   Título: Colección Otoño/Invierno 2025

   Subtítulo: Descubre las piezas que definirán tu estilo esta temporada.

   Texto del Botón: Ver la Colección

   Enlace: /search
   ```

5. **Save**

#### Slide 2:

1. En la misma página de Home Slide, haz clic en **Add entry** nuevamente
2. **Handle**: `slide-2`
3. Completa:

   ```
   Imagen: Sube imagen de cinturones o accesorios

   Tag: Accesorios Premium

   Título: Accesorios que Dejan Huella

   Subtítulo: Eleva tu look con nuestros cinturones y billeteras de cuero genuino.

   Texto del Botón: Explorar Accesorios

   Enlace: /search/accesorios
   ```

4. **Save**

✅ **Slides configurados! (puedes agregar más después)**

---

### Paso 2.3: Configurar Brand Section

1. **Content** → **Metaobjects** → **Home Brand Section**
2. **Add entry**
3. **Handle**: `brand-philosophy` ⚠️
4. Completa:

   ```
   Título: Artesanía que trasciende

   Descripción: En Juan Becerra, creemos que la verdadera elegancia no grita, susurra. Cada pieza es cuidadosamente seleccionada para el hombre que entiende que el estilo no es una tendencia, es una filosofía de vida. Desde 2017, hemos dedicado nuestra pasión a ofrecer accesorios premium que definen carácter y distinción en cada detalle.

   Cita: La moda pasa, el estilo permanece

   Imagen 1: Sube imagen de cinturones

   Imagen 2: Sube imagen de tarjeteros o billeteras
   ```

5. **Save**

✅ **Brand section configurada!**

---

### Paso 2.4: Configurar Newsletter

1. **Content** → **Metaobjects** → **Home Newsletter**
2. **Add entry**
3. **Handle**: `newsletter` ⚠️
4. Completa:

   ```
   Título: Suscríbete a nuestro Newsletter

   Descripción: Recibe las últimas noticias, colecciones y ofertas especiales directamente en tu bandeja de entrada.
   ```

5. **Save**

✅ **Newsletter configurado!**

---

### Paso 2.5: Configurar Announcement Bar

1. **Content** → **Metaobjects** → **Home Announcement**
2. **Add entry**
3. **Handle**: `announcement` ⚠️
4. Completa:

   ```
   Texto: ENVÍO GRATIS DESDE $150.000 COP

   Habilitado: true
   ```

   💡 **Nota**: Para desactivar el anuncio en el futuro, solo cambia `true` por `false`

5. **Save**

✅ **Announcement configurado!**

---

## 🎉 Parte 3: Verificar que Todo Está Correcto

### Checklist Final:

Ve a **Content** → **Metaobjects** y verifica que tienes:

- ✅ **Home Hero** → 1 entrada con handle `home-hero`
- ✅ **Home Slide** → 2 entradas con handles `slide-1` y `slide-2`
- ✅ **Home Brand Section** → 1 entrada con handle `brand-philosophy`
- ✅ **Home Newsletter** → 1 entrada con handle `newsletter`
- ✅ **Home Announcement** → 1 entrada con handle `announcement`

### Tabla de Handles Importantes:

| Tipo de Metaobject | Handle EXACTO |
|-------------------|---------------|
| Home Hero | `home-hero` |
| Home Slide 1 | `slide-1` |
| Home Slide 2 | `slide-2` |
| Brand Section | `brand-philosophy` |
| Newsletter | `newsletter` |
| Announcement | `announcement` |

---

## 🔄 Cómo Editar Contenido en el Futuro

1. Ve a **Content** → **Metaobjects**
2. Selecciona el tipo que quieres editar (ej: Home Hero)
3. Haz clic en la entrada correspondiente
4. Modifica los campos que necesites
5. **Save**
6. ¡Los cambios aparecerán en el sitio web!

---

## 📝 Tips y Mejores Prácticas

### Para Imágenes:

- **Hero y Slides**: Usa imágenes de al menos 1920x1080px
- **Brand Section**: Imágenes de 800x1000px mínimo
- **Formato**: JPG para fotos, PNG para logos, WEBP para mejor rendimiento
- **Peso**: Trata de que no pasen de 500KB cada una

### Para Textos:

- **Títulos**: Cortos y impactantes (máximo 50 caracteres)
- **Descripciones**: Claras y concisas (2-3 líneas)
- **Botones**: Verbos de acción (Explorar, Ver, Descubrir)

### Agregar Más Slides:

1. Ve a **Content** → **Metaobjects** → **Home Slide**
2. **Add entry**
3. Dale un handle único: `slide-3`, `slide-4`, etc.
4. Llena los campos
5. **Save**

El sitio mostrará automáticamente todos los slides que crees.

---

## 🚨 Solución de Problemas

### "No veo los cambios en el sitio"

- Espera 5 minutos (puede haber caché)
- Refresca la página con Ctrl+F5 (Windows) o Cmd+Shift+R (Mac)
- Verifica que guardaste los cambios con el botón Save
- Contacta al desarrollador para limpiar el caché

### "El contenido aparece en blanco"

- Verifica que el **handle** sea exactamente como se indica
- Asegúrate de haber llenado todos los campos
- Revisa que las imágenes se hayan subido correctamente

### "No encuentro la opción Metaobjects"

- Asegúrate de estar en **Settings** → **Custom data** → **Metaobjects**
- Tu plan de Shopify debe soportar metaobjects (la mayoría lo hacen)
- Contacta al soporte de Shopify si no aparece

### "Me dice que el handle ya existe"

- Cada handle debe ser único
- Si estás editando una entrada existente, no cambies el handle
- Si estás creando una nueva, usa un nombre diferente

---

## 📞 Soporte

Si tienes dudas o problemas:

1. Revisa esta guía nuevamente
2. Verifica los handles en la tabla de referencia
3. Contacta al desarrollador con capturas de pantalla del problema

---

## 📚 Resumen Rápido

1. **Settings** → **Custom data** → **Metaobjects** → Crear 5 definiciones
2. **Content** → **Metaobjects** → Crear entradas para cada definición
3. Usar los handles exactos de la tabla
4. Subir imágenes de buena calidad
5. Guardar y esperar unos minutos

---

**Fecha de creación**: 25 de Noviembre 2025
**Versión**: 1.0
**Autor**: Claude Code para Juan Becerra

¡Disfruta editando el contenido de tu sitio sin necesidad de programar! 🎨

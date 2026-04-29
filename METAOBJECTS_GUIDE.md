# Guía de Metaobjects - Juan Becerra

Esta guía explica cómo configurar los Metaobjects en Shopify para editar el contenido de la página de inicio sin necesidad de modificar código.

## ¿Qué son los Metaobjects?

Los Metaobjects son estructuras de datos personalizadas en Shopify que te permiten almacenar y gestionar contenido desde el admin de Shopify. Es como tener un CMS integrado.

## Paso 1: Acceder a Metaobjects en Shopify Admin

1. Inicia sesión en tu Shopify Admin
2. Ve a **Settings** (Configuración) → **Custom data** (Datos personalizados)
3. Haz clic en **Metaobjects**

## Paso 2: Crear las Definiciones de Metaobjects

Necesitas crear las siguientes definiciones de metaobjects. Para cada una, haz clic en **Add definition** y configura según se indica:

### 1. Hero Section (Sección Principal)

**Configuración:**
- **Name**: `Home Hero`
- **Type**: `home_hero`
- **Single entry**: ✅ Activado (solo puede haber uno)

**Campos a agregar:**

| Nombre del campo | Tipo | Key | Descripción |
|-----------------|------|-----|-------------|
| Título | Single line text | `title` | Ej: "Nueva Colección" |
| Descripción | Multi-line text | `description` | Texto descriptivo |
| Imagen de fondo | File | `background_image` | Imagen de fondo del hero |
| Texto Botón Primario | Single line text | `primary_button_text` | Ej: "Explorar Colección" |
| URL Botón Primario | Single line text | `primary_button_url` | Ej: "/search/nuevos-productos" |
| Texto Botón Secundario | Single line text | `secondary_button_text` | Ej: "Ver Lookbook" |
| URL Botón Secundario | Single line text | `secondary_button_url` | Ej: "/search/lookbook" |

### 2. Slides del Banner Estacional

**Configuración:**
- **Name**: `Home Slide`
- **Type**: `home_slide`
- **Single entry**: ❌ Desactivado (pueden ser varios)

**Campos a agregar:**

| Nombre del campo | Tipo | Key | Descripción |
|-----------------|------|-----|-------------|
| Imagen | File | `image` | Imagen del slide |
| Tag | Single line text | `tag` | Ej: "Nueva Temporada" |
| Título | Single line text | `title` | Título del slide |
| Subtítulo | Multi-line text | `subtitle` | Descripción |
| Texto del Botón | Single line text | `button_text` | Ej: "Ver la Colección" |
| Enlace | Single line text | `href` | Ej: "/search" |

### 3. Sección de Filosofía de Marca

**Configuración:**
- **Name**: `Home Brand Section`
- **Type**: `home_brand_section`
- **Single entry**: ✅ Activado

**Campos a agregar:**

| Nombre del campo | Tipo | Key | Descripción |
|-----------------|------|-----|-------------|
| Título | Single line text | `title` | Ej: "Artesanía que trasciende" |
| Descripción | Multi-line text | `description` | Texto descriptivo |
| Cita | Multi-line text | `quote` | Frase inspiradora |
| Imagen 1 | File | `image_1` | Primera imagen de la sección |
| Imagen 2 | File | `image_2` | Segunda imagen de la sección |

### 4. Newsletter

**Configuración:**
- **Name**: `Home Newsletter`
- **Type**: `home_newsletter`
- **Single entry**: ✅ Activado

**Campos a agregar:**

| Nombre del campo | Tipo | Key | Descripción |
|-----------------|------|-----|-------------|
| Título | Single line text | `title` | Ej: "Suscríbete a nuestro Newsletter" |
| Descripción | Multi-line text | `description` | Texto descriptivo |

### 5. Barra de Anuncio

**Configuración:**
- **Name**: `Home Announcement`
- **Type**: `home_announcement`
- **Single entry**: ✅ Activado

**Campos a agregar:**

| Nombre del campo | Tipo | Key | Descripción |
|-----------------|------|-----|-------------|
| Texto | Single line text | `text` | Ej: "ENVÍO GRATIS DESDE $150.000 COP" |
| Habilitado | Single line text | `enabled` | Escribe "true" o "false" |

## Paso 3: Crear las Entradas de Contenido

Una vez creadas las definiciones, necesitas crear las entradas de contenido:

### Para entries únicas (Hero, Brand Section, Newsletter, Announcement):

1. Ve a **Content** (Contenido) → **Metaobjects**
2. Selecciona el tipo de metaobject (ej: "Home Hero")
3. Haz clic en **Add entry**
4. Asigna un **handle** único (esto es importante):
   - Home Hero: `home-hero`
   - Brand Section: `brand-philosophy`
   - Newsletter: `newsletter`
   - Announcement: `announcement`
5. Llena todos los campos con el contenido deseado
6. Para campos de imagen, usa el selector de archivos de Shopify
7. Guarda la entrada

### Para entries múltiples (Slides):

1. Ve a **Content** → **Metaobjects**
2. Selecciona "Home Slide"
3. Haz clic en **Add entry** por cada slide que quieras crear
4. Para cada slide:
   - Asigna un handle descriptivo (ej: `slide-1`, `slide-2`, etc.)
   - Llena todos los campos
   - Guarda

## Paso 4: Contenido Inicial Recomendado

### Home Hero (handle: `home-hero`)
```
Título: Nueva Colección
Descripción: Descubre las últimas tendencias en moda premium. Elegancia y sofisticación en cada pieza.
Imagen de fondo: (Sube /banner-home-juan-becerra.jpg)
Texto Botón Primario: Explorar Colección
URL Botón Primario: /search/nuevos-productos
Texto Botón Secundario: Ver Lookbook
URL Botón Secundario: /search/lookbook
```

### Home Slide 1 (handle: `slide-1`)
```
Imagen: (Sube /sacos.webp)
Tag: Nueva Temporada
Título: Colección Otoño/Invierno 2025
Subtítulo: Descubre las piezas que definirán tu estilo esta temporada.
Texto del Botón: Ver la Colección
Enlace: /search
```

### Home Slide 2 (handle: `slide-2`)
```
Imagen: (Sube /cinturones.webp)
Tag: Accesorios Premium
Título: Accesorios que Dejan Huella
Subtítulo: Eleva tu look con nuestros cinturones y billeteras de cuero genuino.
Texto del Botón: Explorar Accesorios
Enlace: /search/accesorios
```

### Brand Section (handle: `brand-philosophy`)
```
Título: Artesanía que trasciende
Descripción: En Juan Becerra, creemos que la verdadera elegancia no grita, susurra. Cada pieza es cuidadosamente seleccionada para el hombre que entiende que el estilo no es una tendencia, es una filosofía de vida.
Cita: La moda pasa, el estilo permanece
Imagen 1: (Sube /cinturones.webp)
Imagen 2: (Sube /tarjeteros.webp)
```

### Newsletter (handle: `newsletter`)
```
Título: Suscríbete a nuestro Newsletter
Descripción: Recibe las últimas noticias, colecciones y ofertas especiales directamente en tu bandeja de entrada.
```

### Announcement (handle: `announcement`)
```
Texto: ENVÍO GRATIS DESDE $150.000 COP
Habilitado: true
```

## Cómo Editar el Contenido

Una vez configurado, para editar el contenido:

1. Ve a **Content** → **Metaobjects**
2. Selecciona el tipo de contenido que quieres editar
3. Haz clic en la entrada correspondiente
4. Modifica los campos que necesites
5. Guarda los cambios
6. Los cambios aparecerán en el sitio web automáticamente

## Notas Importantes

- **Handles**: Los handles deben ser exactamente como se indican, de lo contrario el sitio no encontrará el contenido
- **Imágenes**: Usa imágenes de alta calidad (mínimo 1920px de ancho para fondos)
- **Caché**: Los cambios pueden tardar hasta 24 horas en reflejarse debido al caché. Para forzar actualización, contacta al desarrollador
- **Respaldo**: Siempre guarda el texto antes de modificarlo por si necesitas revertir cambios

## Solución de Problemas

### El contenido no se muestra en el sitio
- Verifica que el handle sea exactamente como se indica en esta guía
- Asegúrate de que todos los campos requeridos estén llenos
- Contacta al desarrollador para limpiar el caché

### Las imágenes no se muestran
- Verifica que hayas seleccionado un archivo de imagen
- Las imágenes deben ser JPG, PNG o WEBP
- Tamaño máximo recomendado: 5MB

### Necesito agregar más slides
- Simplemente crea una nueva entrada de "Home Slide"
- Asegúrate de darle un handle único
- Llena todos los campos y guarda

## Próximos Pasos

Después de configurar los metaobjects, el sitio automáticamente usará este contenido. Si tienes dudas o necesitas ayuda, contacta al desarrollador.

---

**Creado:** 25 de Noviembre 2025
**Última actualización:** 25 de Noviembre 2025

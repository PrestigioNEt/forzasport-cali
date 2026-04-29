# 🔄 Guía de Actualización de Metaobjects

## ⚡ ACTUALIZACIÓN RÁPIDA (Solo para usuarios existentes)

Si YA tienes los metaobjects configurados pero los botones del Hero llevan siempre a `/search/todos`, sigue esta guía para actualizar.

---

## 🎯 QUÉ CAMBIÓ

### Antes (versión 1.0):
```
- Los botones del Hero tenían URLs hardcodeadas
- Ambos botones iban siempre a /search/todos
- No se podían cambiar desde Shopify Admin
```

### Ahora (versión 2.0):
```
✅ Cada botón tiene su propia URL configurable
✅ Las URLs se editan desde Shopify Admin
✅ No necesitas código para cambiar a dónde van los botones
```

---

## 📋 PASO 1: Agregar Campos a la Definición (2 minutos)

### 1. Accede a la definición de Home Hero

```
Shopify Admin → Settings → Custom data → Metaobjects → Home Hero
```

### 2. Agrega el primer campo

Click en **"Add field"** y llena:

```
Field name: URL del Botón Primario
Field type: Single line text
Field key: primary_button_url
```

Click **Save**

### 3. Agrega el segundo campo

Click en **"Add field"** nuevamente y llena:

```
Field name: URL del Botón Secundario
Field type: Single line text
Field key: secondary_button_url
```

Click **Save**

### 4. Verifica

Ahora tu definición de Home Hero debe tener **7 campos** en total:

```
1. title
2. description
3. background_image (o image)
4. primary_button_text
5. primary_button_url  ⭐ NUEVO
6. secondary_button_text
7. secondary_button_url  ⭐ NUEVO
```

---

## 📝 PASO 2: Configurar las URLs (1 minuto)

### 1. Accede a tu entrada de contenido

```
Shopify Admin → Content → Metaobjects → Home Hero → home-hero
```

### 2. Busca los nuevos campos

Deberías ver ahora dos campos nuevos:
- **URL del Botón Primario**
- **URL del Botón Secundario**

### 3. Llena las URLs

**Ejemplos de URLs válidas:**

Para el **Botón Primario** (ej: "Explorar Productos"):
```
/search/nuevos-productos
/search/todos
/search/destacados
```

Para el **Botón Secundario** (ej: "Ver Ofertas"):
```
/search/ofertas
/search/descuentos
/search/rebajas
```

**IMPORTANTE**:
- ✅ Las URLs deben empezar con `/`
- ✅ Usa el formato `/search/[nombre-coleccion]`
- ❌ NO uses URLs completas como `https://...`
- ❌ NO uses URLs externas

### 4. Guarda

Click en **Save** arriba a la derecha.

---

## 🧪 PASO 3: Probar que Funciona (2 minutos)

### 1. Espera 2-5 minutos
Vercel necesita tiempo para actualizar el caché.

### 2. Abre tu sitio web
```
https://tu-sitio.vercel.app
```

### 3. Prueba los botones

- **Click en el Botón Primario** → Debe llevarte a la URL que configuraste
- **Click en el Botón Secundario** → Debe llevarte a la URL que configuraste

### 4. Si no funciona

- Refresca con **Ctrl+F5** (fuerza recarga sin caché)
- Abre en **modo incógnito** para descartar caché del navegador
- Espera otros 5 minutos más
- Verifica que las URLs en Shopify estén guardadas correctamente

---

## 🎨 IDEAS DE CONFIGURACIÓN

### Configuración 1: Explorar vs Ofertas
```
Botón Primario:
  Texto: "Explorar Productos"
  URL: /search/todos

Botón Secundario:
  Texto: "Ver Ofertas"
  URL: /search/ofertas
```

### Configuración 2: Hombres vs Mujeres
```
Botón Primario:
  Texto: "Colección Hombres"
  URL: /search/hombres

Botón Secundario:
  Texto: "Colección Mujeres"
  URL: /search/mujeres
```

### Configuración 3: Nuevos vs Populares
```
Botón Primario:
  Texto: "Nuevos Productos"
  URL: /search/nuevos-productos

Botón Secundario:
  Texto: "Más Vendidos"
  URL: /search/mas-vendidos
```

### Configuración 4: Por Categoría
```
Botón Primario:
  Texto: "Ver Accesorios"
  URL: /search/accesorios

Botón Secundario:
  Texto: "Ver Billeteras"
  URL: /search/billeteras
```

---

## 📌 NOTAS IMPORTANTES

### Sobre las Colecciones

Las URLs deben coincidir con el **handle** de tus colecciones en Shopify.

**Cómo verificar el handle de una colección:**

1. Ve a **Products → Collections** en Shopify Admin
2. Click en la colección
3. El handle aparece en la URL: `/collections/[ESTE-ES-EL-HANDLE]`
4. Usa ese handle en la URL: `/search/[HANDLE]`

**Ejemplo:**
- Si tu colección es: `https://admin.shopify.com/collections/accesorios-premium`
- El handle es: `accesorios-premium`
- La URL para el botón: `/search/accesorios-premium`

### Sobre /search/todos

- Esta es una página especial que muestra TODOS los productos
- Es útil como opción general
- No necesita una colección en Shopify

---

## 🔧 SOLUCIÓN DE PROBLEMAS

### "No veo los campos nuevos en Content"

**Causa**: No agregaste los campos a la definición primero.

**Solución**:
1. Ve a Settings → Custom data → Metaobjects → Home Hero
2. Agrega los campos (ver PASO 1)
3. Luego regresa a Content → Metaobjects → home-hero

---

### "Los botones no van a ninguna parte / dan error 404"

**Causas posibles:**

1. **La colección no existe**
   - Verifica que la colección exista en Products → Collections
   - Verifica que el handle sea exacto (minúsculas, con guiones)

2. **Olvidaste el / inicial**
   - ✅ Correcto: `/search/ofertas`
   - ❌ Incorrecto: `search/ofertas`

3. **Usaste URL externa**
   - ✅ Correcto: `/search/ofertas`
   - ❌ Incorrecto: `https://tutienda.com/search/ofertas`

---

### "Los cambios no aparecen en el sitio"

**Pasos:**

1. Verifica que guardaste en Shopify (botón Save)
2. Espera 5 minutos
3. Refresca con Ctrl+F5
4. Prueba en modo incógnito
5. Si después de 15 min sigue igual, contacta al desarrollador

---

## ✅ CHECKLIST DE ACTUALIZACIÓN

- [ ] Agregué `primary_button_url` a la definición de Home Hero
- [ ] Agregué `secondary_button_url` a la definición de Home Hero
- [ ] Guardé la definición
- [ ] Fui a la entrada `home-hero` en Content
- [ ] Llené el campo "URL del Botón Primario"
- [ ] Llené el campo "URL del Botón Secundario"
- [ ] Guardé la entrada
- [ ] Esperé 5 minutos
- [ ] Refresqué el sitio con Ctrl+F5
- [ ] Probé el botón primario y funciona
- [ ] Probé el botón secundario y funciona

---

## 🎉 ¡LISTO!

Ahora puedes cambiar las URLs de los botones cuando quieras desde Shopify Admin, sin necesidad de código.

**Beneficios:**
- ✅ Cambios instantáneos desde Admin
- ✅ No necesitas desarrollador para cambiar URLs
- ✅ Puedes probar diferentes configuraciones fácilmente
- ✅ URLs personalizadas según campañas

---

## 📞 SOPORTE

Si tienes problemas con esta actualización:

1. Verifica que seguiste todos los pasos del PASO 1
2. Verifica que el campo "key" sea exactamente: `primary_button_url` y `secondary_button_url`
3. Envía captura de pantalla de la definición al desarrollador
4. Envía captura de la entrada de contenido con las URLs llenas

---

**Fecha de actualización**: Diciembre 10, 2025
**Versión**: 2.0
**Archivo**: METAOBJECTS_UPDATE_GUIDE.md

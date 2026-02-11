# Configuración de Cloudinary

## 📝 Instrucciones de Configuración (5 minutos)

Cloudinary es un servicio de almacenamiento en la nube para imágenes y videos. Ofrece **25GB gratis** y preserva la calidad original de tus archivos.

---

## 🚀 Pasos de Configuración

### 1. Crear Cuenta en Cloudinary

1. Ve a [https://cloudinary.com/users/register_free](https://cloudinary.com/users/register_free)
2. Regístrate con tu email
3. Verifica tu cuenta por email

### 2. Obtener Credenciales

1. Inicia sesión en [https://cloudinary.com/console](https://cloudinary.com/console)
2. En el Dashboard verás:
   - **Cloud Name** (ejemplo: `dxyz123abc`)
   - **API Key** (ejemplo: `123456789012345`)
   - **API Secret** (haz clic en "Show" para verlo)

### 3. Configurar Variables de Entorno

Edita el archivo `server/.env` y descomenta las líneas de Cloudinary:

```env
# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name_aqui
CLOUDINARY_API_KEY=tu_api_key_aqui
CLOUDINARY_API_SECRET=tu_api_secret_aqui
```

**Reemplaza** con tus credenciales reales del paso 2.

### 4. Reiniciar el Servidor

```powershell
# Detén el servidor (Ctrl+C)
# Vuelve a iniciar
.\start_app.bat
```

---

## ✅ Verificación

Si todo está configurado correctamente, al iniciar el servidor verás:

```
✅ Cloudinary service initialized
☁️  Cloud name: tu_cloud_name
```

Al subir una imagen/video, verás:

```
📤 Uploading <archivo> to Cloudinary...
✅ File uploaded successfully: millo/<file-id>
```

---

## 📁 Organización

Todos tus archivos se guardarán en una carpeta llamada `millo/` en Cloudinary.

Puedes verlos en: [https://console.cloudinary.com/console/media_library](https://console.cloudinary.com/console/media_library)

---

## ✨ Características

- ✅ **25GB gratis** (más que suficiente para comenzar)
- ✅ **Calidad original** - no comprime tus archivos
- ✅ **CDN global** - carga rápida desde cualquier parte del mundo
- ✅ **URLs directas** - fácil de compartir
- ✅ **Transformación automática** - optimización inteligente
- ✅ **Backup automático** - no pierdes nada

---

## 🎯 Ventajas vs Google Drive

| Característica | Cloudinary | Google Drive (Service Account) |
|----------------|------------|--------------------------------|
| Configuración | ⭐⭐⭐⭐⭐ Muy fácil | ⭐⭐ Complejo |
| Almacenamiento | 25GB gratis | ❌ No funciona |
| Calidad | ✅ Original | ✅ Original |
| CDN | ✅ Sí | ❌ No |
| URLs | ✅ Directas | ⚠️ Complicadas |

---

## 🐛 Problemas Comunes

### "Cloudinary not configured"
- Verifica que las 3 variables estén en `.env` sin comentar (#)
- Verifica que los valores sean correctos
- Reinicia el servidor

### "Invalid credentials"
- Verifica que el API Secret sea correcto
- Asegúrate de no tener espacios al inicio/final

### "Upload failed"
- Verifica tu conexión a internet
- Verifica que no hayas excedido los 25GB

---

## 💰 Plan Gratuito

El plan gratuito de Cloudinary incluye:
- **25GB de almacenamiento**
- **25GB de ancho de banda mensual**
- **Transformaciones ilimitadas**
- **Sin tarjeta de crédito requerida**

Perfecto para comenzar y escalar cuando lo necesites.

---

## 🔒 Seguridad

- ✅ API Secret está en `.env` (`.gitignore` protege que se suba a GitHub)
- ✅ Los archivos son públicos pero solo con URL directa
- ✅ Nadie puede buscar/encontrar tus archivos sin la URL
- ✅ Puedes restringir dominios si quieres más seguridad

---

## 📝 Modo Fallback

Si Cloudinary **no está configurado**, la aplicación automáticamente usará almacenamiento local en `server/uploads/`.

Los archivos seguirán funcionando, pero estarán en el disco del servidor.

---

¡Listo! Con esto tendrás todas tus fotos y videos en la nube con calidad 100% original. 🎉

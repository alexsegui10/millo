# Configuración de Google Drive

## 📝 Instrucciones de Configuración

Para habilitar Google Drive, necesitas configurar las credenciales de Google Cloud. Sigue estos pasos:

### 1. Crear Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un nuevo proyecto llamado "millo-storage"
3. Selecciona el proyecto

### 2. Habilitar Google Drive API

1. En el menú lateral, ve a **APIs y servicios** > **Biblioteca**
2. Busca "Google Drive API"
3. Haz clic en **Habilitar**

### 3. Crear Service Account

1. Ve a **APIs y servicios** > **Credenciales**
2. Clic en **Crear credenciales** > **Cuenta de servicio**
3. Nombre: `millo-uploader`
4. Descripción: `Service account for uploading files to Drive`
5. Clic en **Crear y continuar**
6. No es necesario asignar roles, clic en **Continuar**
7. Clic en **Listo**

### 4. Generar Clave JSON

1. En la lista de Service Accounts, encuentra `millo-uploader`
2. Clic en los tres puntos > **Administrar claves**
3. Clic en **Agregar clave** > **Crear nueva clave**
4. Selecciona **JSON**
5. Descarga el archivo

### 5. Configurar Credenciales

1. Renombra el archivo descargado a `google-credentials.json`
2. Muévelo a la carpeta `server/`:
   ```
   proyecto/
   └── server/
       ├── google-credentials.json  ← Aquí
       ├── src/
       └── package.json
   ```

### 6. Crear Carpeta en Google Drive

1. Abre [Google Drive](https://drive.google.com)
2. Crea una nueva carpeta llamada "Millo Uploads"
3. Abre la carpeta y copia el **ID de la carpeta** de la URL:
   ```
   https://drive.google.com/drive/folders/1abc...xyz
                                          └─ Este es el ID
   ```

### 7. Compartir Carpeta con Service Account

1. Con la carpeta "Millo Uploads" abierta, clic en **Compartir**
2. En el campo de email, pega el email del Service Account
   - Lo encuentras en `google-credentials.json` en el campo `client_email`
   - Algo como: `millo-uploader@millo-storage.iam.gserviceaccount.com`
3. Dale permisos de **Editor**
4. Clic en **Enviar**

### 8. Configurar Variable de Entorno

Edita el archivo `server/.env` y añade:

```env
GOOGLE_DRIVE_FOLDER_ID=1abc...xyz
```

(Pega el ID de carpeta que copiaste en el paso 6)

### 9. Reiniciar el Servidor

```powershell
# Detén el servidor (Ctrl+C)
# Vuelve a iniciar
.\start_app.bat
```

---

## ✅ Verificación

Si todo está configurado correctamente, al iniciar el servidor verás:

```
✅ Google Drive service initialized
```

Al subir una imagen/video, verás:

```
📤 Uploading <filename> to Google Drive...
✅ File uploaded successfully: <file-id>
```

---

## 🐛 Problemas Comunes

### "Google Drive credentials not found"
- Verifica que `google-credentials.json` esté en `server/`
- Verifica que el nombre del archivo sea exacto

### "Failed to upload to Google Drive"
- Verifica que el `GOOGLE_DRIVE_FOLDER_ID` en `.env` sea correcto
- Verifica que hayas compartido la carpeta con el Service Account
- Verifica que el Service Account tenga permisos de "Editor"

### "Permission denied"
- Asegúrate de haber compartido la carpeta con el email correcto del Service Account
- Verifica que los permisos sean de "Editor", no "Visualizador"

---

## 📝 Modo Fallback

Si Google Drive **no está configurado**, la aplicación automáticamente usará almacenamiento local en `server/uploads/`.

Los archivos seguirán funcionando, pero estarán en el disco del servidor.

---

## 🔒 Seguridad

- ✅ `google-credentials.json` está en `.gitignore` (no se sube a GitHub)
- ✅ Los archivos en Drive son públicos pero solo con URL directa
- ✅ Nadie puede buscar/encontrar los archivos en Drive sin la URL

---

## 📦 Almacenamiento

- **Gratis con cuenta personal:** 15GB compartidos con Gmail y Photos
- **Google Workspace:** Almacenamiento ilimitado (según el plan)
- **Calidad:** Original, sin compresión

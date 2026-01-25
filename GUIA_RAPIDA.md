# Guía Rápida - StoryWorthy App

## ✅ Lo que ya está hecho

Tu app está completamente construida con:
- ✅ Sistema de autenticación (login/registro)
- ✅ Captura diaria de momentos
- ✅ Sistema de rachas
- ✅ Prompts/sugerencias cuando no sabes qué escribir
- ✅ Reporte semanal con estadísticas
- ✅ Botón para compartir en redes sociales
- ✅ Modo oscuro
- ✅ Responsive (funciona en móvil y desktop)

## 🚀 Próximos pasos para verla funcionar

### Paso 1: Instalar Node.js (si no lo tienes)

1. Ve a https://nodejs.org
2. Descarga la versión LTS (la recomendada)
3. Instala siguiendo el asistente
4. Verifica que quedó instalado:
   - Abre la terminal (CMD o PowerShell en Windows)
   - Escribe: `node --version`
   - Deberías ver algo como `v20.x.x`

### Paso 2: Instalar dependencias del proyecto

1. Abre la terminal en la carpeta del proyecto:
   - En Windows: Click derecho en la carpeta `storyworthy-app` → "Abrir en Terminal" o "Open in Windows Terminal"
   - O navega: `cd C:\Users\alexg\storyworthy-app`

2. Ejecuta:
   ```bash
   npm install
   ```

   Esto descargará todas las librerías necesarias. Puede tardar 2-3 minutos.

### Paso 3: Configurar Supabase (tu base de datos)

1. **Crear cuenta gratis en Supabase**:
   - Ve a https://supabase.com
   - Click en "Start your project"
   - Regístrate con tu email o GitHub

2. **Crear un proyecto**:
   - Click en "New Project"
   - Nombre: StoryWorthy (o el que quieras)
   - Database Password: Crea una contraseña SEGURA y guárdala
   - Región: Elige la más cercana (ej: South America)
   - Click "Create new project" (tarda ~2 minutos)

3. **Obtener las credenciales**:
   - Una vez creado el proyecto, ve a Settings (⚙️ abajo a la izquierda)
   - Click en "API"
   - Copia estos 2 valores:
     - **Project URL** (algo como: https://xxxxx.supabase.co)
     - **anon public** key (la clave larga que dice "anon")

4. **Crear archivo .env**:
   - En la carpeta del proyecto, crea un archivo llamado `.env` (sin extensión)
   - Pega esto dentro:
     ```
     VITE_SUPABASE_URL=tu-url-aqui
     VITE_SUPABASE_ANON_KEY=tu-clave-aqui
     ```
   - Reemplaza con tus valores reales

5. **Crear las tablas en la base de datos**:
   - En Supabase, ve a "SQL Editor" en el menú izquierdo
   - Click en "New query"
   - Abre el archivo `supabase/schema.sql` del proyecto
   - Copia TODO el contenido y pégalo en el editor de Supabase
   - Click en "Run" (▶️)
   - Deberías ver "Success. No rows returned"

### Paso 4: Ejecutar la app

1. En la terminal (en la carpeta del proyecto), ejecuta:
   ```bash
   npm run dev
   ```

2. Deberías ver algo como:
   ```
   VITE v5.x.x  ready in xxx ms

   ➜  Local:   http://localhost:3000/
   ```

3. **Abre tu navegador** en http://localhost:3000

4. **¡Listo!** Deberías ver la pantalla de login de tu app.

## 🎉 Probando la app

1. Crea una cuenta con tu email
2. Registra tu primer momento del día
3. Ve al reporte semanal
4. Prueba el botón de compartir
5. Activa el modo oscuro

## 🐛 Si algo no funciona

### Error: "Cannot find module"
- Ejecuta: `npm install` nuevamente

### Error: "Supabase URL is required"
- Verifica que el archivo `.env` exista
- Verifica que las variables estén bien escritas (VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY)
- **Importante**: Después de crear/editar el .env, DETÉN el servidor (Ctrl+C) y vuelve a ejecutar `npm run dev`

### La app carga pero no puedo registrarme
- Verifica que ejecutaste el script SQL en Supabase
- Ve a Supabase → Table Editor → deberías ver las tablas "entries" y "user_settings"

### Puerto 3000 ya en uso
- Detén otros programas que usen ese puerto
- O el mensaje te dirá qué otro puerto usar (ej: http://localhost:3001)

## 📱 Siguientes pasos (después de probar)

Una vez que la app funcione localmente:

1. **Subirla a GitHub** (para tener respaldo)
2. **Desplegarla en Vercel** (para que funcione en internet gratis)
3. **Conseguir usuarios beta** para probar

Te guiaré en cada paso cuando estés listo.

## 💡 Consejos

- **No compartas tu archivo .env** con nadie (contiene tus claves secretas)
- **No borres la carpeta node_modules** (se regenera con npm install)
- **Para detener el servidor**: Ctrl + C en la terminal
- **Para ver la consola de errores**: F12 en el navegador → pestaña Console

## 🆘 ¿Necesitas ayuda?

Si algo no funciona, dime:
1. Qué paso estás ejecutando
2. Qué error ves (copia el mensaje completo)
3. Qué sistema operativo usas

¡Estoy aquí para ayudarte!

# Cómo subir tu app a GitHub

## ¿Por qué GitHub?

- Respaldo en la nube (no pierdes tu código)
- Necesario para desplegar en Vercel
- Puedes ver el historial de cambios
- Colaboración futura

## Paso 1: Instalar Git (si no lo tienes)

1. Ve a https://git-scm.com/downloads
2. Descarga Git para Windows
3. Instala con las opciones por defecto

## Paso 2: Configurar Git (solo primera vez)

Abre la terminal en la carpeta del proyecto y ejecuta:

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

(Usa el mismo email de tu cuenta de GitHub)

## Paso 3: Inicializar Git en tu proyecto

En la terminal, en la carpeta del proyecto:

```bash
git init
git add .
git commit -m "Primera versión de StoryWorthy App"
```

Esto crea el primer "snapshot" de tu código.

## Paso 4: Crear repositorio en GitHub

1. Ve a https://github.com
2. Inicia sesión (o crea cuenta si no tienes)
3. Click en el botón "+" arriba a la derecha → "New repository"
4. Nombre: `storyworthy-app`
5. Descripción: "App de desarrollo personal basada en Homework for Life"
6. **Importante**: Deja TODO sin marcar (no README, no .gitignore, nada)
7. Click "Create repository"

## Paso 5: Conectar tu código con GitHub

GitHub te mostrará comandos. Copia y ejecuta estos en tu terminal:

```bash
git remote add origin https://github.com/TU-USUARIO/storyworthy-app.git
git branch -M main
git push -u origin main
```

(Reemplaza TU-USUARIO con tu usuario de GitHub)

Te pedirá autenticarte:
- En Windows, se abrirá una ventana de autenticación
- Inicia sesión con tu cuenta de GitHub

## Paso 6: Verificar que funcionó

1. Refresca la página de GitHub
2. Deberías ver todos tus archivos ahí
3. ¡Listo! Tu código está respaldado

## 🔄 Para futuras actualizaciones

Cuando hagas cambios al código y quieras subirlos:

```bash
git add .
git commit -m "Descripción de lo que cambiaste"
git push
```

## Ejemplo completo desde cero

```bash
# Solo primera vez
git init
git add .
git commit -m "Primera versión"
git remote add origin https://github.com/TU-USUARIO/storyworthy-app.git
git branch -M main
git push -u origin main

# Futuras actualizaciones
git add .
git commit -m "Agregué nueva funcionalidad"
git push
```

## ⚠️ Importante

El archivo `.env` NO se sube a GitHub (está en .gitignore).
Esto es correcto: las claves secretas NO deben estar en GitHub.

## Siguiente paso: Desplegar en Vercel

Una vez que esté en GitHub, podemos desplegarlo en Vercel para que funcione en internet.

Te guiaré en ese paso cuando estés listo.

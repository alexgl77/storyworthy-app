# StoryWorthy App - Homework for Life

App de desarrollo personal basada en el concepto "Homework for Life" del libro Storyworthy de Matthew Dicks.

## ¿Qué hace esta app?

Te ayuda a salir del piloto automático registrando diariamente momentos story-worthy de tu vida:
- 📝 Captura diaria de tu momento más significativo
- 🔥 Sistema de rachas para mantener el hábito
- 📊 Reporte semanal con estadísticas
- 📱 Opción de compartir en redes sociales
- 💡 Prompts para cuando no sepas qué escribir
- 🌙 Modo oscuro

## Configuración inicial

### 1. Instalar Node.js
Si no lo tienes, descarga Node.js desde: https://nodejs.org (versión LTS)

### 2. Instalar dependencias
Abre la terminal en esta carpeta y ejecuta:
```bash
npm install
```

### 3. Configurar Supabase

1. Crea cuenta gratis en https://supabase.com
2. Crea un nuevo proyecto
3. Ve a Settings > API
4. Copia la URL del proyecto y la clave "anon public"
5. Crea archivo `.env` en esta carpeta con:
```
VITE_SUPABASE_URL=tu-url-aqui
VITE_SUPABASE_ANON_KEY=tu-clave-aqui
```

### 4. Crear tablas en Supabase

Ve al SQL Editor en Supabase y ejecuta el script que está en `supabase/schema.sql`

### 5. Ejecutar la app

```bash
npm run dev
```

Abre http://localhost:3000 en tu navegador.

## Desplegar a producción

1. Sube el código a GitHub
2. Conecta tu repositorio con Vercel (https://vercel.com)
3. Agrega las variables de entorno en Vercel
4. Deploy automático

## Stack tecnológico

- React + Vite
- Tailwind CSS
- Supabase (auth + database)
- React Router

## Estructura del proyecto

```
src/
  ├── components/     # Componentes reutilizables
  ├── pages/         # Páginas de la app
  ├── lib/           # Configuración (Supabase)
  ├── hooks/         # Custom hooks
  └── utils/         # Funciones auxiliares
```

## Próximos pasos después del MVP

- [ ] Recordatorios por email
- [ ] App móvil nativa (React Native)
- [ ] Análisis de patrones en entradas
- [ ] Versión premium
- [ ] Audio en vez de solo texto

# SOII Chat Frontend (Angular)

Ventana de chat que envía los mensajes al backend (proyecto `backend/`, Next.js) y muestra la respuesta en streaming.

## Desarrollo local

```bash
npm install
npm start   # http://localhost:4200
```

Por defecto apunta al backend en `http://localhost:3000` (ver `src/environments/environment.development.ts`).

## Configurar la URL del backend en producción

Edita `src/environments/environment.ts` y pon la URL real del backend desplegado:

```ts
export const environment = {
  production: true,
  apiUrl: 'https://tu-backend.example.com',
};
```

## Build

```bash
npm run build
```

Los artefactos quedan en `dist/frontend/browser`, listos para subir a Cloudflare Pages.

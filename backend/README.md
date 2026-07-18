# SOII Chat Backend (Next.js)

API que recibe mensajes del chat y los reenvía a DeepSeek, haciendo streaming de la respuesta de vuelta al cliente.

## Desarrollo local

```bash
npm install
cp .env.example .env.local   # completa DEEPSEEK_API_KEY
npm run dev
```

## Variables de entorno

- `DEEPSEEK_API_KEY`: API key de DeepSeek (requerida).
- `ALLOWED_ORIGIN`: origen permitido para CORS (por defecto `*`). En producción, ponla igual al dominio del frontend, por ejemplo `https://mi-chat.pages.dev`.

## Endpoint

`POST /api/chat`

Body:

```json
{
  "messages": [
    { "role": "user", "content": "Hola" }
  ]
}
```

Responde con un stream `text/event-stream` (formato SSE de DeepSeek/OpenAI).

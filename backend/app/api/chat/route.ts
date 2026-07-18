import { NextRequest } from "next/server";

export const runtime = "edge";

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

function corsHeaders() {
  const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "DEEPSEEK_API_KEY no está configurada en el servidor." }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders() } },
    );
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "JSON inválido." }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }

  const messages = body.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: "Falta el arreglo 'messages'." }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }

  const deepseekResponse = await fetch(DEEPSEEK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages,
      stream: true,
    }),
  });

  if (!deepseekResponse.ok || !deepseekResponse.body) {
    const errorText = await deepseekResponse.text();
    return new Response(
      JSON.stringify({ error: "Error al llamar a DeepSeek.", detail: errorText }),
      {
        status: deepseekResponse.status || 502,
        headers: { "Content-Type": "application/json", ...corsHeaders() },
      },
    );
  }

  // Reenviamos el stream SSE de DeepSeek tal cual al cliente.
  return new Response(deepseekResponse.body, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      ...corsHeaders(),
    },
  });
}

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  // Read env at runtime
  const openaiKey = process.env.OPENAI_API_KEY;

  return NextResponse.json({
    hasOpenAIKey: !!openaiKey,
    openAIKeyLength: openaiKey ? openaiKey.length : 0,
    // Just to see what env vars are there without exposing secrets
    matchingEnvKeys: Object.keys(process.env).filter((k) =>
      k.toUpperCase().includes("OPENAI") ||
      k.toUpperCase().includes("GOOGLE") ||
      k.toUpperCase().includes("GEMINI")
    ),
  });
}
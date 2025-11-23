// app/api/generate/route.ts
import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const apiKey = process.env.OPENAI_API_KEY;

// Log at boot so you can confirm on Vercel logs
if (!apiKey) {
  console.error("CRITICAL: OPENAI_API_KEY is missing at boot (server).");
} else {
  console.log("OPENAI_API_KEY detected (length):", apiKey.length);
}

const openai = new OpenAI({
  apiKey: apiKey ?? "",
});

export async function POST(req: Request) {
  try {
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server config error: OPENAI_API_KEY missing on server." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const {
      jobType,
      hazards,
      clientName,
      siteAddress,
      customDescription,
      trade,
    } = body;

    console.log(">> /api/generate called with:", {
      jobType,
      trade,
      clientName,
      hasHazards: Array.isArray(hazards),
      siteAddress,
    });

    const systemPrompt = `
      You are a Chartered Health & Safety Consultant (CMIOSH) for UK Construction.
      Output strictly valid JSON.
    `;

    const userPrompt = `
      TASK: Write specific RAMS content.
      
      CONTEXT:
      - Task: ${jobType}
      - Trade: ${trade}
      - Client: ${clientName}
      - Site: ${siteAddress}
      - Notes: ${customDescription || "Standard Scope"}
      - Hazards: ${hazards ? hazards.join(", ") : "General"}

      REQUIREMENTS:
      1. Method Statement: 4 distinct steps (5.1-5.4).
         - Step 5.1 MUST say "Arrive at ${siteAddress}..."
         - Step 5.3 MUST incorporate user notes: "${customDescription}".
      2. COSHH: Identify the 1 main substance risk.

      OUTPUT FORMAT (JSON):
      {
        "summary": "Professional summary...",
        "method_steps": [
           "5.1 PRE-START: Detailed arrival instructions...",
           "5.2 SAFETY: Isolation and safety setup...",
           "5.3 EXECUTION: Technical steps...",
           "5.4 COMPLETION: Handover instructions..."
        ],
        "coshh": [
           { "substance": "Name", "risk": "Risk", "control": "Control", "disposal": "Disposal" }
        ]
      }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.6,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      console.error("OpenAI returned empty content:", completion);
      return NextResponse.json(
        { error: "OpenAI returned empty response" },
        { status: 502 }
      );
    }

    let data;
    try {
      data = JSON.parse(content);
    } catch (parseErr: any) {
      console.error("JSON parse error from OpenAI:", parseErr, "RAW:", content);
      return NextResponse.json(
        { error: "Failed to parse AI JSON", raw: content },
        { status: 502 }
      );
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error(
      "AI Failed in /api/generate:",
      JSON.stringify(err, Object.getOwnPropertyNames(err))
    );

    return NextResponse.json(
      {
        error: "AI call failed",
        message: err.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
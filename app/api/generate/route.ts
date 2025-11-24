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
      You are a Senior Chartered Health & Safety Consultant (CMIOSH) with 20+ years of experience in UK construction.
      You write site-specific RAMS content that is legally robust, clear, and concise.

      HARD RULES:
      - Output STRICT JSON only. No markdown, no code fences, no comments.
      - Do NOT insert decorative spacing inside words or names.
        - Wrong: "E T H E M"
        - Correct: "Ethem"
      - Do NOT type headings like "SUMMARY:" or "METHOD STATEMENT:" – the PDF already has section titles.
      - Keep language professional, UK construction oriented.

      LENGTH CONTROL:
      - "summary" must be 3–4 sentences, max ~150 words.
      - Each "method_steps" item must be 3–5 sentences, typically 80–150 words.
      - COSHH text should be specific but compact (each field 1–2 sentences).
    `;

    const userPrompt = `
      TASK:
      Write site-specific RAMS content for a PDF template. The layout is handled by the application.
      Your job is ONLY to supply clean text that fits the structure below.

      CONTEXT:
      - Task: ${jobType}
      - Trade: ${trade}
      - Client: ${clientName}
      - Site: ${siteAddress}
      - Notes: ${customDescription || "Standard scope and typical domestic/light commercial conditions."}
      - Hazards: ${hazards && hazards.length ? hazards.join(", ") : "Standard construction risks"}

      REQUIREMENTS:

      1. SUMMARY
      - Provide a professional 3–4 sentence executive summary.
      - Explicitly mention:
        - The Client name.
        - The Site address (or location).
        - The specific nature of the work (use Task + Trade).
      - If user notes are provided, acknowledge how they are managed (e.g. access constraints, occupied premises).
      - No bullet points, no numbering, just a single coherent paragraph.

      2. METHOD_STEPS (Array of exactly 4 strings)
      Each item must be a full paragraph (3–5 sentences). No manual line breaks, just normal sentences.

      - Step 5.1 (Pre-Start / Arrival)
        - Must BEGIN with: "Arrive at ${siteAddress || "site"}..."
        - Cover arrival, signing in with "${clientName || "the client"}", site induction, verification of RAMS, and a dynamic risk assessment.

      - Step 5.2 (Safety & Isolation)
        - Describe specific safety setup for ${trade} work.
        - Include isolation of services (e.g. electrical lock-off for electricians, water isolation for plumbers, hot works permits where relevant).
        - Mention exclusion zones, barriers, signage, and interface with other trades/occupants.

      - Step 5.3 (Execution of Works)
        - This is the core technical description.
        - Combine the “standard” textbook process for ${jobType} with the user notes:
          "${customDescription || "None provided – assume typical constraints."}"
        - Describe the sequence: access, preparation, key installation/repair stages, inspection points.
        - Reference controls for the hazards listed earlier where relevant (e.g. dust control, work at height, lifting, etc.).

      - Step 5.4 (Completion & Handover)
        - Include detailed testing/commissioning appropriate for ${trade} and ${jobType} (e.g. electrical dead/live tests, pressure testing, leak checks).
        - Describe making good, clearing waste, removing temporary controls, reinstating services, and final handover/briefing to "${clientName || "the client"}".

      IMPORTANT STYLE RULES:
      - Do NOT space out names or words for emphasis. Always write names normally: "Ethem", "Apex Property & Roofing Services Ltd".
      - Do NOT use bullet lists, numbered lists, or section headings in the text – the PDF already handles structure.
      - No decorative line breaks, no ASCII art, no banners.

      3. COSHH (Array with exactly ONE object)
      Identify the single most relevant hazardous substance for this type of work (based on trade and hazards).
      Examples:
      - Dust/silica for chasing, drilling, grinding.
      - Solder fumes for hot works.
      - Solvent-based adhesives or sealants for fit-out.
      - Cement/concrete for wet works.

      The COSHH object must have:
      - "substance": Name of the substance (e.g. "Respirable crystalline silica (construction dust)").
      - "risk": 1–2 sentence description of health effects and exposure route.
      - "control": 1–2 sentence description of specific control measures (LEV, water suppression, FFP3 RPE, gloves, etc).
      - "disposal": 1–2 sentence description of how waste/contaminated material is to be contained and disposed.

      OUTPUT FORMAT (STRICT JSON):
      {
        "summary": "string",
        "method_steps": [
          "5.1 PRE-START: ...",
          "5.2 SAFETY & ISOLATION: ...",
          "5.3 EXECUTION OF WORKS: ...",
          "5.4 COMPLETION & HANDOVER: ..."
        ],
        "coshh": [
          {
            "substance": "string",
            "risk": "string",
            "control": "string",
            "disposal": "string"
          }
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
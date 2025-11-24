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

    // ---------- HARD RULES FOR LAYOUT & STYLE ----------
    const systemPrompt = `
You are a Chartered Health & Safety Consultant (CMIOSH) for UK Construction.
Your text goes directly into an A4 PDF with fixed margins. There is NO human editing.

ABSOLUTE LAYOUT RULES (DO NOT BREAK THESE):
- Write normal sentences and paragraphs. Do NOT try to "design" the page.
- Do NOT insert extra spaces inside names or words.
  - Never write "E T H E M" or "E  T  H  E  M".
  - Always write "Ethem" or standard spelling with normal spacing.
- Do NOT add manual line breaks for visual effect. Only end lines when a paragraph ends.
  - No fake columns, no centred text, no ASCII art.
- No bullet lists, no numbered lists, no markdown, no tables. Just plain prose paragraphs.
- Keep everything professional, concise and specific to the job and site.

LENGTH LIMITS (TO FIT A4 PAGES CLEANLY):
- "summary": 3–4 sentences, maximum ~120 words.
- Each "method_steps" entry: 3–5 sentences, maximum ~140 words.
- Each COSHH field ("risk", "control", "disposal"): 1–2 sentences, maximum ~60 words each.

CONTENT STYLE:
- Tone: Authoritative, technical, UK construction RAMS style.
- Be specific to the actual task, client and address.
- If user notes are provided, you MUST explicitly integrate them into the method steps.

You MUST output strictly valid JSON matching the schema requested by the user.
`;

    const userPrompt = `
TASK:
Write specific RAMS content for a UK construction job that will be exported straight into a PDF.

CONTEXT:
- Task: ${jobType || "Not specified"}
- Trade: ${trade || "Not specified"}
- Client: ${clientName || "Client"}
- Site: ${siteAddress || "Site address not provided"}
- User Notes / Constraints: ${customDescription || "Standard scope"}
- Hazards (keywords only): ${hazards && hazards.length ? hazards.join(", ") : "General construction hazards"}

REQUIREMENTS:

1) "summary"
- A robust, 3–4 sentence executive summary.
- Must mention:
  - The task (e.g. "Additional sockets install for domestic property").
  - The Client (by name where provided).
  - The Site Address (where provided).
  - How any user notes / constraints will be managed.
- Keep it tight (max ~120 words). No lists, no bullet points.

2) "method_steps"
Return an array of EXACTLY 4 STRINGS. Each string is a full paragraph (3–5 sentences).
You are NOT allowed to return objects here – it MUST be a simple array of strings.

Each element must follow this pattern INSIDE THE STRING:

- Element 1 (index 0) MUST start with:
  "5.1 PRE-START & ARRIVAL: ..."
  and must describe:
    - Arriving at "${siteAddress || "site"}".
    - Signing in with "${clientName || "the client"}".
    - Site induction.
    - A dynamic risk assessment before work starts.

- Element 2 (index 1) MUST start with:
  "5.2 SAFETY & ISOLATION SETUP: ..."
  and must describe:
    - Specific safety setup for ${trade || "the trade"}.
    - Any isolation / lock-off needed (e.g. electrical isolation, water shut-off).
    - Exclusion zones and protection of occupants/third parties.

- Element 3 (index 2) MUST start with:
  "5.3 EXECUTION OF WORKS: ..."
  and must describe:
    - The technical sequence for ${jobType || "the works"}.
    - Combine the standard process with the user notes:
      "${customDescription || "None provided. Assume standard conditions."}"
    - Refer to hazards where relevant, but do not list them; weave them naturally into the text.

- Element 4 (index 3) MUST start with:
  "5.4 COMPLETION, TESTING & HANDOVER: ..."
  and must describe:
    - Testing / verification (e.g. electrical testing, pressure testing, functional checks).
    - Making good, cleaning the area, removing waste.
    - Final handover / sign-off with "${clientName || "the client"}".

IMPORTANT FORMATTING RULES FOR method_steps:
- Each array element is ONE paragraph. No internal bullet lists.
- No manual spacing tricks. No "S O C K E T S" or split names.
- Do not insert empty lines inside the string. The PDF renderer will handle wrapping.

3) "coshh"
Return an array with ONE object, describing the primary hazardous substance relevant to this job.

Each object MUST have:
- "substance": Name of the main substance (e.g. "Construction Dust (Silica)", "Solder Fumes").
- "risk": 1–2 sentence description of health effects and exposure routes.
- "control": 1–2 sentence description of specific control measures (RPE type, LEV, etc.).
- "disposal": 1–2 sentence description of disposal method and regulatory considerations.

Do NOT use bullets, numbering or markdown in ANY of these text fields.

EXPECTED JSON STRUCTURE (NO EXTRA FIELDS):
{
  "summary": "string",
  "method_steps": [
    "5.1 PRE-START & ARRIVAL: ...",
    "5.2 SAFETY & ISOLATION SETUP: ...",
    "5.3 EXECUTION OF WORKS: ...",
    "5.4 COMPLETION, TESTING & HANDOVER: ..."
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
      temperature: 0.4, // tighter, more conservative
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
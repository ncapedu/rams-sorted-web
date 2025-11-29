// app/api/generate/route.ts
import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 minutes

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error("CRITICAL: OPENAI_API_KEY is missing at boot (server).");
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

    console.log(">> /api/generate PARALLEL called with:", {
      jobType,
      trade,
      clientName,
    });

    // --- COMMON CONTEXT ---
    const contextString = `
CONTEXT:
- Task: ${jobType || "Not specified"}
- Trade: ${trade || "Not specified"}
- Client: ${clientName || "Client"}
- Site: ${siteAddress || "Site address not provided"}
- User Notes: ${customDescription || "Standard scope"}
- Hazards: ${hazards && hazards.length ? hazards.join(", ") : "General construction hazards"}
`;

    const baseSystemPrompt = `
You are a Chartered Health & Safety Consultant (CMIOSH) for UK Construction.
Your text goes directly into an A4 PDF. NO markdown, NO bullets, NO numbering.
Tone: Authoritative, technical, reassuring, and highly professional.
`;

    // --- TASK 1: SUMMARY ---
    const summaryPromise = openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `${baseSystemPrompt}
OUTPUT: JSON { "summary": "string" } (150-250 words).
Write a robust executive summary outlining the safety approach. Mention Client and Site.`
        },
        { role: "user", content: `Write the Executive Summary.\n${contextString}` },
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    // --- TASK 2: METHOD STEPS ---
    const stepsPromise = openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `${baseSystemPrompt}
OUTPUT: JSON { "method_steps": ["string", "string", "string", "string"] }
Return EXACTLY 4 strings. Each string is a substantial paragraph (8-12 sentences, ~300 words).
Do NOT return objects.
Step 1: 5.1 PRE-START & ARRIVAL
Step 2: 5.2 SAFETY & ISOLATION SETUP
Step 3: 5.3 EXECUTION OF WORKS (Integrate User Notes)
Step 4: 5.4 COMPLETION, TESTING & HANDOVER`
        },
        { role: "user", content: `Write the 4 Method Statement Steps.\n${contextString}` },
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    // --- TASK 3: COSHH ---
    const coshhPromise = openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `${baseSystemPrompt}
OUTPUT: JSON { "coshh": [{ "substance": "...", "risk": "...", "control": "...", "disposal": "..." }] }
Return an array with ONE object describing the primary hazardous substance.
Each field must be 3-5 sentences.`
        },
        { role: "user", content: `Write the COSHH Assessment.\n${contextString}` },
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    // --- EXECUTE PARALLEL ---
    const [summaryRes, stepsRes, coshhRes] = await Promise.all([
      summaryPromise,
      stepsPromise,
      coshhPromise
    ]);

    // --- PARSE RESULTS ---
    const parseJSON = (content: string | null) => {
      if (!content) return {};
      try { return JSON.parse(content); } catch (e) { return {}; }
    };

    const summaryData = parseJSON(summaryRes.choices[0]?.message?.content);
    const stepsData = parseJSON(stepsRes.choices[0]?.message?.content);
    const coshhData = parseJSON(coshhRes.choices[0]?.message?.content);

    // --- COMBINE ---
    const finalData = {
      summary: summaryData.summary || "",
      method_steps: stepsData.method_steps || [],
      coshh: coshhData.coshh || [],
    };

    return NextResponse.json(finalData);

  } catch (err: any) {
    console.error("AI Failed in /api/generate:", err);
    return NextResponse.json(
      { error: "AI call failed", message: err.message },
      { status: 500 }
    );
  }
}
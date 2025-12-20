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
  apiKey: process.env.OPENAI_API_KEY || "dummy-key",
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
      extraSections,
    } = body;

    console.log(">> /api/generate PARALLEL called with:", {
      jobType,
      trade,
      clientName,
      extraSections,
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
You are a Senior Chartered Health & Safety Consultant (CMIOSH) with 25 years of experience in UK Construction.
Your task is to write a "Site-Specific Risk Assessment & Method Statement" (RAMS) that is legally robust, highly detailed, and professional.

TONE: Authoritative, technical, specific, and concise.
AVOID: Generic fluff like "work safely" or "use PPE" without context.
`;

    // --- TASK 1: SUMMARY ---
    const summaryPromise = openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `${baseSystemPrompt}
OUTPUT: JSON { "summary": "string" } (150-250 words).
Write a robust executive summary outlining the safety approach.
- Explicitly mention the Client Name and Site Address.
- Describe the specific nature of the ${trade} works.
- Address any specific site constraints or user notes provided.`
        },
        { role: "user", content: `Write the Executive Summary.\n${contextString}` },
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    // --- TASK 2: METHOD STEPS ---
    const stepsPromise = openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `${baseSystemPrompt}
OUTPUT: JSON { "method_steps": ["string", "string", "string", "string"] }
Return EXACTLY 4 strings. Each string must be a substantial, detailed paragraph (8-12 sentences, ~300 words).
Do NOT return objects.

Step 1: 5.1 PRE-START & ARRIVAL
- Arrival procedures, induction, permit-to-work checks.
- Dynamic risk assessment and exclusion zone setup.

Step 2: 5.2 SAFE SYSTEM OF WORK
- Specific safety controls for ${trade}.
- Isolation of services, LOTO procedures, and specific hazard management (e.g. dust, noise).

Step 3: 5.3 EXECUTION OF WORKS
- Detailed step-by-step of the installation/work process.
- Integrate the User Notes: "${customDescription || "Standard scope"}".

Step 4: 5.4 COMPLETION, TESTING & HANDOVER
- Testing and commissioning procedures.
- Site clearance, waste disposal, and formal handover to client.`
        },
        { role: "user", content: `Write the 4 Method Statement Steps.\n${contextString}` },
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    // --- TASK 3: COSHH ---
    const coshhPromise = openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `${baseSystemPrompt}
OUTPUT: JSON { "coshh": [{ "substance": "...", "risk": "...", "control": "...", "disposal": "..." }] }
Return an array with ONE object describing the PRIMARY hazardous substance relevant to this task.
- substance: Specific name (e.g. "Respirable Crystalline Silica").
- risk: Detailed health effects (3-4 sentences).
- control: Specific control measures (LEV, water suppression, RPE grade).
- disposal: Safe disposal method in accordance with regulations.`
        },
        { role: "user", content: `Write the COSHH Assessment.\n${contextString}` },
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    // --- TASK 4: EXTRA SECTIONS (Conditional) ---
    let extraSectionsPromise: Promise<any> = Promise.resolve(null);

    if (extraSections && Array.isArray(extraSections) && extraSections.length > 0) {
      // Construct a string with the user's input for these sections
      const userProvidedDetails = extraSections.map(section => {
        const key = section as string;
        // @ts-ignore
        const val = body.extraData?.[key] || "No specific details provided.";
        return `${key.replace(/_/g, " ")}: "${val}"`;
      }).join("\n");

      extraSectionsPromise = openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `${baseSystemPrompt}
OUTPUT: JSON { "extra_sections": { "key": "content" } }
For each of the following section keys, write a detailed, specific paragraph (150-200 words) based on the user's provided details: ${extraSections.join(", ")}.
The keys in the JSON must match the requested section keys exactly (e.g. "access_egress", "isolation_plan").
Content should be technical and specific to ${trade} works, EXPANDING on the user's notes.`
          },
          { role: "user", content: `Write the content for these extra sections using the following user input:\n\n${userProvidedDetails}\n\n${contextString}` },
        ],
        response_format: { type: "json_object" },
        temperature: 0.4,
      });
    }

    // --- EXECUTE PARALLEL ---
    const [summaryRes, stepsRes, coshhRes, extraRes] = await Promise.all([
      summaryPromise,
      stepsPromise,
      coshhPromise,
      extraSectionsPromise
    ]);

    // --- PARSE RESULTS ---
    const parseJSON = (content: string | null) => {
      if (!content) return {};
      try { return JSON.parse(content); } catch (e) { return {}; }
    };

    const summaryData = parseJSON(summaryRes.choices[0]?.message?.content);
    const stepsData = parseJSON(stepsRes.choices[0]?.message?.content);
    const coshhData = parseJSON(coshhRes.choices[0]?.message?.content);
    const extraDataParsed = extraRes ? parseJSON(extraRes.choices[0]?.message?.content) : {};

    // --- COMBINE ---
    const finalData = {
      summary: summaryData.summary || "",
      method_steps: stepsData.method_steps || [],
      coshh: coshhData.coshh || [],
      extraData: extraDataParsed.extra_sections || {},
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
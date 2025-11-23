import OpenAI from "openai";
import { NextResponse } from "next/server";

// 1. Force Vercel to run this dynamic (Fixes "Cached/Old" responses)
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Give AI 60 seconds to think

// 2. Initialize OpenAI
const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: apiKey || "dummy-key", // Prevents build-time crash
});

export async function POST(req: Request) {
  try {
    // 3. Check Key on Request (Runtime Check)
    if (!apiKey) {
      console.error("CRITICAL: OPENAI_API_KEY is missing.");
      return NextResponse.json({ error: "Server Config Error" }, { status: 500 });
    }

    const body = await req.json();
    const { jobType, hazards, clientName, siteAddress, customDescription } = body;

    console.log(`>> OpenAI generating for: ${jobType}`);

    // 4. The "Chartered Engineer" Prompt
    const systemPrompt = `
      You are a Chartered Health & Safety Consultant (CMIOSH) for UK Construction.
      Output strictly valid JSON.
    `;

    const userPrompt = `
      TASK: Write specific RAMS content.
      
      CONTEXT:
      - Task: ${jobType}
      - Client: ${clientName}
      - Site: ${siteAddress}
      - Notes: ${customDescription || "Standard Scope"}
      - Hazards: ${hazards ? hazards.join(", ") : "General"}

      REQUIREMENTS:
      1. Method Statement: 4 distinct steps (5.1-5.4).
         - Step 5.1 MUST say "Arrive at ${siteAddress}..."
         - Step 5.3 MUST incorporate user notes: "${customDescription}".
      2. COSHH: Identify the 1 main substance risks.
      
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

    // 5. Execute OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" }, 
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error("Empty AI Response");

    const data = JSON.parse(content);
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("AI Failed:", error);
    // Return 500 so Frontend knows to use fallback, but logs the error
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
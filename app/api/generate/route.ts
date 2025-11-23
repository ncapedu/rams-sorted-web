import OpenAI from "openai";
import { NextResponse } from "next/server";

// 1. VERCEL CONFIGURATION (CRITICAL)
// This allows the AI to run for up to 60 seconds (fixing the timeout crash)
export const maxDuration = 60; 
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    // 2. Initialize OpenAI
    // We do this inside the function to prevent build-time crashes
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error(">> [VERCEL LOG] CRITICAL: OPENAI_API_KEY is missing from Settings!");
      // We return a specific error so you can see it in the browser network tab
      return NextResponse.json(
        { error: "Server Error: API Key Not Configured" }, 
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey: apiKey });

    // 3. Parse Data
    const body = await req.json();
    const { 
      trade, jobType, jobDesc, hazards, 
      clientName, siteAddress, customDescription 
    } = body;

    console.log(`>> [VERCEL LOG] Starting AI Generation for: ${jobType}`);

    // 4. The "Chartered Engineer" Prompt
    const systemPrompt = `
      You are a Chartered Health & Safety Consultant (CMIOSH) for the UK Construction Industry.
      Your task is to write the specific content for a Risk Assessment & Method Statement (RAMS).
      Output strictly valid JSON. No markdown, no conversation.
    `;

    const userPrompt = `
      PROJECT DETAILS:
      - Activity: ${jobType} (${trade})
      - Client: ${clientName}
      - Site: ${siteAddress}
      - Standard Process: ${jobDesc}
      - Specific Site Constraints: ${customDescription || "None provided"}
      - Hazards: ${hazards ? hazards.join(", ") : "General site risks"}

      INSTRUCTIONS:
      1. **Method Statement:** Write 4 distinct, technical paragraphs (5.1 - 5.4).
         - Step 5.1 (Pre-Start): MUST explicitly state "Arrive at ${siteAddress} and report to ${clientName}."
         - Step 5.3 (Execution): MUST incorporate the "Specific Site Constraints" into the technical procedure.
      2. **COSHH:** Identify the specific hazardous substance for this task (e.g. Silica for drilling, Solder for plumbing).
      3. **Tone:** Professional, authoritative, UK English.

      REQUIRED JSON STRUCTURE:
      {
        "summary": "A robust 2-3 sentence executive summary of the work...",
        "method_steps": [
           "5.1 PRE-COMMENCEMENT & SITE SETUP: [Detailed paragraph...]",
           "5.2 SAFE ISOLATION & PERMITS: [Detailed paragraph...]",
           "5.3 EXECUTION OF WORKS: [Detailed paragraph...]",
           "5.4 COMPLETION & HANDOVER: [Detailed paragraph...]"
        ],
        "coshh": [
           { "substance": "Name", "risk": "Health Risk", "control": "Control Measure", "disposal": "Disposal Route" }
        ]
      }
    `;

    // 5. Call OpenAI (GPT-4o-mini is best for speed/cost/quality balance)
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" }, // Guarantees JSON won't break
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error("Empty response from AI");

    const data = JSON.parse(content);
    console.log(">> [VERCEL LOG] AI Generation Successful");
    
    return NextResponse.json(data);

  } catch (error: any) {
    console.error(">> [VERCEL LOG] AI Failed:", error.message);
    // Return error to frontend so it knows to use fallback (but logs the error here)
    return NextResponse.json({ error: "AI Generation Failed", details: error.message }, { status: 500 });
  }
}
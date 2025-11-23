import OpenAI from "openai";
import { NextResponse } from "next/server";

// Force Vercel to not cache this route
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    // 1. Parse Data
    const body = await req.json();
    const { 
      trade, 
      jobType, 
      jobDesc, 
      hazards, 
      clientName, 
      siteAddress, 
      customDescription 
    } = body;

    // 2. Initialize OpenAI INSIDE the function (Prevents Build Crash)
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error("SERVER ERROR: Missing OPENAI_API_KEY");
      // Return a specific error so the frontend handles it gracefully
      return NextResponse.json({ error: "Server Config Error: Missing API Key" }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey: apiKey });

    console.log(`>> OpenAI Generating for: ${jobType} at ${siteAddress}`);

    // 3. The Prompt
    const systemPrompt = `
      You are a Chartered Health & Safety Consultant (CMIOSH) for the UK Construction Industry.
      You must generate a valid JSON object for a Risk Assessment & Method Statement (RAMS) document.
      The content must be specific, professional, and practical.
    `;

    const userPrompt = `
      PROJECT DETAILS:
      - Trade: ${trade}
      - Task: ${jobType}
      - Client: ${clientName}
      - Address: ${siteAddress}
      - Standard Process: ${jobDesc}
      - Specific Constraints: ${customDescription || "None provided"}
      - Hazards: ${hazards ? hazards.join(", ") : "Standard"}

      OUTPUT REQUIREMENTS:
      Return a JSON object with this EXACT structure:
      {
        "summary": "A 2-3 sentence professional summary of the scope of works at ${siteAddress}.",
        "method_steps": [
           "5.1 PRE-START: Specific arrival instructions for ${siteAddress}...",
           "5.2 SAFETY: Specific isolation and safety setup...",
           "5.3 EXECUTION: Detailed technical steps for ${jobType}...",
           "5.4 COMPLETION: Handover instructions for ${clientName}..."
        ],
        "coshh": [
           { "substance": "Name", "risk": "Risk", "control": "Control", "disposal": "Disposal" }
        ]
      }
    `;

    // 4. Call OpenAI with JSON Mode
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Fast & cheap
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    });

    // 5. Parse Response
    const rawContent = completion.choices[0].message.content;
    
    if (!rawContent) {
      throw new Error("OpenAI returned empty content");
    }

    const data = JSON.parse(rawContent);
    
    console.log(">> OpenAI Success");
    return NextResponse.json(data);

  } catch (error: any) {
    console.error(">> OpenAI Failed:", error);
    return NextResponse.json({ error: "AI Generation Failed", details: error.message }, { status: 500 });
  }
}
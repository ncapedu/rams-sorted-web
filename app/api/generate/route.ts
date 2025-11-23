import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// --- VERCEL CONFIGURATION ---
// This forces Vercel to run the function fresh every time (no caching)
export const dynamic = 'force-dynamic'; 
// This allows the function to run longer than the default 10s (if your plan allows)
export const maxDuration = 60; 

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(req: Request) {
  try {
    console.log(">> [VERCEL] API Route Hit. Starting...");

    // 1. Security Check: Verify Key Exists on Server
    if (!process.env.GOOGLE_API_KEY) {
      console.error(">> [FATAL] GOOGLE_API_KEY is not set in Vercel Environment Variables!");
      return NextResponse.json(
        { error: "Server Error: API Key Missing" }, 
        { status: 500 }
      );
    }

    const body = await req.json();
    const { jobType, jobDesc, hazards, clientName, siteAddress, customDescription } = body;

    console.log(`>> [VERCEL] Generating for: ${jobType}`);

    // 2. Strict Persona Prompt
    const prompt = `
      ACT AS: A Chartered Health & Safety Consultant (CMIOSH) for the UK Construction Industry.
      TASK: Write specific content for a Risk Assessment & Method Statement (RAMS).
      
      CONTEXT:
      - Task: ${jobType}
      - Client: ${clientName}
      - Address: ${siteAddress}
      - Standard Process: ${jobDesc}
      - Specific User Notes: ${customDescription || "None"}
      - Hazards: ${hazards ? hazards.join(", ") : "Standard"}

      INSTRUCTIONS:
      1. Write 4 Method Statement steps.
      2. **CRITICAL:** You MUST mention the site address "${siteAddress}" inside Step 5.1.
      3. **CRITICAL:** You MUST mention the client "${clientName}" inside Step 5.4.
      4. Keep it professional and concise.

      OUTPUT JSON ONLY (No Markdown):
      {
        "summary": "Professional summary of works at ${siteAddress}...",
        "method_steps": [
           { "t": "5.1 PRE-START", "d": "Arrival instructions for ${siteAddress}..." },
           { "t": "5.2 SAFETY", "d": "Isolation and safety setup..." },
           { "t": "5.3 EXECUTION", "d": "Detailed steps for ${jobType}..." },
           { "t": "5.4 COMPLETION", "d": "Handover to ${clientName}..." }
        ],
        "coshh": [
           { "substance": "Primary Dust/Chemical", "risk": "Primary Health Risk", "control": "Primary Control", "disposal": "Disposal Method" }
        ]
      }
    `;

    // 3. Call Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 4. Clean Output
    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(cleanedText);

    console.log(">> [VERCEL] AI Generation Success");
    return NextResponse.json(data);

  } catch (error: any) {
    console.error(">> [VERCEL] Generation Failed:", error);
    return NextResponse.json(
      { error: "AI Generation Failed", details: error.message }, 
      { status: 500 }
    );
  }
}
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize Gemini
// Ensure your .env.local file has GOOGLE_API_KEY=AIza...
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

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

    // 2. Safety Check: API Key
    if (!process.env.GOOGLE_API_KEY) {
      console.error("SERVER ERROR: GOOGLE_API_KEY is missing in .env.local");
      return NextResponse.json({ error: "API Key Missing" }, { status: 500 });
    }

    console.log(`AI GENERATION STARTED for: ${jobType} at ${siteAddress}`);

    // 3. The "Strict" Persona Prompt
    const prompt = `
      ACT AS: A Chartered Health & Safety Consultant (CMIOSH) for the UK Construction Industry.
      
      TASK: Write specific content for a Risk Assessment & Method Statement (RAMS).
      
      PROJECT CONTEXT:
      - Trade: ${trade}
      - Activity: ${jobType}
      - Client: ${clientName}
      - Site Address: ${siteAddress}
      - Standard Process: ${jobDesc}
      - User Notes: ${customDescription || "None"}
      - Key Hazards: ${hazards ? hazards.join(", ") : "Standard"}

      OUTPUT REQUIREMENTS:
      You must return a SINGLE JSON OBJECT. No markdown, no backticks.
      The JSON must map exactly to this structure:

      {
        "summary": "A 2-3 sentence professional summary of the scope of works specific to ${siteAddress}.",
        "method_steps": [
           "5.1 PRE-START: Arrive at ${siteAddress}. Sign in with ${clientName}. Induct team.",
           "5.2 SAFETY: Isolate services. Set up exclusion zone. Don PPE.",
           "5.3 EXECUTION: [Write 3-4 sentences on how to technically perform ${jobType}].",
           "5.4 COMPLETION: Remove waste. Clean area. Handover to client."
        ],
        "coshh": [
           { "substance": "Silica Dust / Debris", "risk": "Inhalation / Lung Damage", "control": "Damping down / FFP3 Mask", "disposal": "Bagged & Sealed" }
        ]
      }

      Ensure the "method_steps" are an Array of Strings, or an Array of Objects with {t: title, d: description}.
      Make the content specific to the task "${jobType}".
    `;

    // 4. Call Gemini Model
    // 'gemini-1.5-flash' is fast but smart enough for this structure.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 5. Clean the Output (Remove Markdown if Gemini adds it)
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();

    // 6. Parse & Return
    const data = JSON.parse(cleanText);
    
    console.log("AI GENERATION SUCCESS");
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("AI FAILED:", error);
    // Return 500 so the frontend knows to use Fallback, but logs the error
    return NextResponse.json({ error: "AI Generation Failed", details: error.message }, { status: 500 });
  }
}
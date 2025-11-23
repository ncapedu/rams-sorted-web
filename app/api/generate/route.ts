import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { jobType, jobDesc, hazards, clientName, siteAddress, customDescription } = body;

    if (!process.env.GOOGLE_API_KEY) {
      console.error("API Key Missing");
      return NextResponse.json({ error: "API Key Missing" }, { status: 500 });
    }

    const prompt = `
      ACT AS: Chartered Safety Consultant (UK Construction).
      TASK: Write specific RAMS content.
      
      DETAILS:
      - Task: ${jobType}
      - Client: ${clientName}
      - Address: ${siteAddress}
      - Hazards: ${hazards ? hazards.join(", ") : "None"}
      - Notes: ${customDescription || jobDesc}

      OUTPUT JSON ONLY (No Markdown):
      {
        "summary": "Professional scope summary...",
        "method_steps": [
          { "t": "5.1 PRE-START", "d": "Arrive at ${siteAddress}, sign in..." },
          { "t": "5.2 SAFETY", "d": "Isolate services..." },
          { "t": "5.3 EXECUTION", "d": "Detailed technical steps for ${jobType}..." },
          { "t": "5.4 COMPLETION", "d": "Handover to ${clientName}..." }
        ],
        "coshh": [
          { "substance": "Dust/Silica", "risk": "Inhalation", "control": "Masks/LEV", "disposal": "Skip" }
        ]
      }
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    
    return NextResponse.json(JSON.parse(text));

  } catch (error) {
    console.error("AI Generation Failed:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { trade, jobType, jobDesc, hazards, clientName, siteAddress } = body;

    // 1. Check Key
    if (!process.env.GOOGLE_API_KEY) {
      console.error("API Key Missing");
      return NextResponse.json({ error: "Server Config Error" }, { status: 500 });
    }

    console.log("Generating for:", jobType);

    // 2. Strict JSON Prompt
    const prompt = `
      ACT AS: A Chartered Health & Safety Consultant (UK).
      TASK: Write specific RAMS content.
      
      PROJECT:
      - Trade: ${trade}
      - Task: ${jobType}
      - Client: ${clientName}
      - Address: ${siteAddress}
      - Notes: ${jobDesc}
      - Hazards: ${hazards.join(", ")}

      OUTPUT JSON ONLY:
      {
        "summary": "Professional scope summary...",
        "method_steps": [
           { "t": "5.1 PRE-START", "d": "Arrive at ${siteAddress}, sign in..." },
           { "t": "5.2 SAFETY", "d": "Isolate services..." },
           { "t": "5.3 EXECUTION", "d": "Detailed steps for ${jobType}..." },
           { "t": "5.4 COMPLETION", "d": "Handover to ${clientName}..." }
        ],
        "coshh": [
           { "substance": "Dust", "risk": "Inhalation", "control": "Masks", "disposal": "Skip" }
        ]
      }
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    
    return NextResponse.json(JSON.parse(text));

  } catch (error) {
    console.error("AI Failed:", error);
    return NextResponse.json({ error: "Generation Failed" }, { status: 500 });
  }
}
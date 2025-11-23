// app/api/generate/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(req: Request) {
  console.log(">> API HIT: Starting AI Generation..."); // Visual confirmation in terminal

  try {
    // 1. Parse Data from Frontend
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

    // 2. Check API Key
    if (!process.env.GOOGLE_API_KEY) {
      console.error("!! ERROR: Missing GOOGLE_API_KEY in .env.local");
      // Return generic data so the app doesn't crash, but log the error
      return NextResponse.json({ 
        summary: jobDesc || "Standard works.", 
        method_steps: null 
      });
    }

    // 3. Construct the Prompt (Forces Specificity)
    const prompt = `
      ACT AS: A Chartered Health & Safety Consultant (CMIOSH) for the UK Construction Industry.
      
      TASK: Write the specific content for a Risk Assessment & Method Statement (RAMS).
      
      PROJECT DETAILS:
      - Trade: ${trade}
      - Task: ${jobType}
      - Client: ${clientName}
      - Site Address: ${siteAddress}
      - Specific Notes: ${customDescription || "None"}
      - Key Hazards: ${hazards ? hazards.join(", ") : "Standard risks"}

      INSTRUCTIONS:
      1. The "Method Statement" must be site-specific. DO NOT just say "Arrive on site". Say "Arrive at ${siteAddress} and report to ${clientName}."
      2. Keep it professional, concise, and strictly relevant to the task.
      3. Return ONLY valid JSON. No markdown, no code blocks.

      REQUIRED JSON STRUCTURE:
      {
        "summary": "A 2-sentence professional summary of the scope of works at ${siteAddress}.",
        "method_steps": [
          { "t": "5.1 PRE-START & SETUP", "d": "Specific arrival and setup instructions for this site..." },
          { "t": "5.2 SAFETY & ISOLATION", "d": "Specific safety measures for ${jobType}..." },
          { "t": "5.3 EXECUTION OF WORKS", "d": "Step-by-step technical process for ${jobType}..." },
          { "t": "5.4 COMPLETION", "d": "Handover and clearing up instructions..." }
        ],
        "ppe": ["List", "Specific", "PPE", "Required"],
        "coshh": [
          { "substance": "Material Name", "risk": "Primary Risk", "control": "Specific Control", "disposal": "Disposal Method" }
        ]
      }
    `;

    // 4. Call Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 5. Clean & Parse JSON
    // Remove any markdown formatting Gemini might add
    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(cleanedText);

    console.log(">> SUCCESS: AI Generation Complete.");
    return NextResponse.json(data);

  } catch (error) {
    console.error("!! AI GENERATION FAILED:", error);
    return NextResponse.json(
      { error: "AI Generation Failed", details: String(error) },
      { status: 500 }
    );
  }
}
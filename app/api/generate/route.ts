// app/api/generate/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(req: Request) {
  try {
    // 1. Parse Data from Frontend
    const body = await req.json();
    const { 
      trade, 
      jobType, 
      jobDesc, 
      hazards, 
      clientName, 
      siteAddress 
    } = body;

    // 2. Check API Key
    if (!process.env.GOOGLE_API_KEY) {
      console.error("Missing GOOGLE_API_KEY");
      // Return a 200 with fallback data so the UI doesn't crash, but logs error
      return NextResponse.json({ 
        summary: jobDesc, 
        method_steps: null // Triggers local fallback
      });
    }

    // 3. Construct the Prompt
    const prompt = `
      ACT AS: A Senior Health & Safety Consultant (UK Construction).
      TASK: Write specific RAMS content for a ${trade} doing "${jobType}".
      CLIENT: ${clientName}
      SITE: ${siteAddress}
      CONTEXT: ${jobDesc || "Standard industry practice"}
      HAZARDS IDENTIFIED: ${hazards.join(", ")}

      OUTPUT JSON ONLY. STRICT FORMAT:
      {
        "summary": "2-3 professional sentences summarizing the specific scope of works at this site.",
        "method_steps": [
          "5.1 PRE-START: Specific setup steps...",
          "5.2 SAFETY: Specific isolation or safety steps...",
          "5.3 EXECUTION: 3-4 detailed steps on how ${jobType} is actually performed...",
          "5.4 COMPLETION: Site clearance and handover steps..."
        ],
        "ppe": ["List", "Specific", "PPE", "For", "Task"],
        "coshh": [
          { "substance": "Name", "risk": "Risk", "control": "Control", "disposal": "Disposal" }
        ]
      }
    `;

    // 4. Call Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 5. Clean & Parse JSON
    // Gemini sometimes wraps JSON in markdown ```json ... ``` blocks
    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(cleanedText);

    return NextResponse.json(data);

  } catch (error) {
    console.error("AI Generation Failed:", error);
    // Return error status so frontend falls back to local data gracefully
    return NextResponse.json({ error: "AI Generation Failed" }, { status: 500 });
  }
}
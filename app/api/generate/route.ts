import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// We are using standard Node.js runtime for maximum compatibility
export const maxDuration = 10; // Vercel Free Tier limit (explicitly set)

export async function POST(req: Request) {
  try {
    // 1. Parse Body
    const body = await req.json();
    
    // 2. Check API Key
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      console.error("❌ Error: GOOGLE_API_KEY is missing in Vercel Env Variables.");
      return NextResponse.json(
        { error: "Server Error: API Key is missing. Please check Vercel Settings." }, 
        { status: 500 }
      );
    }

    // 3. Initialize AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 4. Construct Prompt
    const prompt = `
      ACT AS: Senior UK Health & Safety Consultant.
      CLIENT: ${body.company} (${body.trade}).
      JOB: ${body.job}.
      HAZARDS: ${body.hazards.join(', ')}.
      
      OUTPUT: A professional, legally compliant RAMS document text.
      REQUIREMENTS:
      - Cite relevant UK regulations (BS 7671, Work at Height, etc).
      - Sections: 1. Executive Summary, 2. Risk Assessment Table (Hazard | Control), 3. Method Statement, 4. PPE Checklist.
      - Tone: Formal, British English.
      - NO MARKDOWN FORMATTING (No bold stars **, no hashes #). Plain text only.
    `;

    // 5. Generate (with error catching)
    console.log("🚀 Sending request to Gemini...");
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    console.log("✅ Generation successful");

    return NextResponse.json({ text });

  } catch (error: any) {
    console.error("🔥 AI Generation Failed:", error);
    
    // Return the ACTUAL error message to the frontend so we can see it
    return NextResponse.json(
      { error: error.message || "AI Generation Failed" }, 
      { status: 500 }
    );
  }
}
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Using the standard model that works everywhere
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
  }
}
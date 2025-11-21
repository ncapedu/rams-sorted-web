import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// ⚡ FORCE DYNAMIC: This tells Vercel "Don't freeze this file. Run it fresh every time."
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Debugging: Print to Vercel Logs (not browser) to prove if key exists
    // It will print "Key Status: Exists" or "Key Status: Missing"
    const apiKey = process.env.GOOGLE_API_KEY;
    console.log(`Key Status: ${apiKey ? "Exists" : "Missing"}`);

    if (!apiKey) {
      return NextResponse.json(
        { error: "Server Error: API Key is missing (Check Vercel Logs)" }, 
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      ACT AS: Senior UK Health & Safety Consultant.
      CLIENT: ${body.company} (${body.trade}).
      JOB: ${body.job}.
      HAZARDS: ${body.hazards.join(', ')}.
      OUTPUT: Professional RAMS document. Plain text only.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ text });

  } catch (error: any) {
    console.error("Generate Error:", error);
    return NextResponse.json(
      { error: error.message || "AI Generation Failed" }, 
      { status: 500 }
    );
  }
}
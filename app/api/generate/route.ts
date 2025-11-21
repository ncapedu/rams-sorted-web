import { NextResponse } from "next/server";

// 💎 VERCEL PRO SETTINGS 💎
// We switch to Node.js to use the full power of the server
export const runtime = 'nodejs'; 
// We tell Vercel: "I pay for Pro, give me 60 seconds to finish this task."
export const maxDuration = 60; 

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key Missing" }, { status: 500 });
    }

    // We stick with the Universal 'gemini-pro' model to avoid 404 errors
    // If you have billing enabled, you can change this to 'gemini-1.5-flash'
    const modelName = "gemini-1.5-flash"; 
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const payload = {
      contents: [{
        parts: [{
          text: `
            ACT AS: Senior UK Health & Safety Consultant.
            CLIENT: ${body.company} (${body.trade}).
            JOB: ${body.job}.
            HAZARDS: ${body.hazards.join(', ')}.
            
            OUTPUT: A professional RAMS document.
            SECTIONS: 
            1. Project Details
            2. Risk Assessment (Table: Hazard | Control)
            3. Method Statement (Steps 1-10)
            4. PPE
            
            RESTRICTION: Do NOT use Markdown formatting. Plain text only.
          `
        }]
      }]
    };

    console.log(`🚀 Starting Generation with ${modelName}...`);

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Google Error:", data);
      // This gives us the exact reason why Google failed
      return NextResponse.json(
        { error: `Google Error: ${data.error?.message || "Unknown"}` }, 
        { status: 500 }
      );
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("AI returned empty text.");

    return NextResponse.json({ text });

  } catch (error: any) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: error.message || "Generation Failed" }, 
      { status: 500 }
    );
  }
}
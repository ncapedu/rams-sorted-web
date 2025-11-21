import { NextResponse } from "next/server";

// ⚡ CRITICAL: This forces Vercel to use the Edge network (25s+ timeout)
// instead of the standard Serverless network (10s timeout).
export const runtime = 'edge'; 
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    // 1. Parse Request
    const body = await req.json();
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key Missing in Vercel Settings" }, { status: 500 });
    }

    // 2. Prepare Google API URL (Standard Flash Model)
    // We use standard fetch to be lightweight on the Edge
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    // 3. Construct Prompt
    const payload = {
      contents: [{
        parts: [{
          text: `
            ACT AS: UK Health & Safety Consultant.
            CLIENT: ${body.company} (${body.trade}).
            JOB: ${body.job}.
            HAZARDS: ${body.hazards.join(', ')}.
            
            OUTPUT: A professional RAMS document.
            SECTIONS: 
            1. Project Details
            2. Risk Assessment (Table: Hazard | Control)
            3. Method Statement (Steps 1-10)
            4. PPE
            
            RESTRICTION: Do NOT use Markdown formatting (no bold **, no hashes #). Just plain text.
          `
        }]
      }]
    };

    // 4. Send to Google
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    // 5. Handle Google Errors (Like 404 or 403)
    if (!response.ok) {
      console.error("Google API Error:", data);
      return NextResponse.json(
        { error: `Google Error: ${data.error?.message || "Unknown"}` }, 
        { status: 500 }
      );
    }

    // 6. Extract Text
    if (!data.candidates || data.candidates.length === 0) {
       return NextResponse.json({ error: "AI returned no text." }, { status: 500 });
    }

    const text = data.candidates[0].content.parts[0].text;
    return NextResponse.json({ text });

  } catch (error: any) {
    console.error("Edge Function Error:", error);
    return NextResponse.json(
      { error: error.message || "Generation Failed" }, 
      { status: 500 }
    );
  }
}
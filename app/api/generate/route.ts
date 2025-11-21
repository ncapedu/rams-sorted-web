import { NextResponse } from "next/server";

export const runtime = 'edge'; 
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key Missing in Vercel" }, { status: 500 });
    }

    // 🕵️‍♂️ STEP 1: THE MODEL HUNTER
    // Instead of guessing, we ask Google what is available.
    console.log("Hunting for available models...");
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    
    const listResponse = await fetch(listUrl);
    const listData = await listResponse.json();

    if (!listResponse.ok) {
       console.error("Model List Failed:", listData);
       return NextResponse.json({ error: `Google Account Error: ${listData.error?.message}` }, { status: 500 });
    }

    // Find the first model that supports text generation
    const validModel = listData.models?.find((m: any) => 
      m.supportedGenerationMethods.includes("generateContent")
    );

    if (!validModel) {
      return NextResponse.json({ error: "No AI Models available for this API Key. Check Google Cloud Billing." }, { status: 500 });
    }

    const modelName = validModel.name; // e.g., "models/gemini-1.0-pro-001"
    console.log(`✅ FOUND WORKING MODEL: ${modelName}`);

    // 🚀 STEP 2: GENERATE USING THE FOUND MODEL
    const generateUrl = `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${apiKey}`;

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
            
            RESTRICTION: Do NOT use Markdown formatting (no bold **, no hashes #). Plain text only.
          `
        }]
      }]
    };

    const response = await fetch(generateUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Generation Error:", data);
      return NextResponse.json(
        { error: `Google Error: ${data.error?.message || "Unknown"}` }, 
        { status: 500 }
      );
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
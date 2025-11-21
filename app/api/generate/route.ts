import { NextResponse } from "next/server";

// 💎 VERCEL PRO SETTINGS
export const runtime = 'nodejs'; 
export const maxDuration = 60; // We have 60 seconds on Pro

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key Missing" }, { status: 500 });
    }

    // 🕵️‍♂️ STEP 1: ASK GOOGLE "WHAT MODELS CAN I USE?"
    console.log("Hunting for valid models...");
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    
    const listResponse = await fetch(listUrl);
    const listData = await listResponse.json();

    if (!listResponse.ok) {
        // If we can't even list models, the Key is broken/inactive
        console.error("List Models Failed:", listData);
        return NextResponse.json({ error: `Google Key Error: ${listData.error?.message}` }, { status: 500 });
    }

    // Find the first model that supports 'generateContent'
    // We prefer 'pro' models if available
    const validModel = listData.models?.find((m: any) => 
        m.supportedGenerationMethods?.includes("generateContent") &&
        !m.name.includes("vision") // Skip vision-only models
    );

    if (!validModel) {
        return NextResponse.json({ error: "No Text AI Models found for this API Key. Check Google Billing." }, { status: 500 });
    }

    // Clean the name (remove "models/" prefix if present)
    const modelName = validModel.name.replace("models/", "");
    console.log(`✅ CONNECTED TO MODEL: ${modelName}`);

    // 🚀 STEP 2: GENERATE USING THE FOUND MODEL
    const generateUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const payload = {
      contents: [{
        parts: [{
          text: `
            ACT AS: Senior UK Health & Safety Consultant.
            CLIENT: ${body.company} (${body.trade}).
            JOB DESCRIPTION: ${body.job}.
            HAZARDS IDENTIFIED: ${body.hazards.join(', ')}.
            
            OUTPUT: A professional RAMS document.
            REQUIREMENTS:
            - Cite relevant UK regulations (BS 7671, Work at Height, etc).
            - Sections: 1. Executive Summary, 2. Risk Assessment Table (Hazard | Control), 3. Method Statement, 4. PPE Checklist.
            - Tone: Formal, British English.
            - NO MARKDOWN FORMATTING. Plain text only.
          `
        }]
      }]
    };

    const genResponse = await fetch(generateUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await genResponse.json();

    if (!genResponse.ok) {
      console.error("Generation Error:", data);
      return NextResponse.json(
        { error: `Google Error: ${data.error?.message || "Unknown"}` }, 
        { status: 500 }
      );
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("AI returned empty text");

    return NextResponse.json({ text });

  } catch (error: any) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: error.message || "Generation Failed" }, 
      { status: 500 }
    );
  }
}
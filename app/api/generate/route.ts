import { NextResponse } from "next/server";
import { HAZARD_DATA } from "../../lib/constants";

// ⚡ FORCE DYNAMIC: This prevents Vercel from "caching" the error.
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; 
export const maxDuration = 60; 

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      console.error("CRITICAL: Google API Key is missing from environment variables.");
      return NextResponse.json({ error: "Server Error: API Key Missing." }, { status: 500 });
    }

    // 1. Model Discovery
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const listRes = await fetch(listUrl);
    const listData = await listRes.json();
    
    const validModel = listData.models?.find((m: any) => 
        m.supportedGenerationMethods?.includes("generateContent") && 
        !m.name.includes("vision")
    );
    
    const modelName = validModel ? validModel.name.replace("models/", "") : "gemini-pro";
    const generateUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    // 2. Prepare Data for AI
    const answerList = Object.entries(body.answers || {})
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ");
        
    // Expand hazards to include the library definitions for better context
    // @ts-ignore
    const hazardInfo = (body.hazards || []).map(h => {
        // @ts-ignore
        const data = HAZARD_DATA[h];
        return data ? `${data.label}: (Standard Control: ${data.control})` : h;
    }).join("\n");

    // 3. The Titan Prompt
    const payload = {
      contents: [{
        parts: [{
          text: `
            ACT AS: Senior UK Health & Safety Consultant (NEBOSH qualified).
            TASK: Write the specific content for a professional Construction RAMS document.
            TONE: Formal, technical, concise, legalistic. UK English.

            === PROJECT INPUTS ===
            TRADE: ${body.trade}
            TASK: ${body.jobType === 'Other (Custom)' ? body.customJobType : body.jobType}
            DESCRIPTION: ${body.jobDesc}
            SITE CONTEXT: ${body.siteAddress} (Client: ${body.clientName})
            
            === HAZARDS IDENTIFIED ===
            ${hazardInfo}
            
            === SAFETY CHECKS (YES/NO) ===
            ${answerList}
            
            === REQUIRED OUTPUT (JSON ONLY) ===
            Return a valid JSON object with these exact keys:

            1. "summary": A professional executive summary of the work (max 80 words).
            2. "method_steps": An array of strings. Each string is a step. 
               - Use UPPERCASE headers for phases (e.g. "PRE-START CHECKS:").
               - Number the steps logically.
               - Cover: Arrival, Setup, The Work Itself, Quality Check, Clear up.
            3. "ppe": An array of strings listing specific PPE (e.g. "Safety Boots (BS EN ISO 20345)", "Hi-Vis Vest").
            4. "coshh": An array of objects IF relevant (dust/chemicals). If none, return empty array.
               Structure: { "substance": "Name", "risk": "Effect", "control": "Measure", "disposal": "Method" }

            DO NOT return markdown formatting. Just the raw JSON string.
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
    if (!response.ok) throw new Error(data.error?.message || "Google Error");

    let text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    // Clean Markdown if AI adds it
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return NextResponse.json(JSON.parse(text));

  } catch (error: any) {
    console.error("Backend Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
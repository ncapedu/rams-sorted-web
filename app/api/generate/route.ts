import { NextResponse } from "next/server";
import { HAZARD_DATA } from "../../lib/constants";

// 💎 VERCEL PRO SETTINGS (High Performance)
export const runtime = 'nodejs'; 
export const maxDuration = 60; 

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) return NextResponse.json({ error: "API Key Missing" }, { status: 500 });

    // --- 1. MODEL DISCOVERY (Auto-Finds the best available AI) ---
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const listRes = await fetch(listUrl);
    const listData = await listRes.json();
    
    // Prefer models that support content generation and aren't vision-only
    const validModel = listData.models?.find((m: any) => 
        m.supportedGenerationMethods?.includes("generateContent") && 
        !m.name.includes("vision")
    );
    
    // Fallback to 'gemini-pro' if detection fails
    const modelName = validModel ? validModel.name.replace("models/", "") : "gemini-pro";
    const generateUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    // --- 2. DATA PREPARATION ---
    // Format the Yes/No answers for the AI to read
    const answerList = Object.entries(body.answers || {})
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ");

    // Expand hazards with full definitions (Risk/Control) so the AI knows exactly what they are
    // @ts-ignore
    const hazardInfo = body.hazards.map(h => {
        // @ts-ignore
        const data = HAZARD_DATA[h];
        return data ? `${data.label}: Risk of ${data.risk}. Control via ${data.control}` : h;
    }).join("\n");

    // --- 3. THE PROMPT ---
    const payload = {
      contents: [{
        parts: [{
          text: `
            ACT AS: Senior UK Health & Safety Consultant (NEBOSH Qualified).
            TASK: Generate a specific, professional RAMS document in strict JSON format.
            
            === PROJECT DETAILS ===
            TRADE: ${body.trade}
            JOB TYPE: ${body.jobType === 'Other (Custom)' ? body.customJobType : body.jobType}
            DESCRIPTION: ${body.jobDesc}
            SITE ADDRESS: ${body.siteAddress}
            
            === SAFETY CONTEXT ===
            HAZARDS SELECTED: 
            ${hazardInfo}
            
            SPECIFIC SAFETY CHECKS (YES/NO ANSWERS):
            ${answerList}
            
            EMERGENCY INFO:
            First Aider: ${body.firstAider}
            Hospital: ${body.hospital}
            
            EXTRA NOTES:
            ${body.extraNotes}
            
            === INSTRUCTIONS ===
            1. METHOD STATEMENT: Write a detailed, step-by-step safe system of work. It must be specific to the job described. Return it as an ARRAY of strings (one string per step).
            2. RISK ASSESSMENT: For every hazard listed above, generate a row with:
               - Who is at risk?
               - Initial Risk (High/Medium)
               - Specific Control Measures (Technical & Procedural)
               - Residual Risk (Low)
            3. PPE: List required Personal Protective Equipment.
            4. FORMAT: Return ONLY valid JSON. Do not use markdown code blocks.
            
            === JSON STRUCTURE ===
            {
              "summary": "A professional executive summary of the scope of works...",
              "risks": [
                {
                  "hazard": "Name of Hazard",
                  "who": "Operatives / Public",
                  "control": "Detailed control measures...",
                  "risk_rating": "Low"
                }
              ],
              "method_steps": [
                "1. Arrive on site and report to site manager...",
                "2. Set up exclusion zone...",
                "3. [Specific technical step]...",
                "4. [Specific technical step]...",
                "5. Tidy site and handover."
              ],
              "ppe": ["Safety Boots", "Hi-Vis", "Gloves"]
            }
          `
        }]
      }]
    };

    // --- 4. EXECUTE REQUEST ---
    const response = await fetch(generateUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "Google Error");

    let text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    // Clean the output to ensure it parses correctly
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return NextResponse.json(JSON.parse(text));

  } catch (error: any) {
    console.error("Backend Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
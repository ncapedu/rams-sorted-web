import { NextResponse } from "next/server";
import { HAZARD_DATA } from "../../lib/constants";

// ⚡ FORCE DYNAMIC: This prevents Vercel from "caching" the error.
// It forces the server to look for the API Key fresh every time you click.
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; 
export const maxDuration = 60; 

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const apiKey = process.env.GOOGLE_API_KEY;

    // DEBUGGING: Check Vercel Logs to see this
    if (!apiKey) {
      console.error("CRITICAL: Google API Key is missing from environment variables.");
      return NextResponse.json({ error: "Server Error: API Key Missing. Please redeploy on Vercel." }, { status: 500 });
    }

    // 1. Model Discovery (Finds the best model your key allows)
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
        
    // Safe Hazard Mapping
    // @ts-ignore
    const hazardInfo = (body.hazards || []).map(h => {
        // @ts-ignore
        const data = HAZARD_DATA[h];
        return data ? `${data.label}: Risk of ${data.risk}. Control: ${data.control}` : h;
    }).join("\n");

    // 3. The Strict Prompt
    const payload = {
      contents: [{
        parts: [{
          text: `
            ACT AS: Senior UK Health & Safety Consultant (NEBOSH).
            TASK: Generate a Site-Specific RAMS document.
            
            === PROJECT DETAILS ===
            TRADE: ${body.trade}
            JOB TYPE: ${body.jobType === 'Other (Custom)' ? body.customJobType : body.jobType}
            DESCRIPTION: ${body.jobDesc}
            SITE ADDRESS: ${body.siteAddress}
            CLIENT: ${body.clientName}
            
            === SAFETY CONTEXT ===
            HAZARDS SELECTED: 
            ${hazardInfo}
            
            SPECIFIC SAFETY CHECKS (YES/NO ANSWERS):
            ${answerList}
            
            EMERGENCY INFO:
            First Aider: ${body.firstAider}
            Hospital: ${body.hospital}
            Fire Assembly: ${body.fireAssembly}
            
            EXTRA NOTES:
            ${body.extraNotes}
            
            === INSTRUCTIONS ===
            1. METHOD STATEMENT: Write a clear, numbered, step-by-step guide suitable for operatives.
            2. RISK ASSESSMENT: Generate a row for each hazard. Calculate Initial Risk (High/Med) and Residual Risk (Low).
            3. COSHH: If hazards include dust, chemicals, or asbestos, create a COSHH entry.
            4. OUTPUT: Return ONLY valid JSON.
            
            === JSON STRUCTURE ===
            {
              "summary": "Executive summary of the works...",
              "risks": [
                {
                  "hazard": "Name",
                  "who": "Operatives / Public",
                  "control": "Specific control measure...",
                  "initial_risk": "High",
                  "risk_rating": "Low"
                }
              ],
              "method_steps": [
                "1. Arrive on site and sign in...",
                "2. Set up exclusion zone..."
              ],
              "ppe": ["Boots", "Gloves", "Hard Hat"],
              "coshh": [
                 {"substance": "Dust", "risk": "Inhalation", "control": "Mask", "disposal": "Skip"}
              ]
            }
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
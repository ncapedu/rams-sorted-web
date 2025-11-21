import { NextResponse } from "next/server";

export const runtime = 'nodejs'; 
export const maxDuration = 60; 

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) return NextResponse.json({ error: "API Key Missing" }, { status: 500 });

    // Model Discovery
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const listRes = await fetch(listUrl);
    const listData = await listRes.json();
    const validModel = listData.models?.find((m: any) => m.supportedGenerationMethods?.includes("generateContent") && !m.name.includes("vision"));
    const modelName = validModel ? validModel.name.replace("models/", "") : "gemini-pro";
    const generateUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    // THE EXTENDED PROMPT
    const payload = {
      contents: [{
        parts: [{
          text: `
            ACT AS: Senior UK Health & Safety Consultant.
            TASK: Generate RAMS JSON Data.
            
            PROJECT DETAILS:
            - Contractor: ${body.companyName} (Contact: ${body.contactName})
            - Client: ${body.clientName}
            - Site Address: ${body.siteAddress}
            - Trade: ${body.trade}
            - Job Type: ${body.jobType === 'Other' ? body.customJobType : body.jobType}
            - Description: ${body.jobDesc}
            - Operatives: ${body.operatives}
            - Start Date: ${body.startDate} (${body.duration})
            
            SAFETY CONTEXT:
            - Hazards Selected: ${body.hazards.join(', ')}
            - Emergency Info: First Aider: ${body.firstAider}, Hospital: ${body.hospital}
            - Specific Site Notes: ${body.extraNotes}
            
            INSTRUCTIONS:
            1. Create a detailed Method Statement for ${body.trade}.
            2. Include risk assessments for all selected hazards.
            3. Return ONLY valid JSON.
            
            JSON FORMAT:
            {
              "summary": "Executive summary...",
              "risks": [{"hazard": "Name", "who": "Operatives", "initial_risk": "High", "control": "Detailed measure...", "residual_risk": "Low"}],
              "method_steps": ["Step 1...", "Step 2..."],
              "ppe": ["Boots", "Gloves", "Hi-Vis"]
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
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return NextResponse.json(JSON.parse(text));

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
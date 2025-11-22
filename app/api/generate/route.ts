import { NextResponse } from "next/server";
import { HAZARD_DATA } from "../../lib/constants";

export const runtime = 'nodejs'; 
export const maxDuration = 60; 

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) return NextResponse.json({ error: "API Key Missing" }, { status: 500 });

    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const listRes = await fetch(listUrl);
    const listData = await listRes.json();
    const validModel = listData.models?.find((m: any) => m.supportedGenerationMethods?.includes("generateContent") && !m.name.includes("vision"));
    const modelName = validModel ? validModel.name.replace("models/", "") : "gemini-pro";
    const generateUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const answerList = Object.entries(body.answers || {}).map(([k, v]) => `${k}: ${v}`).join(", ");
    // @ts-ignore
    const hazardInfo = body.hazards.map(h => `${HAZARD_DATA[h]?.label}: ${HAZARD_DATA[h]?.control}`).join("\n");

    // Ensure custom job title is used if "Other" selected
    const jobTitle = body.jobType === 'Other (Custom)' ? body.customJobType : body.jobType;

    const payload = {
      contents: [{
        parts: [{
          text: `
            ACT AS: Senior UK Health & Safety Consultant.
            TASK: Generate professional RAMS JSON Data.
            
            PROJECT CONTEXT:
            - Contractor: ${body.companyName}
            - Client: ${body.clientName}
            - Trade: ${body.trade}
            - Job: ${jobTitle}
            - Description: ${body.jobDesc}
            - Hazards Selected: ${body.hazards.join(', ')}
            - Specific Checks: ${answerList}
            - Environment info: ${hazardInfo}
            
            INSTRUCTIONS:
            1. Method Statement: Write a clear, numbered, step-by-step guide (Text, not JSON array).
            2. Risk Assessment: Provide Initial Risk (High/Med) and Residual Risk (Low) for all hazards.
            3. Return ONLY valid JSON.
            
            JSON FORMAT:
            {
              "summary": "Executive summary...",
              "risks": [{"hazard": "Name", "who": "Operatives", "initial_risk": "High", "control": "Measure...", "risk_rating": "Low"}],
              "method_steps": "1. Arrive...\n2. Set up...\n3. Task...",
              "ppe": ["Boots", "Gloves"]
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
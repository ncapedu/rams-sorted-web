import { NextResponse } from "next/server";

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
    
    const validModel = listData.models?.find((m: any) => 
        m.supportedGenerationMethods?.includes("generateContent") && !m.name.includes("vision")
    );
    
    const modelName = validModel ? validModel.name.replace("models/", "") : "gemini-pro";
    const generateUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    // FORMAT THE SMART QUESTIONS FOR THE AI
    const smartAnswers = Object.entries(body.answers || {}).map(([key, val]) => `- ${key}: ${val}`).join("\n");

    const payload = {
      contents: [{
        parts: [{
          text: `
            ACT AS: Senior UK Health & Safety Consultant.
            TASK: Generate RAMS JSON Data.
            
            CONTEXT:
            - Contractor: ${body.company.name}
            - Client Type: ${body.job.clientType} (Adjust tone accordingly)
            - Trade: ${body.job.trade}
            - Job: ${body.job.desc}
            - Smart Checks: \n${smartAnswers}
            - Hazards: ${body.hazards.join(', ')}
            
            INSTRUCTIONS:
            - Calculate 'Initial Risk' (High/Med/Low) based on the hazard.
            - Define 'Control Measures'.
            - Calculate 'Residual Risk' (must be lower than Initial).
            - If Client is 'Direct', use simple language. If 'Subcontract', use formal language.
            
            JSON FORMAT:
            {
              "summary": "Executive summary...",
              "risks": [{"hazard": "Name", "who": "Operatives", "initial_risk": "High", "control": "Detailed measure...", "residual_risk": "Low"}],
              "method_steps": ["Step 1", "Step 2"],
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
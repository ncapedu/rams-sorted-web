import { NextResponse } from "next/server";

export const runtime = 'nodejs'; 
export const maxDuration = 60; 

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) return NextResponse.json({ error: "API Key Missing" }, { status: 500 });

    // 1. Model Discovery
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const listRes = await fetch(listUrl);
    const listData = await listRes.json();
    
    // Find the best available model (Flash or Pro)
    const validModel = listData.models?.find((m: any) => 
        m.supportedGenerationMethods?.includes("generateContent") && !m.name.includes("vision")
    );
    
    const modelName = validModel ? validModel.name.replace("models/", "") : "gemini-pro";
    const generateUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    // 2. The "Strict JSON" Prompt
    const payload = {
      contents: [{
        parts: [{
          text: `
            ACT AS: Senior UK Health & Safety Consultant.
            TASK: Generate RAMS data in strict JSON format.
            
            PROJECT CONTEXT:
            - Contractor: ${body.company.name}
            - Client: ${body.job.client} (${body.job.clientType})
            - Site Address: ${body.job.siteAddress}
            - Trade: ${body.job.trade}
            - Job: ${body.job.desc}
            - Hazards: ${body.hazards.join(', ')}
            - Environment: ${body.context.occupied ? "Occupied Property" : "Vacant Site"}, ${body.context.outdoor ? "Outdoor Work" : "Indoor Work"}.
            
            INSTRUCTIONS:
            1. Create a specific Method Statement for ${body.job.trade}.
            2. For each hazard, determine Initial Risk (High/Med), Control Measures, and Residual Risk (Low).
            3. Return ONLY valid JSON. No markdown formatting.
            
            JSON STRUCTURE:
            {
              "summary": "Executive summary string...",
              "risks": [
                {"hazard": "Hazard Name", "who": "Operatives/Public", "initial_risk": "High", "control": "Control measures...", "residual_risk": "Low"}
              ],
              "method_steps": ["Step 1...", "Step 2..."],
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
    
    // Clean the output to ensure it is pure JSON
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return NextResponse.json(JSON.parse(text));

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
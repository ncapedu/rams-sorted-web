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
    
    const validModel = listData.models?.find((m: any) => 
        m.supportedGenerationMethods?.includes("generateContent") && !m.name.includes("vision")
    );
    
    if (!validModel) return NextResponse.json({ error: "No AI Models found." }, { status: 500 });
    const modelName = validModel.name.replace("models/", "");

    // 2. Generate with Strict Structure
    const generateUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const payload = {
      contents: [{
        parts: [{
          text: `
            ACT AS: Senior UK Health & Safety Consultant.
            TASK: Generate a RAMS document data structure.
            
            PROJECT DETAILS:
            - Client: ${body.company}
            - Trade: ${body.trade}
            - Location/Address: ${body.address}
            - Description: ${body.job}
            - Extra Details: ${body.extraDetails}
            - Hazards Selected: ${body.hazards.join(', ')}
            
            REQUIREMENTS:
            - Cite UK regulations (BS 7671, CDM 2015, etc).
            - Risk Assessment must be detailed.
            
            OUTPUT FORMAT:
            You must return ONLY a valid JSON object with this exact structure:
            {
              "summary": "Executive summary text...",
              "regulations": ["Regulation 1", "Regulation 2"],
              "risks": [
                {"hazard": "Name of Hazard", "who": "Workers/Public", "control": "Control measure details...", "rating": "High/Med/Low"}
              ],
              "method_steps": ["Step 1: Arrive on site...", "Step 2: ..."],
              "ppe": ["Boots", "Hard Hat"]
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
    console.error("Server Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
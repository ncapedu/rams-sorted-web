import { NextResponse } from "next/server";

export const runtime = 'nodejs'; 
export const maxDuration = 60; 

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) return NextResponse.json({ error: "API Key Missing" }, { status: 500 });

    // 1. Find the best model (Model Hunter)
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const listRes = await fetch(listUrl);
    const listData = await listRes.json();
    
    // Try to find Flash or Pro, fallback to whatever works
    const validModel = listData.models?.find((m: any) => 
        m.supportedGenerationMethods?.includes("generateContent") && !m.name.includes("vision")
    );
    
    const modelName = validModel ? validModel.name.replace("models/", "") : "gemini-pro";
    const generateUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    // 2. Construct the Smart Prompt
    const payload = {
      contents: [{
        parts: [{
          text: `
            ACT AS: Senior UK Health & Safety Consultant.
            TASK: Generate RAMS JSON Data.
            
            PROJECT CONTEXT:
            - Contractor: ${body.company} (Contact: ${body.contact})
            - Client: ${body.client}
            - Site Address: ${body.siteAddress}
            - Trade: ${body.trade}
            - Job Type: ${body.job}
            - Hazards Selected: ${body.hazards.join(', ')}
            - Environment: ${body.context.occupied ? "Occupied Property" : "Vacant Site"}, ${body.context.outdoor ? "Outdoor Work" : "Indoor Work"}.
            
            INSTRUCTIONS:
            - Create a Method Statement specific to ${body.trade}.
            - Include specific risk controls for an ${body.context.occupied ? "Occupied" : "Unoccupied"} site.
            - Return ONLY valid JSON. Do not include markdown formatting like \`\`\`json.
            
            JSON FORMAT TO FOLLOW EXACTLY:
            {
              "summary": "Short executive summary of the works...",
              "risks": [{"hazard": "Name", "who": "Operatives/Public", "control": "Detailed control measure...", "rating": "High/Med/Low"}],
              "method_steps": ["Step 1: Arrive on site...", "Step 2: ..."],
              "ppe": ["Safety Boots", "Gloves"]
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
    
    // 3. Safety Clean the JSON (Prevents Crashes)
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return NextResponse.json(JSON.parse(text));

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
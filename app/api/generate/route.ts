import { NextResponse } from "next/server";
import { HAZARD_DATA, HazardKey } from "../../lib/constants";

export const runtime = 'nodejs'; 
export const maxDuration = 60; 

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) return NextResponse.json({ error: "API Key Missing" }, { status: 500 });

    // 🛡️ SAFETY CHECK: Prepare Hazard Details for AI
    // Only include hazards that actually exist in our dictionary to prevent crashes
    // @ts-ignore
    const hazardDetails = body.hazards.map((k: string) => {
        // @ts-ignore
        const h = HAZARD_DATA[k];
        if (!h) return ""; // Skip undefined hazards safely
        return `${h.label} (Risk: ${h.risk}, Control: ${h.control})`;
    }).filter(Boolean).join("\n"); // Remove empty strings

    // Model Discovery
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const listRes = await fetch(listUrl);
    const listData = await listRes.json();
    const validModel = listData.models?.find((m: any) => m.supportedGenerationMethods?.includes("generateContent") && !m.name.includes("vision"));
    const modelName = validModel ? validModel.name.replace("models/", "") : "gemini-pro";
    const generateUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

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
            - Job Type: ${body.jobType === 'Other (Custom)' ? body.customJobType : body.jobType}
            - Description: ${body.jobDesc}
            - Operatives: ${body.operatives}
            - Start Date: ${body.startDate} (${body.duration})
            
            SAFETY CONTEXT:
            - Hazards Selected: ${body.hazards.join(', ')}
            - Hazard Details provided: \n${hazardDetails}
            - Emergency Info: First Aider: ${body.firstAider}, Hospital: ${body.hospital}
            - Specific Site Notes: ${body.extraNotes}
            
            INSTRUCTIONS:
            1. Create a detailed Method Statement for ${body.trade}.
            2. Create a Risk Assessment Table. Use the hazard details provided to form the basis, but expand on them with site-specific context.
            3. Return ONLY valid JSON.
            
            JSON FORMAT:
            {
              "summary": "Executive summary...",
              "risks": [{"hazard": "Hazard Name", "who": "Operatives/Public", "initial_risk": "High/Med", "control": "Specific controls...", "residual_risk": "Low"}],
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
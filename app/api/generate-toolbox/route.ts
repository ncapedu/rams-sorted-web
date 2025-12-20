import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy-key",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      topic,
      date,
      location,
      supervisorName,
      audience,
      hazards,
      keyMessages,
      ppe,
      emergencyArrangements,
      attendanceConfig
    } = body;

    const systemPrompt = `
      You are an expert Health & Safety Consultant.
      Create a professional "Toolbox Talk" (safety briefing) based on the user's inputs.

      OUTPUT FORMAT:
      Return a JSON object with the following structure:
      {
        "title": "String (The main title of the talk)",
        "headerInfo": {
          "topic": "${topic}",
          "date": "${date}",
          "location": "${location}",
          "presenter": "${supervisorName}"
        },
        "introduction": "String (2-3 sentences introducing the topic and why it matters)",
        "hazardsSection": [
          { "hazard": "String (Name of hazard)", "description": "String (Brief explanation of risk)" }
        ],
        "controlsSection": [
          { "title": "String (Control measure title)", "description": "String (Actionable instruction)" }
        ],
        "emergencySection": "String (Clear instructions for emergencies, incorporating user input)",
        "keyMessagesSection": ["String", "String", "String"],
        "ppeSection": [
          { "item": "String (PPE Item)", "description": "String (Why it is needed)" }
        ],
        "attendeeNote": "String (A declaration statement for attendees to sign)"
      }

      INPUTS:
      - Topic: ${topic}
      - Audience: ${audience || "General Site Personnel"}
      - Hazards: ${hazards.join(", ")}
      - Key Messages: ${keyMessages}
      - PPE: ${ppe.join(", ")}
      - Emergency Info: ${emergencyArrangements}

      GUIDELINES:
      - Tone: Highly professional, authoritative, and detailed (suitable for legal compliance).
      - Content Depth: Provide comprehensive and specific details for every section. Avoid generic advice.
      - Hazards: List at least 3-5 specific hazards with detailed risk descriptions.
      - Controls: Provide specific, actionable, and technical control measures (hierarchy of controls).
      - Key Messages: **REFINE and ENHANCE** the user's key messages. Make them punchy, memorable, and safety-critical. Add important ones if missing.
      - PPE: **REFINE and ENHANCE** the user's PPE choices. List the specific PPE required and explain WHY (e.g., "Safety Glasses - to protect against flying debris"). Add mandatory PPE if missing for this task.
      - Emergency: detailed emergency procedures specific to the topic (e.g., rescue plan for height, spill kit for COSHH).
      - Ensure the output is substantial and demonstrates a high standard of safety management.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Generate the toolbox talk." },
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error("No content generated");

    return NextResponse.json(JSON.parse(content));

  } catch (error) {
    console.error("Error generating toolbox talk:", error);
    return NextResponse.json(
      { error: "Failed to generate toolbox talk" },
      { status: 500 }
    );
  }
}

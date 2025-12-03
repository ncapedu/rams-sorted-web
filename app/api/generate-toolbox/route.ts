import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
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
      - Tone: Professional, clear, and authoritative but accessible.
      - Focus on practical safety instructions.
      - Ensure the "controlsSection" provides specific mitigations for the listed hazards.
      - If "hazards" list is empty, infer standard hazards for the topic.
      - "keyMessagesSection" should reinforce the user's key messages plus standard best practices.
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

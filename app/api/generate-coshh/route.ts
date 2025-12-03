import OpenAI from "openai";
import { NextResponse } from "next/server";
import { COSHHData } from "../../lib/rams-generation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const apiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
    apiKey: apiKey ?? "",
});

export async function POST(req: Request) {
    try {
        if (!apiKey) {
            return NextResponse.json(
                { error: "Server config error: OPENAI_API_KEY missing." },
                { status: 500 }
            );
        }

        const body = await req.json();

        // We will use AI to enhance the descriptions to make them more professional
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You are a Health & Safety Consultant. Review the provided COSHH assessment details.
          Your task is to REWRITE the "additionalControls", "emergencyProcedures", "exposureRoutes", "storageDisposal", and "controlMeasures" to be DETAILED, PROFESSIONAL, and COMPREHENSIVE.

          GUIDELINES:
          1. **Exposure Routes**: List ALL relevant routes (Inhalation, Skin, Eye, Ingestion) and explain briefly for each (3-5 sentences total).
          2. **Control Measures**: Provide a robust mix of Engineering, Administrative, and PPE controls. Reference the hierarchy of control. (Approx 100-150 words).
          3. **Storage & Disposal**: Specify storage conditions (temp, ventilation, segregation) and disposal (hazardous waste, no drains). (Approx 50-80 words).
          4. **Additional Controls**: Suggest supplementary controls like training, supervision, monitoring, signage. (Approx 50-80 words).
          5. **Emergency Procedures**: Actionable steps for Spills, Fire, and Exposure (First Aid). Bullet points are good.

          OUTPUT JSON: { 
            "workActivity": "...", 
            "exposureRoutes": "...", 
            "controlMeasures": "...", 
            "storageDisposal": "...", 
            "additionalControls": "...", 
            "emergencyProcedures": "..." 
          }
          
          Return PLAIN TEXT strings for the values. Do not use markdown formatting inside the JSON strings.`
                },
                {
                    role: "user",
                    content: `
            Activity: ${body.workActivity}
            Controls: ${body.additionalControls}
            Emergency: ${body.emergencyProcedures}
            Substances: ${body.selectedSubstances.map((s: any) => s.name).join(", ")}
            Duration: ${body.exposureDuration}
            Frequency: ${body.exposureFrequency}
          `
                }
            ],
            response_format: { type: "json_object" },
            temperature: 0.4,
        });

        const enhanced = JSON.parse(completion.choices[0].message.content || "{}");

        const coshhData: COSHHData = {
            ...body,
            workActivity: enhanced.workActivity || body.workActivity,
            exposureRoutes: enhanced.exposureRoutes || "Inhalation, Skin Contact, Eye Contact. Ensure good ventilation and use PPE.",
            controlMeasures: enhanced.controlMeasures || "Use appropriate PPE and ensure ventilation.",
            storageDisposal: enhanced.storageDisposal || "Store in cool, dry place. Dispose of as hazardous waste.",
            additionalControls: enhanced.additionalControls || body.additionalControls,
            emergencyProcedures: enhanced.emergencyProcedures || body.emergencyProcedures,
        };

        return NextResponse.json({ data: coshhData });

    } catch (err: any) {
        console.error("COSHH API Error:", err);
        return NextResponse.json(
            { error: "Failed to generate COSHH assessment", details: err.message },
            { status: 500 }
        );
    }
}

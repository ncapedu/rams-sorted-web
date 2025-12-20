import OpenAI from "openai";
import { NextResponse } from "next/server";
import { COSHHData } from "../../lib/rams-generation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const apiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "dummy-key",
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
        const allSubstances = [
            ...(body.selectedSubstances || []),
            ...(body.customSubstances || [])
        ];

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You are a Health & Safety Consultant. Review the provided COSHH assessment details.
          Your task is to enhance the assessment by providing specific details FOR EACH SUBSTANCE, as well as general controls.

          GUIDELINES:
          1. **Per Substance Details**: For each substance provided, generate:
             - **Exposure Routes**: Specific routes (Inhalation, Skin, etc.) and brief explanation (e.g. "Inhalation of vapors may cause dizziness").
             - **Control Measures**: Specific controls for that substance (PPE, Engineering, Handling).
             - **Storage & Disposal**: Specific storage (temp, container, ventilation) and disposal methods.
             - **Risk Level**: "High", "Medium", or "Low" based on the hazard.
             - **Hazard**: A concise description of the hazard (e.g. "Flammable liquid", "Irritant to eyes").
             
             *CRITICAL*: Ensure these details are UNIQUE and SPECIFIC for each substance. Avoid generic templates.

          2. **General Sections**:
             - **Additional Controls**: Supplementary controls for the whole task (training, supervision).
             - **Emergency Procedures**: Actionable steps for Spills, Fire, and Exposure.
             - **Work Activity**: A professional description of the work activity.

          OUTPUT JSON: {
            "substances": [
              {
                "name": "Substance Name (must match input)",
                "hazard": "...",
                "exposureRoutes": "...",
                "controlMeasures": "...",
                "storageDisposal": "...",
                "riskLevel": "..."
              }
            ],
            "workActivity": "...",
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
            Substances: ${allSubstances.map((s: any) => s.name).join(", ")}
            Duration: ${body.exposureDuration}
            Frequency: ${body.exposureFrequency}
          `
                }
            ],
            response_format: { type: "json_object" },
            temperature: 0.4,
        });

        const enhanced = JSON.parse(completion.choices[0].message.content || "{}");

        // Map enhanced substances back to the original list or use them directly
        // We'll try to match by name to preserve any other data, but here we mainly want the enhanced fields.
        const enhancedSubstancesMap = new Map(enhanced.substances?.map((s: any) => [s.name.toLowerCase(), s]));

        const enhanceSubstanceList = (list: any[]) => {
            return list.map((s: any) => {
                const enhancedSub = enhancedSubstancesMap.get(s.name.toLowerCase());
                if (enhancedSub) {
                    return {
                        ...s,
                        hazard: (enhancedSub as any).hazard || s.hazard,
                        control: (enhancedSub as any).controlMeasures || s.control, // Map controlMeasures to control
                        exposureRoutes: (enhancedSub as any).exposureRoutes,
                        storage: (enhancedSub as any).storageDisposal, // Map storageDisposal to storage
                        riskLevel: (enhancedSub as any).riskLevel
                    };
                }
                return s;
            });
        };

        const coshhData: COSHHData = {
            ...body,
            selectedSubstances: enhanceSubstanceList(body.selectedSubstances || []),
            customSubstances: enhanceSubstanceList(body.customSubstances || []),
            workActivity: enhanced.workActivity || body.workActivity,
            // These global fields might still be used if we want to show a summary, but the table now uses per-substance data.
            // We can keep them as fallbacks or general sections.
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

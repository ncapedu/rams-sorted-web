import OpenAI from "openai";
import { NextResponse } from "next/server";
import { generateCOSHHHTML, COSHHData } from "../../lib/rams-generation";

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
          Your task is to REWRITE the "additionalControls" and "emergencyProcedures" to be OPERATIONAL and ACTIONABLE.
          
          GUIDELINES:
          1. Avoid generic corporate language (e.g. "implement comprehensive measures").
          2. Use short, punchy bullet points (3-5 per section).
          3. Tie directly to the specific substances/hazards listed.
             - Example (Dust): "Stop work and move away if dust clouds form despite controls; check water suppression."
             - Example (Acid): "If acid contacts skin/eyes, flush immediately for 15 mins and seek medical attention."
          4. Return PLAIN TEXT lines separated by newlines. DO NOT use bullet characters (-, •, *) in the output string, as the frontend adds them.
          
          OUTPUT JSON: { "workActivity": "...", "additionalControls": "...", "emergencyProcedures": "..." }`
                },
                {
                    role: "user",
                    content: `
            Activity: ${body.workActivity}
            Controls: ${body.additionalControls}
            Emergency: ${body.emergencyProcedures}
            Substances: ${body.selectedSubstances.map((s: any) => s.name).join(", ")}
          `
                }
            ],
            response_format: { type: "json_object" },
            temperature: 0.3,
        });

        const enhanced = JSON.parse(completion.choices[0].message.content || "{}");

        const coshhData: COSHHData = {
            ...body,
            workActivity: enhanced.workActivity || body.workActivity,
            additionalControls: enhanced.additionalControls || body.additionalControls,
            emergencyProcedures: enhanced.emergencyProcedures || body.emergencyProcedures,
        };

        const html = generateCOSHHHTML(coshhData);

        return NextResponse.json({ html });

    } catch (err: any) {
        console.error("COSHH API Error:", err);
        return NextResponse.json(
            { error: "Failed to generate COSHH assessment", details: err.message },
            { status: 500 }
        );
    }
}

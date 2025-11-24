// app/lib/ai.ts
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: apiKey || "dummy-key",
});

export async function generateRamsContent(data: any) {
  if (!apiKey) {
    console.error(">> AI SERVICE ERROR: OPENAI_API_KEY is missing.");
    throw new Error("API Key Missing");
  }

  console.log(">> AI SERVICE: Generating detailed content for", data.jobType);

  const systemPrompt = `
    You are a Senior Chartered Health & Safety Consultant (CMIOSH) with 25 years of experience in UK Construction.
    Your task is to write a "Site-Specific Risk Assessment & Method Statement" (RAMS) that is legally robust, highly detailed, and professional.

    TONE: Authoritative, technical, specific, and concise.
    AVOID: Generic fluff like "work safely" or "use PPE" without context.

    HARD RULES:
    - Output STRICT JSON only. No markdown, no code fences, no comments.
    - Do NOT insert decorative spacing inside words or names.
      - Wrong: "E T H E M"
      - Correct: "Ethem"
    - No bullet lists in the text. Use compact paragraphs only.
    - "summary" ~3–4 sentences, max ~150 words.
    - Each method step 3–5 sentences, typically 80–150 words.
  `;

  const userPrompt = `
    Generate the specific content for this project:

    --- PROJECT DATA ---
    Activity: ${data.jobType} (Trade: ${data.trade})
    Client Name: ${data.clientName}
    Site Address: ${data.siteAddress}

    STANDARD PROCESS (textbook description of how this job is normally done):
    ${data.jobDesc}

    SPECIFIC SITE CONSTRAINTS / USER NOTES:
    ${data.customDescription || "None provided. Assume standard domestic/light commercial conditions."}

    IDENTIFIED HAZARDS:
    ${data.hazards && data.hazards.length ? data.hazards.join(", ") : "Standard construction risks"}

    --- OUTPUT REQUIREMENTS ---
    Return a SINGLE JSON OBJECT. No markdown. No headings.

    1. summary
       - 3–4 sentence executive summary.
       - Must mention:
         - The Client name.
         - The Site address.
         - Nature of the work (Activity + Trade).
       - If notes are provided, mention how they are handled (access, live services, occupied premises, etc).

    2. method_steps
       - Exactly 4 elements in the array.
       - Each is a full paragraph (3–5 sentences), no bullet points.

       5.1 PRE-COMMENCEMENT:
       - Start with arrival at "${data.siteAddress}", sign-in with "${data.clientName}", review RAMS, and dynamic risk assessment.
       - Mention checking permits, isolations, and site rules.

       5.2 SAFE SYSTEM OF WORK:
       - Describe the safety setup for ${data.trade} during ${data.jobType}.
       - Include service isolation, barriers, signage, and coordination with other trades/occupiers.

       5.3 EXECUTION OF WORKS:
       - Combine the STANDARD PROCESS with the USER NOTES.
       - Describe sequence: access, preparation, main installation/repair, inspections, adjustments.
       - Tie back to the hazards identified (e.g. dust, WAH, lifting).

       5.4 COMPLETION & HANDOVER:
       - Describe testing/commissioning (electrical tests, pressure tests, leak checks etc).
       - Clearing waste, removing protections/barriers, reinstating services.
       - Final handover and sign-off with "${data.clientName}".

    3. coshh
       - Single object for the primary hazardous substance.

       Fields:
       - substance: Name of the substance (e.g. "Respirable crystalline silica (construction dust)").
       - risk: 1–2 sentences on health effects and exposure route.
       - control: 1–2 sentences with specific control measures.
       - disposal: 1–2 sentences on containment and disposal.

    --- EXPECTED JSON FORMAT ---
    {
      "summary": "...",
      "method_steps": [
        "5.1 PRE-COMMENCEMENT: ...",
        "5.2 SAFE SYSTEM OF WORK: ...",
        "5.3 EXECUTION OF WORKS: ...",
        "5.4 COMPLETION & HANDOVER: ..."
      ],
      "coshh": [
        { "substance": "...", "risk": "...", "control": "...", "disposal": "..." }
      ]
    }
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const content = completion.choices[0].message.content;
  if (!content) throw new Error("OpenAI returned empty response");

  return JSON.parse(content);
}
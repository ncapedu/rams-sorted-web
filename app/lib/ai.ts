import OpenAI from "openai";

// Initialize OpenAI Client
const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: apiKey || "dummy-key", // Prevents build crash if key is missing
});

export async function generateRamsContent(data: any) {
  // 1. Security Check
  if (!apiKey) {
    console.error(">> AI SERVICE ERROR: OPENAI_API_KEY is missing.");
    throw new Error("API Key Missing");
  }

  console.log(">> AI SERVICE: Generating with OpenAI for", data.jobType);

  // 2. The Prompt
  const systemPrompt = "You are a Chartered Health & Safety Consultant (CMIOSH) for the UK Construction Industry. You output strictly valid JSON.";
  
  const userPrompt = `
    TASK: Generate specific content for a RAMS document.
    
    PROJECT DATA:
    - Activity: ${data.jobType}
    - Client: ${data.clientName}
    - Site Address: ${data.siteAddress}
    - Standard Process: ${data.jobDesc}
    - Specific Constraints: ${data.customDescription || "None"}
    - Hazards: ${data.hazards ? data.hazards.join(", ") : "Standard risks"}

    REQUIREMENTS:
    1. Method Statement: Write 4 specific steps (5.1 to 5.4).
    2. CRITICAL: You MUST include the phrase "at ${data.siteAddress}" in Step 5.1.
    3. CRITICAL: You MUST mention "${data.clientName}" in Step 5.4.
    4. COSHH: Select the most relevant hazardous substance for ${data.jobType}.

    OUTPUT FORMAT (JSON ONLY):
    {
      "summary": "Professional summary...",
      "method_steps": [
         "5.1 PRE-START: Detailed arrival instructions...",
         "5.2 SAFETY: Isolation and safety setup...",
         "5.3 EXECUTION: Technical steps...",
         "5.4 COMPLETION: Handover instructions..."
      ],
      "coshh": [
         { "substance": "Material Name", "risk": "Health Risk", "control": "Control Measure", "disposal": "Disposal Route" }
      ]
    }
  `;

  // 3. Execution (GPT-4o-mini is fast and cheap)
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini", 
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" }, // GUARANTEES valid JSON
  });

  // 4. Parse Result
  const content = completion.choices[0].message.content;
  if (!content) throw new Error("OpenAI returned empty response");

  return JSON.parse(content);
}
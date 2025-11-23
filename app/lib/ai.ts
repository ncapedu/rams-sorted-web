import OpenAI from "openai";

// Initialize OpenAI Client
const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: apiKey || "dummy-key", 
});

export async function generateRamsContent(data: any) {
  // 1. Security Check
  if (!apiKey) {
    console.error(">> AI SERVICE ERROR: OPENAI_API_KEY is missing.");
    throw new Error("API Key Missing");
  }

  console.log(">> AI SERVICE: Generating detailed content for", data.jobType);

  // 2. The "Senior Consultant" Prompt
  const systemPrompt = `
    You are a Senior Chartered Health & Safety Consultant (CMIOSH) with 25 years of experience in UK Construction.
    Your task is to write a "Site-Specific Risk Assessment & Method Statement" (RAMS) that is legally robust, highly detailed, and professional.
    
    TONE: Authoritative, Technical, Specific, and Comprehensive.
    AVOID: Generic phrases like "work safely" or "use PPE" without context. Be specific.
  `;
  
  const userPrompt = `
    Generate the specific content for this project:

    --- PROJECT DATA ---
    Activity: ${data.jobType} (Trade: ${data.trade})
    Client Name: ${data.clientName}
    Site Address: ${data.siteAddress}
    
    STANDARD PROCESS (The textbook way to do this job):
    ${data.jobDesc}

    SPECIFIC SITE CONSTRAINTS / USER NOTES (CRITICAL - YOU MUST INCORPORATE THESE):
    ${data.customDescription || "None provided. Assume standard site conditions."}

    IDENTIFIED HAZARDS:
    ${data.hazards ? data.hazards.join(", ") : "Standard construction risks"}

    --- OUTPUT REQUIREMENTS ---
    Return a SINGLE JSON OBJECT. No markdown. No code blocks.
    
    1. **summary**: A robust, 3-4 sentence Executive Summary. It must mention the Client, the Address, and the specific nature of the work. If there are user notes, mention how they will be handled.
    
    2. **method_steps**: An array of 4 strings. Each string must be a detailed PARAGRAPH (3-5 sentences) describing that stage of work.
       - **Step 5.1 (Pre-Start):** Describe arrival at "${data.siteAddress}", signing in with "${data.clientName}", site induction, and dynamic risk assessment.
       - **Step 5.2 (Safety & Isolation):** Describe the specific safety setup for ${data.trade} work (e.g., LOTO for sparks, Water shut-off for plumbers). Mention specific exclusion zones.
       - **Step 5.3 (Execution):** This is the core. Combine the "Standard Process" with the "User Notes". Describe the technical installation/repair process in detail. If the user said "Park in Bay 4", mention it here.
       - **Step 5.4 (Completion):** Describe the testing procedure (e.g., Dead testing, Pressure testing), cleaning the work area, waste removal, and formal handover to "${data.clientName}".

    3. **coshh**: An array containing ONE object for the primary hazardous substance (e.g., Silica Dust, Solder Fumes, PVC Cement).
       - **substance**: Name of the substance.
       - **risk**: Detailed health effects (e.g., "Inhalation causing long-term lung damage/Silicosis").
       - **control**: Specific controls (e.g., "M-Class extraction, FFP3 Face Fit Mask, Damping down").
       - **disposal**: Specific disposal method (e.g., "Double bagged in heavy-duty polythene").

    --- EXPECTED JSON FORMAT ---
    {
      "summary": "...",
      "method_steps": [
        "5.1 PRE-COMMENCEMENT: ...text...",
        "5.2 SAFE SYSTEM OF WORK: ...text...",
        "5.3 EXECUTION OF WORKS: ...text...",
        "5.4 COMPLETION & HANDOVER: ...text..."
      ],
      "coshh": [
        { "substance": "...", "risk": "...", "control": "...", "disposal": "..." }
      ]
    }
  `;

  // 3. Execution
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini", 
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" }, // GUARANTEES valid JSON
    temperature: 0.7, // Slightly creative to make it sound human/professional
  });

  // 4. Parse Result
  const content = completion.choices[0].message.content;
  if (!content) throw new Error("OpenAI returned empty response");

  return JSON.parse(content);
}
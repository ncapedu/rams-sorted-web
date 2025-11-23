import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini safely
const apiKey = process.env.GOOGLE_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function generateRamsContent(data: any) {
  // 1. Validation
  if (!apiKey) {
    console.error(">> AI SERVICE ERROR: API Key missing.");
    throw new Error("API Key Missing");
  }

  // 2. The Super-Prompt
  const prompt = `
    ACT AS: A Chartered Health & Safety Consultant (CMIOSH).
    TASK: Generate specific content for a UK Construction RAMS document.
    
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

    OUTPUT JSON ONLY (No Markdown):
    {
      "summary": "Professional summary of works...",
      "method_steps": [
         { "t": "5.1 PRE-START", "d": "Arrival instructions..." },
         { "t": "5.2 SAFETY", "d": "Isolation/Safety setup..." },
         { "t": "5.3 EXECUTION", "d": "Technical steps for ${data.jobType}..." },
         { "t": "5.4 COMPLETION", "d": "Handover instructions..." }
      ],
      "coshh": [
         { "substance": "Material Name", "risk": "Health Risk", "control": "Control Measure", "disposal": "Disposal Route" }
      ]
    }
  `;

  // 3. Execution
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  // 4. Cleaning
  const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
  
  return JSON.parse(cleanedText);
}
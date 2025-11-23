// app/api/generate/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// --- 1. CONFIGURATION & SETUP ---
// We initialize the AI client outside the handler for performance
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

// Define the model to use (Flash is fast, Pro is smarter - Flash is good for this)
const MODEL_NAME = "gemini-1.5-flash"; 

// --- 2. UTILITY: JSON CLEANER ---
// AI sometimes wraps code in ```json ... ``` blocks. This strips them.
function cleanAiOutput(text: string): string {
  let cleaned = text.trim();
  // Remove markdown code blocks
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json/, "").replace(/```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```/, "").replace(/```$/, "");
  }
  return cleaned.trim();
}

// --- 3. THE API HANDLER ---
export async function POST(req: Request) {
  console.log(">> [API] Request received. Starting AI generation sequence...");

  try {
    // A. Parse Incoming Data
    const body = await req.json();
    const { 
      trade, 
      jobType, 
      jobDesc, // The "Standard" description from constants
      hazards, 
      clientName, 
      siteAddress, 
      customDescription // The user's specific notes
    } = body;

    // B. Validation
    if (!process.env.GOOGLE_API_KEY) {
      console.error("!! [API] CRITICAL ERROR: GOOGLE_API_KEY is missing.");
      // Fail gracefully so the frontend doesn't crash
      return NextResponse.json({ 
        error: "Server Misconfiguration", 
        fallback: true 
      }, { status: 500 });
    }

    // C. CONSTRUCT THE "SUPER PROMPT"
    // This is the "brain" that forces the specific, tailored output.
    const systemInstruction = `
      YOU ARE: A Chartered Health & Safety Consultant (CMIOSH) with 20 years of experience in UK Construction.
      YOUR TASK: Draft the specific technical content for a Risk Assessment & Method Statement (RAMS) document.
      
      COMPLIANCE STANDARD: 
      - Health and Safety at Work Act 1974
      - Construction (Design and Management) Regulations 2015 (CDM 2015)
      - COSHH Regulations 2002
    `;

    const userPrompt = `
      PROJECT DETAILS:
      - Trade Contractor: ${trade}
      - Task / Activity: ${jobType}
      - Client Name: ${clientName}
      - Site Address: ${siteAddress}
      - Standard Procedure: ${jobDesc}
      - Specific Site Constraints (CRITICAL): ${customDescription || "None provided"}
      - Identified Hazards: ${hazards && hazards.length > 0 ? hazards.join(", ") : "Standard site risks"}

      INSTRUCTIONS FOR GENERATION:
      1. **Method Statement (5.1 - 5.4):** - You MUST write 4 distinct, chronological steps.
         - **CRITICAL:** You MUST explicitly mention the site address "${siteAddress}" in Step 5.1.
         - **CRITICAL:** You MUST explicitly mention the client "${clientName}" in Step 5.4.
         - Step 5.2 (Isolation) must be specific to ${trade} safety protocols (e.g., Lock-Out Tag-Out for electricians, Water isolation for plumbers).
         - Incorporate the "Specific Site Constraints" into the execution step (5.3) if provided.

      2. **COSHH Assessment:**
         - Identify the single most relevant hazardous substance for this specific task (e.g., Silica Dust for drilling, Solder Fumes for plumbing, PVC Cement for pipework).
         - Provide real, specific medical risks and controls.

      3. **Summary:**
         - Write a professional 2-sentence executive summary of the work.

      OUTPUT FORMAT:
      You must return STRICT VALID JSON. Do not include markdown.
      {
        "summary": "String...",
        "method_steps": [
          { "t": "5.1 PRE-COMMENCEMENT & SITE SETUP", "d": "Detailed paragraph..." },
          { "t": "5.2 SAFE ISOLATION & PERMITS", "d": "Detailed paragraph..." },
          { "t": "5.3 EXECUTION OF WORKS", "d": "Detailed paragraph..." },
          { "t": "5.4 COMPLETION & HANDOVER", "d": "Detailed paragraph..." }
        ],
        "coshh": [
          { 
            "substance": "Material Name", 
            "risk": "Specific Health Hazard", 
            "control": "Specific Control Measure", 
            "disposal": "Disposal Method" 
          }
        ]
      }
    `;

    // D. EXECUTE AI GENERATION
    console.log(`>> [API] Sending prompt to Google Gemini (${MODEL_NAME})...`);
    
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
    // We combine system and user prompts for better context
    const result = await model.generateContent(systemInstruction + "\n\n" + userPrompt);
    const response = await result.response;
    const rawText = response.text();

    console.log(">> [API] Received response from AI. Processing...");

    // E. PARSE & VALIDATE
    const cleanJsonString = cleanAiOutput(rawText);
    
    let structuredData;
    try {
      structuredData = JSON.parse(cleanJsonString);
      console.log(">> [API] JSON Parsed successfully.");
    } catch (parseError) {
      console.error("!! [API] JSON Parsing Failed. Raw text:", rawText);
      // If AI fails to give JSON, we throw to trigger the catch block below
      throw new Error("Invalid JSON response from AI");
    }

    // F. SUCCESS RESPONSE
    return NextResponse.json(structuredData);

  } catch (error: any) {
    // G. ROBUST ERROR HANDLING
    console.error("!! [API] UNEXPECTED ERROR:", error);
    
    // Return a fallback structure so the Frontend PDF engine doesn't break
    // This ensures the user ALWAYS gets a document, even if the AI is down.
    return NextResponse.json({
      summary: "Standard works to be carried out in accordance with industry guidelines.",
      method_steps: [
        { t: "5.1 PRE-START", d: "Arrive on site, sign in, and review risks." },
        { t: "5.2 SAFETY", d: "Ensure work area is safe and isolated." },
        { t: "5.3 EXECUTION", d: "Carry out works as per standard practice." },
        { t: "5.4 COMPLETION", d: "Tidy up and handover to client." }
      ],
      coshh: [
        { substance: "Dust/Debris", risk: "Inhalation", control: "Masks", disposal: "Skip" }
      ]
    }, { status: 200 }); // We return 200 OK with fallback data to keep UX smooth
  }
}
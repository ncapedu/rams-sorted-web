import { NextResponse } from "next/server";

export const runtime = 'edge'; 

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Server Error: API Key Missing" }, { status: 500 });
    }

    // 1. DEFINE OUR PREFERRED MODELS
    // We try these in order. If Flash fails, we look for what IS available.
    let selectedModel = "gemini-1.5-flash";

    // 2. HELPER: FUNCTION TO CALL GOOGLE
    async function generateWithModel(modelName: string) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      
      const payload = {
        contents: [{
          parts: [{
            text: `
              ACT AS: Senior UK Health & Safety Consultant.
              CLIENT: ${body.company} (${body.trade}).
              JOB DESCRIPTION: ${body.job}.
              HAZARDS IDENTIFIED: ${body.hazards.join(', ')}.
              OUTPUT: Professional RAMS document text only.
            `
          }]
        }]
      };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      return response;
    }

    // 3. ATTEMPT 1: TRY FLASH (Fastest)
    let response = await generateWithModel(selectedModel);

    // 4. IF 404 (NOT FOUND), ASK GOOGLE WHAT IS AVAILABLE
    if (response.status === 404) {
      console.log("Flash not found. Listing available models...");
      
      const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
      const listRes = await fetch(listUrl);
      const listData = await listRes.json();

      if (listData.models) {
        // Find the first model that supports 'generateContent'
        const validModel = listData.models.find((m: any) => 
          m.supportedGenerationMethods.includes("generateContent")
        );

        if (validModel) {
          // Extract clean name (e.g., "models/gemini-pro" -> "gemini-pro")
          selectedModel = validModel.name.replace("models/", "");
          console.log(`Found valid model: ${selectedModel}. Retrying...`);
          
          // RETRY with the found model
          response = await generateWithModel(selectedModel);
        } else {
          throw new Error("No valid generation models found for this API Key.");
        }
      }
    }

    const data = await response.json();

    // 5. HANDLE FINAL ERRORS
    if (!response.ok) {
      return NextResponse.json(
        { error: `Google Error (${selectedModel}): ${data.error?.message}` }, 
        { status: 500 }
      );
    }

    // 6. SUCCESS
    const text = data.candidates[0].content.parts[0].text;
    return NextResponse.json({ text });

  } catch (error: any) {
    console.error("Critical Error:", error);
    return NextResponse.json(
      { error: error.message || "Generation Failed" }, 
      { status: 500 }
    );
  }
}
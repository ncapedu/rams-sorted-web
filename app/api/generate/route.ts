import { NextResponse } from "next/server";
import { generateRamsContent } from "@/app/lib/ai"; // Importing the brain

// Force dynamic to prevent Vercel caching
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    console.log(">> [NEW ROUTE] Received request");
    const body = await req.json();

    // Call the detached AI service
    const aiData = await generateRamsContent(body);

    console.log(">> [NEW ROUTE] AI Success");
    return NextResponse.json(aiData);

  } catch (error: any) {
    console.error(">> [NEW ROUTE] Error:", error.message);
    
    // If AI fails (e.g. no key), return null so frontend knows to use fallback
    // We do NOT return a 500 here, we return a clean 200 with null data 
    // to let the frontend handle the fallback gracefully.
    return NextResponse.json({ 
      error: "AI Generation Failed", 
      fallback: true 
    });
  }
}
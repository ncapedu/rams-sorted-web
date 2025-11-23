import { NextResponse } from "next/server";
import { generateRamsContent } from "@/app/lib/ai"; 

// Force dynamic to prevent Vercel caching
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    console.log(">> [API ROUTE] Request Received");
    const body = await req.json();

    // Call the isolated OpenAI service
    const aiData = await generateRamsContent(body);

    console.log(">> [API ROUTE] Success");
    return NextResponse.json(aiData);

  } catch (error: any) {
    console.error(">> [API ROUTE] Error:", error.message);
    
    // Return a clean error state so the frontend knows to use fallback
    return NextResponse.json({ 
      error: "AI Generation Failed", 
      details: error.message,
      fallback: true 
    });
  }
}
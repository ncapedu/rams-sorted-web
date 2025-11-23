import { NextResponse } from "next/server";
import { generateRamsContent } from "@/app/lib/ai"; 

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Pass everything to the Brain
    const aiData = await generateRamsContent(body);

    return NextResponse.json(aiData);

  } catch (error: any) {
    console.error(">> API ERROR:", error.message);
    return NextResponse.json({ 
      error: "AI Generation Failed", 
      details: error.message,
      fallback: true 
    });
  }
}
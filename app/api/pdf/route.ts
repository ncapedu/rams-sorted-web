import { NextRequest, NextResponse } from "next/server";
import { launchBrowser } from "@/lib/pdf/launchBrowser";

export const runtime = "nodejs"; // CRITICAL: Puppeteer only works on Node runtime
export const maxDuration = 60; // Increase duration for PDF generation

export async function POST(req: NextRequest) {
    try {
        const { html } = await req.json();

        if (!html) {
            return new NextResponse("Missing HTML content", { status: 400 });
        }

        const browser = await launchBrowser();
        const page = await browser.newPage();

        // Set content directly since we don't have a server-side DB to fetch by ID
        // and localStorage is not accessible to the server-side browser.
        await page.setContent(html, {
            waitUntil: "networkidle0",
            timeout: 30000,
        });

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
                top: "10mm",
                right: "10mm",
                bottom: "10mm",
                left: "10mm",
            },
        });

        await browser.close();

        return new NextResponse(Buffer.from(pdfBuffer), {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": 'attachment; filename="RAMS_Pack.pdf"',
            },
        });
    } catch (err) {
        console.error("PDF generation error:", err);
        return new NextResponse("Failed to generate PDF", { status: 500 });
    }
}

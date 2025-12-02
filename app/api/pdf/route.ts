import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

interface Api2PdfResponse {
    FileUrl?: string;
    Success?: boolean;
    Error?: string | null;
}

export async function POST(req: NextRequest) {
    try {
        const { html } = await req.json();

        if (!html) {
            return new NextResponse("Missing HTML content", { status: 400 });
        }

        const apiKey = process.env.A2P_API_KEY;
        if (!apiKey) {
            console.error("A2P_API_KEY missing");
            return new NextResponse("Server PDF config error: A2P_API_KEY missing", { status: 500 });
        }

        console.log("[PDF] Generating via Api2Pdf (HTML mode)");

        // Call Api2Pdf Chrome HTML endpoint
        // We use /chrome/html because we have the raw HTML from the client (localStorage data)
        const a2pRes = await fetch("https://v2018.api2pdf.com/chrome/html", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: apiKey,
            },
            body: JSON.stringify({
                html: html,
                options: {
                    printBackground: true,
                    marginTop: "10mm",
                    marginBottom: "10mm",
                    marginLeft: "10mm",
                    marginRight: "10mm",
                    format: "A4"
                },
            }),
        });

        if (!a2pRes.ok) {
            const text = await a2pRes.text();
            console.error("Api2Pdf HTTP error:", a2pRes.status, text);
            return new NextResponse(`Failed to call PDF service: ${text}`, { status: 502 });
        }

        const data = (await a2pRes.json()) as Api2PdfResponse;

        if (!data.Success || !data.FileUrl) {
            console.error("Api2Pdf logical error:", data);
            return new NextResponse(`PDF service error: ${JSON.stringify(data)}`, { status: 502 });
        }

        // Download the generated PDF from FileUrl
        const pdfRes = await fetch(data.FileUrl);
        if (!pdfRes.ok) {
            console.error("Failed to download PDF from Api2Pdf:", pdfRes.status);
            return new NextResponse("Failed to fetch generated PDF", {
                status: 502,
            });
        }

        const pdfArrayBuffer = await pdfRes.arrayBuffer();
        const pdfBuffer = Buffer.from(pdfArrayBuffer);

        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": 'attachment; filename="RAMS_Pack.pdf"',
            },
        });
    } catch (error: any) {
        console.error("PDF generation error:", error);
        return new NextResponse(
            "Failed to generate PDF: " + (error?.message || "Unknown error"),
            { status: 500 }
        );
    }
}

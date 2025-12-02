import { NextRequest, NextResponse } from 'next/server';
import { Doppio } from 'doppio-nodejs';
import { RAMS_STYLES } from '../../lib/rams-generation';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const maxDuration = 60;

// Helper to embed local images as base64
function embedImages(html: string): string {
  return html.replace(/<img[^>]+src="(\/[^"]+)"[^>]*>/g, (match, src) => {
    try {
      const filePath = path.join(process.cwd(), 'public', src);
      if (fs.existsSync(filePath)) {
        const ext = path.extname(filePath).substring(1);
        const base64 = fs.readFileSync(filePath, { encoding: 'base64' });
        const dataUri = `data:image/${ext === 'svg' ? 'svg+xml' : ext};base64,${base64}`;
        return match.replace(src, dataUri);
      }
      console.warn(`Image not found: ${filePath}`);
      return match;
    } catch (err) {
      console.error(`Failed to embed image ${src}:`, err);
      return match;
    }
  });
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.DOPPIO_API_KEY;
    if (!apiKey) {
      console.error('DOPPIO_API_KEY is not set');
      return NextResponse.json({ error: 'Server configuration error: DOPPIO_API_KEY missing' }, { status: 500 });
    }

    const doppio = new Doppio(apiKey);
    const { html: rawHtml, filename } = await req.json();

    if (!rawHtml) {
      return NextResponse.json({ error: 'No HTML content provided' }, { status: 400 });
    }

    console.log(`PDF: Received HTML length: ${rawHtml.length}`);
    console.log(`PDF: First 500 chars: ${rawHtml.substring(0, 500)}`);

    // Embed images - Temporarily disabled to debug content corruption
    // const html = embedImages(rawHtml);
    const html = rawHtml;

    // Construct full HTML with styles
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            ${RAMS_STYLES}
            /* Ensure background colors (like risk scores) are printed */
            body { 
              -webkit-print-color-adjust: exact; 
              print-color-adjust: exact;
            }
          </style>
        </head>
        <body>
          <div class="rams-content">
            ${html}
          </div>
        </body>
      </html>
    `;

    // Use Doppio to render the HTML directly
    const result = await doppio.renderPdfSync({
      setContent: {
        html: fullHtml,
        options: {
          waitUntil: ['networkidle0'],
        },
      },
      pdf: {
        printBackground: true,
        format: 'A4',
        margin: {
          top: '10mm',
          right: '10mm',
          bottom: '10mm',
          left: '10mm',
        },
      },
    });

    if (!result.documentUrl) {
      console.error('Doppio render error:', result);
      return NextResponse.json({ error: 'Failed to render PDF via Doppio' }, { status: 500 });
    }

    // Download the PDF from Doppio
    const pdfRes = await fetch(result.documentUrl);
    if (!pdfRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch rendered PDF from Doppio' }, { status: 502 });
    }

    const contentType = pdfRes.headers.get('content-type');
    console.log(`PDF: Doppio response content-type: ${contentType}`);

    const pdfBuffer = Buffer.from(await pdfRes.arrayBuffer());

    // Validate PDF header
    const header = pdfBuffer.subarray(0, 5).toString('utf8');
    if (header !== '%PDF-') {
      const errorBody = pdfBuffer.subarray(0, 500).toString('utf8');
      console.error(`PDF: Invalid PDF header. Received: ${header}`);
      console.error(`PDF: Response body preview: ${errorBody}`);
      return NextResponse.json({ error: `Doppio returned invalid PDF content: ${errorBody.substring(0, 100)}` }, { status: 500 });
    }

    console.log(`PDF: Valid PDF generated. Length: ${pdfBuffer.length}`);

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename || 'document'}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('PDF Generation Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate PDF' }, { status: 500 });
  }
}

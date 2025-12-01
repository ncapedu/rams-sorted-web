import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { RAMS_STYLES } from '../../lib/rams-generation';
import fs from 'fs';
import path from 'path';

// Helper to embed local images as base64
function embedImages(html: string): string {
  // Regex to find <img src="/icons/..." ... />
  // We match src="/..." and capture the path
  return html.replace(/<img[^>]+src="(\/[^"]+)"[^>]*>/g, (match, src) => {
    try {
      // Construct absolute path
      // In Next.js, process.cwd() is usually the project root
      // Public assets are in /public
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
    const { html: rawHtml, filename } = await req.json();

    if (!rawHtml) {
      return NextResponse.json({ error: 'No HTML content provided' }, { status: 400 });
    }

    // Embed images
    const html = embedImages(rawHtml);

    // Launch Puppeteer
    // Note: In a real production environment (e.g. Vercel), you might need puppeteer-core and @sparticuz/chromium
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    // Construct full HTML with styles
    // We inject the RAMS_STYLES and ensure print media is active
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

    await page.setContent(fullHtml, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      printBackground: true,
      displayHeaderFooter: false,
      preferCSSPageSize: true,
    });

    await browser.close();

    return new NextResponse(Buffer.from(pdfBuffer), {
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

import { NextRequest, NextResponse } from 'next/server';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
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
    const { html: rawHtml, filename } = await req.json();

    if (!rawHtml) {
      return NextResponse.json({ error: 'No HTML content provided' }, { status: 400 });
    }

    // Embed images
    const html = embedImages(rawHtml);

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

    let browser;
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      // Production: Use @sparticuz/chromium
      chromium.setHeadlessMode = true;
      chromium.setGraphicsMode = false;

      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
    } else {
      // Local Development: Use system Chrome
      // Adjust this path if your Chrome is installed elsewhere
      const localExecutablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

      browser = await puppeteer.launch({
        headless: true,
        executablePath: localExecutablePath,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    }

    const page = await browser.newPage();
    await page.setContent(fullHtml, { waitUntil: 'networkidle0', timeout: 30000 });

    const pdfBuffer = await page.pdf({
      printBackground: true,
      displayHeaderFooter: false,
      preferCSSPageSize: true,
      format: 'A4',
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm',
      },
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

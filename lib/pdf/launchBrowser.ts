import { Browser } from 'puppeteer-core';

const isLocal = process.env.IS_LOCAL === "true" || process.env.NODE_ENV === "development";

export async function launchBrowser(): Promise<Browser> {
    if (isLocal) {
        // LOCAL DEV (macOS)
        // Use full puppeteer, which downloads a macOS-compatible Chromium
        const puppeteer = await import("puppeteer");
        console.log("[PDF] Launching local Puppeteer (dev)");
        return puppeteer.launch({
            headless: true,
        }) as unknown as Browser;
    }

    // PRODUCTION (Vercel, Linux serverless)
    // Use puppeteer-core + Sparticuz chromium-min
    const chromium = (await import("@sparticuz/chromium")).default;
    const puppeteerCore = await import("puppeteer-core");

    chromium.setHeadlessMode = true;
    chromium.setGraphicsMode = false;

    const executablePath = await chromium.executablePath();
    console.log("[PDF] Launching Sparticuz Chromium at", executablePath);

    return puppeteerCore.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath,
        headless: chromium.headless,
    });
}

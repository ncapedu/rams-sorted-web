import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/app/lib/email/service";
import { ContactEmail } from "@/app/lib/email/templates/contact";
import * as React from "react";

const SUPPORT_EMAIL = "support@ramssorted.com";

const RATE_LIMIT_MAP = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5;

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const entry = RATE_LIMIT_MAP.get(ip);

    if (!entry || entry.resetAt < now) {
        RATE_LIMIT_MAP.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
        return true;
    }

    if (entry.count >= RATE_LIMIT_MAX) {
        return false;
    }

    entry.count++;
    return true;
}

export async function POST(req: NextRequest) {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";

    if (!checkRateLimit(ip)) {
        return NextResponse.json(
            { error: "Too many requests. Please try again later." },
            { status: 429 }
        );
    }

    let body: { name?: string; email?: string; subject?: string; message?: string };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const { name, email, subject, message } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
        return NextResponse.json(
            { error: "Name, email, and message are required." },
            { status: 400 }
        );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const subjectLine = subject?.trim() || "General Enquiry";

    try {
        await sendEmail({
            to: SUPPORT_EMAIL,
            subject: `[Contact Form] ${subjectLine} — from ${name}`,
            react: React.createElement(ContactEmail, {
                name: name.trim(),
                email: email.trim(),
                subject: subjectLine,
                message: message.trim(),
            }),
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("[contact] Failed to send email:", err);
        return NextResponse.json(
            { error: "Failed to send message. Please try emailing us directly." },
            { status: 500 }
        );
    }
}

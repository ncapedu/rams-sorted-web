import { EmailPayload, EmailProvider } from "../service";
import { Resend } from "resend";

export class ResendProvider implements EmailProvider {
    private client: Resend;

    constructor() {
        if (!process.env.RESEND_API_KEY) {
            console.warn("RESEND_API_KEY is missing. Emails will fail to send via Resend.");
        }
        this.client = new Resend(process.env.RESEND_API_KEY);
    }

    async send(payload: EmailPayload): Promise<void> {
        try {
            await this.client.emails.send({
                from: process.env.EMAIL_FROM || "onboarding@resend.dev",
                to: payload.to,
                subject: payload.subject,
                react: payload.react,
            });
        } catch (error) {
            console.error("Failed to send email via Resend:", error);
            throw error;
        }
    }
}

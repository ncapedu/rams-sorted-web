import { EmailPayload, EmailProvider } from "../service";
import { render } from "@react-email/render";

export class MockProvider implements EmailProvider {
    async send(payload: EmailPayload): Promise<void> {
        const html = await render(payload.react);
        console.log(`
[MOCK EMAIL PROVIDER]
----------------------------------------------------
To: ${payload.to}
Subject: ${payload.subject}
----------------------------------------------------
HTML Content (Preview):
${html.substring(0, 500)}...
----------------------------------------------------
        `);
    }
}

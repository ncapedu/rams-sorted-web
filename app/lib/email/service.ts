import { ReactElement } from "react";
import { ResendProvider } from "./providers/resend";
import { MockProvider } from "./providers/mock";

export interface EmailPayload {
    to: string;
    subject: string;
    react: ReactElement;
}

export interface EmailProvider {
    send(payload: EmailPayload): Promise<void>;
}

const getProvider = (): EmailProvider => {
    const provider = process.env.EMAIL_PROVIDER || 'mock';

    if (provider === 'resend') {
        return new ResendProvider();
    }

    return new MockProvider();
};

export const sendEmail = async (payload: EmailPayload) => {
    const provider = getProvider();
    await provider.send(payload);
};

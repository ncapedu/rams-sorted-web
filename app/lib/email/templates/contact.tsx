import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
    Hr,
} from "@react-email/components";
import * as React from "react";

interface ContactEmailProps {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export const ContactEmail = ({ name, email, subject, message }: ContactEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>New contact form submission: {subject}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>New Contact Form Submission</Heading>
                    <Section style={infoSection}>
                        <Text style={label}>From</Text>
                        <Text style={value}>{name} &lt;{email}&gt;</Text>
                        <Text style={label}>Subject</Text>
                        <Text style={value}>{subject}</Text>
                    </Section>
                    <Hr style={hr} />
                    <Text style={label}>Message</Text>
                    <Text style={messageStyle}>{message}</Text>
                    <Hr style={hr} />
                    <Text style={footer}>
                        This message was sent via the RAMS Sorted contact form.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

export default ContactEmail;

const main = {
    backgroundColor: "#f6f9fc",
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
};

const container = {
    margin: "0 auto",
    padding: "20px",
    maxWidth: "580px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
};

const h1 = {
    color: "#0f172a",
    fontSize: "22px",
    fontWeight: "bold",
    paddingBottom: "16px",
};

const infoSection = {
    paddingBottom: "16px",
};

const label = {
    color: "#64748b",
    fontSize: "12px",
    fontWeight: "600" as const,
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    margin: "0 0 4px 0",
};

const value = {
    color: "#0f172a",
    fontSize: "15px",
    margin: "0 0 12px 0",
};

const messageStyle = {
    color: "#334155",
    fontSize: "15px",
    lineHeight: "24px",
    whiteSpace: "pre-wrap" as const,
};

const hr = {
    borderColor: "#e2e8f0",
    margin: "20px 0",
};

const footer = {
    color: "#94a3b8",
    fontSize: "12px",
    marginTop: "8px",
};

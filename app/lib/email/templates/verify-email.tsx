import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
} from "@react-email/components";
import * as React from "react";

interface VerifyEmailProps {
    code: string;
}

export const VerifyEmail = ({ code }: VerifyEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Your Verification Code</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>Verify Your Request</Heading>
                    <Text style={text}>
                        Please use the following code to verify your action (login or account change):
                    </Text>
                    <Section style={codeContainer}>
                        <Text style={codeText}>{code}</Text>
                    </Section>
                    <Text style={text}>
                        If you didn't request this, you can safely ignore this email.
                    </Text>
                    <Text style={footer}>
                        RAMS Sorted Team
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

export default VerifyEmail;

const main = {
    backgroundColor: "#ffffff",
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: "0 auto",
    padding: "20px 0 48px",
    maxWidth: "580px",
};

const h1 = {
    color: "#333",
    fontSize: "24px",
    fontWeight: "bold",
    paddingTop: "32px",
    paddingBottom: "32px",
};

const text = {
    color: "#333",
    fontSize: "16px",
    lineHeight: "26px",
};

const codeContainer = {
    background: "#f4f4f4",
    borderRadius: "8px",
    margin: "16px 0",
    padding: "16px",
    textAlign: "center" as const,
};

const codeText = {
    fontSize: "32px",
    fontWeight: "bold",
    letterSpacing: "4px",
    color: "#000",
    margin: "0",
};

const footer = {
    color: "#898989",
    fontSize: "14px",
    lineHeight: "22px",
    marginTop: "12px",
};

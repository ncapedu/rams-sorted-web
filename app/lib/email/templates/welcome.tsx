import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
    Button,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
    name?: string;
}

export const WelcomeEmail = ({ name }: WelcomeEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Welcome to RAMS Sorted</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>Welcome to RAMS Sorted</Heading>
                    <Text style={text}>
                        Hello {name || "there"},
                    </Text>
                    <Text style={text}>
                        Thanks for joining RAMS Sorted. We're excited to help you streamline your health and safety documentation.
                    </Text>
                    <Section style={btnContainer}>
                        <Button style={button} href="https://rams-sorted.vercel.app/app">
                            Go to Dashboard
                        </Button>
                    </Section>
                    <Text style={text}>
                        If you have any questions, simply reply to this email or contact support.
                    </Text>
                    <Text style={footer}>
                        RAMS Sorted Team
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

export default WelcomeEmail;

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

const btnContainer = {
    textAlign: "center" as const,
    paddingTop: "20px",
    paddingBottom: "20px",
};

const button = {
    backgroundColor: "#000000",
    borderRadius: "5px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "block",
    padding: "12px",
    maxWidth: "200px",
    margin: "0 auto",
};

const footer = {
    color: "#898989",
    fontSize: "14px",
    lineHeight: "22px",
    marginTop: "12px",
};

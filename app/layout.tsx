import type { Metadata } from "next";
import { Geist, Geist_Mono, Archivo_Black } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const archivoBlack = Archivo_Black({
  weight: "400",
  variable: "--font-archivo-black",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RAMS Sorted | RAMS, COSHH & Toolbox Talks in Minutes",
  description:
    "RAMS Sorted lets UK trades and contractors create compliant RAMS packs, COSHH assessments and toolbox talks in minutes. Generate polished PDF and Word documents without paying a safety consultant.",
  keywords: ["RAMS", "Risk Assessment", "Method Statement", "COSHH", "Toolbox Talks", "Construction Safety", "Health and Safety Software", "UK Trades"],
  authors: [{ name: "RAMS Sorted" }],
  creator: "RAMS Sorted",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://www.ramssorted.co.uk",
    title: "RAMS Sorted | RAMS, COSHH & Toolbox Talks in Minutes",
    description: "Create compliant health & safety documents in minutes. Stop overpaying consultants.",
    siteName: "RAMS Sorted",
    images: [
      {
        url: "/rams-logo6.png",
        width: 1200,
        height: 630,
        alt: "RAMS Sorted",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RAMS Sorted | RAMS, COSHH & Toolbox Talks in Minutes",
    description: "Create compliant health & safety documents in minutes. Stop overpaying consultants.",
    images: ["/rams-logo6.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/rams-logo6.png",
  },
  metadataBase: new URL("https://www.ramssorted.co.uk"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${archivoBlack.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

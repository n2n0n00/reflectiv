import type React from "react";
import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["400", "600", "700", "900"],
});

export const metadata: Metadata = {
  title: "MindfulPath - AI Journaling for Self-Discovery",
  description:
    "Transform your thoughts into insights with AI-guided therapeutic journaling",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${montserrat.variable} antialiased`}
    >
      <body className="font-sans">
        <AuthProvider>{children} </AuthProvider>
      </body>
    </html>
  );
}

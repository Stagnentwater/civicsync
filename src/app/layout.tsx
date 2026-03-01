import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/components/providers/AppProvider";
import Header from "@/components/layout/Header";
import AccessibilityBar from "@/components/layout/AccessibilityBar";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CivicSync AI - Digital Civic Services Kiosk",
  description:
    "CivicSync AI is a digital kiosk platform for civic services including bill payments, complaint filing, and government service access.",
  keywords: "civic services, digital kiosk, bill payment, complaints, government",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <AppProvider>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <AccessibilityBar />
          <Header />
          <main id="main-content" className="flex-1" role="main">
            {children}
          </main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}

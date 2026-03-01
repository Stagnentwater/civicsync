import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/components/providers/AppProvider";
import Header from "@/components/layout/Header";
import AccessibilityBar from "@/components/layout/AccessibilityBar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CivicSync AI — Digital Civic Services",
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
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased min-h-screen flex flex-col bg-[#fafafa]`}
        style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
      >
        <AppProvider>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <Header />
          <main id="main-content" className="flex-1" role="main">
            {children}
          </main>
          <Footer />
          <AccessibilityBar />
        </AppProvider>
      </body>
    </html>
  );
}

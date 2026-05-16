import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PetVerse AI | Your Pet's Future",
  description: "Next-gen AI-powered pet care ecosystem with interactive 3D companions, health insights, and more.",
};

import AIFloatingAssistant from "@/components/AIFloatingAssistant";
import CustomCursor from "@/components/CustomCursor";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <html
      lang="en"
      className={`${outfit.variable} ${jetbrainsMono.variable} h-full antialiased`}
      // Apply dark mode from localStorage before hydration
      suppressHydrationWarning={true}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            const theme = localStorage.getItem('theme');
            if (theme === 'dark') document.documentElement.classList.add('dark');
          })();
        `}} />
      </head>
      <body className="min-h-full flex flex-col">
        <CustomCursor />
        {children}
        <AIFloatingAssistant />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono, Caveat } from "next/font/google";
import "./globals.css";

const grotesk = Space_Grotesk({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const mono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "SIDDANTA — Full Stack Developer & Builder",
  description:
    "Portfolio of Siddanta Sodari — Full Stack Developer, Quantum Computing Enthusiast & Community Builder from Chitwan, Nepal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body className={`${grotesk.variable} ${mono.variable} ${caveat.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

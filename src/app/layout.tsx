import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono, Caveat } from "next/font/google";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://siddanta.vercel.app";

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

export const viewport: Viewport = {
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Siddanta Sodari — Full Stack Developer & Builder",
    template: "%s | Siddanta Sodari",
  },
  description:
    "Portfolio of Siddanta Sodari — Full Stack Developer, Quantum Computing Enthusiast & Community Builder from Chitwan, Nepal. Building startups, open-source tools, and community tech.",
  keywords: [
    "Siddanta Sodari",
    "Siddanta",
    "Sodari",
    "Full Stack Developer Nepal",
    "Next.js Developer",
    "React Developer",
    "TypeScript Developer",
    "Supabase Developer",
    "Quantum Computing Nepal",
    "Chitwan Nepal Developer",
    "Nepal Tech",
    "Web Developer Nepal",
    "Startup Builder Nepal",
    "Portfolio",
    "GSAP",
  ],
  authors: [{ name: "Siddanta Sodari", url: SITE_URL }],
  creator: "Siddanta Sodari",
  publisher: "Siddanta Sodari",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "profile",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Siddanta Sodari",
    title: "Siddanta Sodari — Full Stack Developer & Builder",
    description:
      "Portfolio of Siddanta Sodari — Full Stack Developer, Quantum Computing Enthusiast & Community Builder from Chitwan, Nepal.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Siddanta Sodari — Full Stack Developer & Builder",
      },
    ],
    firstName: "Siddanta",
    lastName: "Sodari",
    username: "siddanta-ar1",
  },
  twitter: {
    card: "summary_large_image",
    title: "Siddanta Sodari — Full Stack Developer & Builder",
    description:
      "Portfolio of Siddanta Sodari — Full Stack Developer, Quantum Computing Enthusiast & Community Builder from Chitwan, Nepal.",
    images: ["/opengraph-image"],
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: "Siddanta Sodari",
    givenName: "Siddanta",
    familyName: "Sodari",
    url: SITE_URL,
    email: "siddanta.sodari@proton.me",
    image: `${SITE_URL}/opengraph-image`,
    sameAs: [
      "https://github.com/siddanta-ar1",
      "https://linkedin.com/in/siddanta-sodari-08596a335",
    ],
    jobTitle: "Full Stack Developer",
    description:
      "Full Stack Developer, Quantum Computing Enthusiast & Community Builder from Chitwan, Nepal.",
    knowsAbout: [
      "Full Stack Development",
      "React",
      "Next.js",
      "TypeScript",
      "Supabase",
      "PostgreSQL",
      "Quantum Computing",
      "GSAP",
      "Node.js",
    ],
    nationality: { "@type": "Country", name: "Nepal" },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Chitwan",
      addressCountry: "NP",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "Siddanta Sodari — Portfolio",
    description:
      "Portfolio of Siddanta Sodari — Full Stack Developer & Builder from Chitwan, Nepal.",
    author: { "@id": `${SITE_URL}/#person` },
  },
  {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/#profilepage`,
    url: SITE_URL,
    name: "Siddanta Sodari — Portfolio",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#person` },
    mainEntity: { "@id": `${SITE_URL}/#person` },
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body className={`${grotesk.variable} ${mono.variable} ${caveat.variable} antialiased`}>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}

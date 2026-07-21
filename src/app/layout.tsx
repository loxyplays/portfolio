import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { site } from "@/lib/data";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  keywords: [
    "developer portfolio",
    "frontend engineer",
    "web developer",
    "UI designer",
    "React",
    "Next.js",
    "TypeScript",
    "Roblox developer",
    "game developer",
    site.name,
  ],
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.role}`,
    description: site.description,
    // Referenced explicitly as a real .png rather than via Next's
    // `opengraph-image.tsx` convention, which exports an extensionless file
    // that static hosts serve as application/octet-stream — and which every
    // social scraper then refuses. Regenerate it with the source kept in
    // docs/opengraph-image.example.tsx.
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${site.name} — ${site.role}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description: site.description,
    creator: "@zacdelaney",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: { canonical: "/" },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/** Structured data so search engines can read the profile properly. */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  description: site.description,
  url: site.url,
  email: `mailto:${site.email}`,
  address: { "@type": "PostalAddress", addressLocality: site.location },
  knowsAbout: [
    "Web Development",
    "React",
    "Next.js",
    "TypeScript",
    "UI/UX Design",
    "Game Development",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <script
          type="application/ld+json"
          // Static, author-controlled object — not user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />

        <a
          href="#home"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[10001] focus:rounded-full focus:bg-bright focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-void"
        >
          Skip to content
        </a>

        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

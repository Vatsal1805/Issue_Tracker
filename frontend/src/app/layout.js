import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ApniSec - Enterprise Cybersecurity Solutions | Cloud Security, VAPT, Red Team Assessment",
  description: "Leading cybersecurity company providing enterprise-grade solutions including Cloud Security, Vulnerability Assessment, Penetration Testing (VAPT), and Red Team Assessments. Protect your business from digital threats with expert cybersecurity services.",
  keywords: [
    "cybersecurity",
    "cloud security",
    "VAPT",
    "vulnerability assessment",
    "penetration testing",
    "red team assessment",
    "enterprise security",
    "threat detection",
    "security consulting",
    "ApniSec"
  ].join(", "),
  authors: [{ name: "ApniSec Team" }],
  creator: "ApniSec",
  publisher: "ApniSec",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://apnisec.com"), // Replace with actual domain
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ApniSec - Enterprise Cybersecurity Solutions",
    description: "Leading cybersecurity company providing Cloud Security, VAPT, Red Team Assessments. Secure your digital future with expert cybersecurity services.",
    url: "https://apnisec.com", // Replace with actual domain
    siteName: "ApniSec",
    images: [
      {
        url: "/og-image.jpg", // We'll create this
        width: 1200,
        height: 630,
        alt: "ApniSec - Cybersecurity Solutions",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ApniSec - Enterprise Cybersecurity Solutions",
    description: "Leading cybersecurity company providing Cloud Security, VAPT, Red Team Assessments.",
    images: ["/og-image.jpg"], // We'll create this
    creator: "@ApniSec", // Replace with actual handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Add your Google Search Console verification
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
  category: "technology",
  classification: "Cybersecurity Services",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Additional SEO meta tags */}
        <meta name="theme-color" content="#0891b2" />
        <meta name="color-scheme" content="dark" />
        <link rel="canonical" href="https://apnisec.com" />
        
        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "ApniSec",
              "description": "Leading cybersecurity company providing enterprise-grade security solutions",
              "url": "https://apnisec.com",
              "logo": "https://apnisec.com/logo.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+1-555-123-4567",
                "contactType": "Customer Service",
                "email": "contact@apnisec.com"
              },
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Tech City",
                "addressRegion": "CA",
                "postalCode": "12345",
                "streetAddress": "Cyber District"
              },
              "sameAs": [
                "https://twitter.com/ApniSec",
                "https://linkedin.com/company/apnisec"
              ],
              "areaServed": "Worldwide",
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Cybersecurity Services",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Cloud Security",
                      "description": "Comprehensive cloud infrastructure security and monitoring"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Red Team Assessment",
                      "description": "Real-world attack simulations and security testing"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "VAPT",
                      "description": "Vulnerability Assessment and Penetration Testing services"
                    }
                  }
                ]
              }
            })
          }}
        />

        {/* Structured Data for Website */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "ApniSec",
              "alternateName": "ApniSec Cybersecurity",
              "url": "https://apnisec.com",
              "description": "Enterprise cybersecurity solutions including Cloud Security, VAPT, and Red Team Assessment services",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://apnisec.com/search?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-900 text-white`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

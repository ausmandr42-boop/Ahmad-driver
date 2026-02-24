import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { LocalBusinessSchema, ServiceSchema } from "@/components/json-ld";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ahmad: Your Chicago Driver | Private Driver & Chauffeur Service in Chicago",
  description: "Book a private driver in Chicago! Ahmad offers professional chauffeur services including airport transfers (O'Hare & Midway), corporate transportation, city tours, and hourly car service. Reliable, safe, and affordable. Call 847-219-3030.",
  keywords: [
    // Primary keywords
    "Chicago private driver",
    "Chicago chauffeur service",
    "Chicago car service",
    "private driver Chicago",
    "driver service Chicago",
    // Airport related
    "O'Hare airport transfer",
    "Midway airport transfer",
    "Chicago airport driver",
    "airport pickup Chicago",
    "airport drop off Chicago",
    // Service types
    "hourly car service Chicago",
    "corporate transportation Chicago",
    "Chicago city tour driver",
    "personal driver Chicago",
    "professional driver Chicago",
    // Location specific
    "Chicago limo service",
    "Chicago ride service",
    "downtown Chicago driver",
    "Chicago suburbs driver",
    "Illinois private driver",
    // Long tail
    "affordable private driver Chicago",
    "reliable car service Chicago",
    "safe driver Chicago",
    "24/7 driver service Chicago",
  ],
  authors: [{ name: "Ahmad" }],
  creator: "Ahmad",
  publisher: "Ahmad Chicago Driver",
  metadataBase: new URL("https://driverchicago.com"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Ahmad: Your Chicago Driver | Private Driver & Chauffeur Service",
    description: "Professional private driver services in Chicago. Airport transfers, corporate accounts, city tours, and hourly service. Safe, reliable, and affordable. Book now!",
    url: "https://driverchicago.com",
    siteName: "Ahmad: Your Chicago Driver",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahmad: Your Chicago Driver | Private Driver Service",
    description: "Professional private driver in Chicago. Airport transfers, corporate transportation, and hourly car service. Book your ride today!",
  },
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
  verification: {
    google: "google-site-verification-code", // User will need to add this
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <LocalBusinessSchema />
        <ServiceSchema />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

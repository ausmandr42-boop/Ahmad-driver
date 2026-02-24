import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ahmad: Your Chicago Driver | Premium Private Driver Service in Chicago",
  description: "Professional private driver services in Chicago. Ahmad provides reliable, safe, and comfortable transportation in a new Honda Accord Hybrid Touring. Airport transfers, corporate accounts, city tours, and more.",
  keywords: ["Chicago driver", "private driver", "airport transfer", "O'Hare", "Midway", "transportation", "Honda Accord", "chauffeur"],
  authors: [{ name: "Ahmad" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Ahmad: Your Chicago Driver | Premium Private Driver Service in Chicago",
    description: "Professional private driver services in Chicago. Safe, reliable, and comfortable transportation.",
    url: "https://driverchicago.com",
    siteName: "Ahmad: Your Chicago Driver",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahmad: Your Chicago Driver | Premium Private Driver Service in Chicago",
    description: "Professional private driver services in Chicago. Safe, reliable, and comfortable transportation.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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

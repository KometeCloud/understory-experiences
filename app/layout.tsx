import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Understory – Esperienze",
  description: "Scopri e prenota le nostre esperienze",
  icons: {
    icon: "/ADD-FAVICON.png",
    apple: "/ADD-FAVICON.png",
  },
  openGraph: {
    title: "Understory – Esperienze",
    description: "Scopri e prenota le nostre esperienze",
    images: [{ url: "/ADD-FAVICON.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Script
          src="https://widgets.understory.io/widgets/understory-booking-widget.js?environment=production"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}

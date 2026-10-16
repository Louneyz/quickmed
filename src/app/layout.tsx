import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { JoinDialogs } from "@/components/join/join-dialogs";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QuickMed | Prescription delivery for Ontario pharmacies",
  description: "QuickMed picks up prescriptions from your pharmacy and delivers them to your patients. Trained drivers, discreet packaging, and a real person on the phone.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Scroll reveals start hidden; without JavaScript, show everything. */}
        <noscript>
          <style>{`.reveal,.word{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <JoinDialogs />
      </body>
    </html>
  );
}

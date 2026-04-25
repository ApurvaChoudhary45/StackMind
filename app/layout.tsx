import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { EdgeStoreProvider } from "@/lib/edgestore";
import GlobalSearch from "@/components/GlobalSearch";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'StackMind — Second Brain for Developers',
  description: 'Notes with code blocks, Kanban bug tracker, and snippet library with GitHub import. All in one place for developers.',
  openGraph: {
    title: 'StackMind — Second Brain for Developers',
    description: 'Notes with code blocks, Kanban bug tracker, and snippet library with GitHub import. All in one place for developers.',
    url: 'https://stack-mind-ten.vercel.app',
    siteName: 'StackMind',
    images: [
      {
        url: 'https://stack-mind-ten.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'StackMind — Second Brain for Developers',
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StackMind — Second Brain for Developers',
    description: 'Notes with code blocks, Kanban bug tracker, and snippet library with GitHub import.',
    images: ['https://stack-mind-ten.vercel.app/og-image.png'],
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GlobalSearch/>
        <EdgeStoreProvider>
        {children}
        </EdgeStoreProvider>
        
      </body>
    </html>
  );
}

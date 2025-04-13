import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Dynamically determine the base path
const basePath =
  process.env.NODE_ENV === "production" ? "/team-decision-simulator" : "";

export const metadata: Metadata = {
  title: "MBTI Brain",
  description: "MBTI Brain",
  icons: {
    icon: [{ url: `${basePath}/favicon.ico`, sizes: "any" }],
    shortcut: `${basePath}/favicon.ico`,
    apple: `${basePath}/favicon.ico`,
  },
  appleWebApp: {
    title: "MBTI Brain",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import AuthSessionProvider from '@/components/auth/SessionProvider';
import StatusBubble from "@/components/shared/StatusBubble";
import SyncStatusBanner from "@/components/ui/SyncStatusBanner";
import SyncInitializer from '@/components/ui/SyncInitializer';
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
  title: "SchoolBridge - Bridging Education Gaps, Online and Offline",
  description: "Offline-first school management platform for Madagascar. Connecting teachers, students, and parents.",
  // Add PWA metadata for installation prompt
  metadataBase: new URL("https://schoolbridge.app"), // Replace with your domain
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#007bff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthSessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* SyncStatusBanner is placed globally for constant visibility */}
            <div className="fixed top-2 right-2 z-50">
              <SyncStatusBanner />
            </div>
            <SyncInitializer /> {/* Initialize background synchronization (US 4.2) */}
            {children}
          </ThemeProvider>
        </AuthSessionProvider>
        <StatusBubble />
        <Toaster />
      </body>
    </html>
  );
}

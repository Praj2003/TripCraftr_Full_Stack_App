import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";

import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap", // Helps with better performance & avoids FOUT
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ClerkProvider>
        <body
          className={` ${inter.variable} antialiased`}
          style={{ fontFamily: "var(--font-inter)" }}
        >
          <div className="relative min-h-screen w-full bg-neutral-900">
            <div className="absolute inset-0 bg-fuchsia-400 bg-[size:20px_20px] opacity-20 blur-[100px]" />
            <Navbar />
            <div className="relative z-10">{children}</div>
            <Toaster position="bottom-right" richColors />
          </div>
          <Footer />
        </body>
      </ClerkProvider>
    </html>
  );
}

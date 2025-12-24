import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import AppLayout from "@/components/layout/AppLayout";
import { ToastProvider } from "@/components/ui/ToastProvider";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope"
});

export const metadata: Metadata = {
  title: "V-Card Generator",
  description: "Create, personalize, and share digital business cards with ease."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} bg-white text-black`}>
        <ToastProvider>
          <AppLayout>{children}</AppLayout>
        </ToastProvider>
      </body>
    </html>
  );
}

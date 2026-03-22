import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Konfide - Talk to someone who actually gets it",
  description: "Konfide connects you with verified peer listeners who have walked in your shoes. Professional support, human connection, zero judgment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.variable} font-body antialiased bg-surface text-on-surface`}>
        {children}
      </body>
    </html>
  );
}

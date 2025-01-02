import type { Metadata } from "next";
import "./globals.css";
import { Figtree } from "next/font/google";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/toaster";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
});

export const metadata: Metadata = {
  title: "Trade Journal",
  description: "Trade journal for your trading strategy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${figtree.className} antialiased`}>
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}

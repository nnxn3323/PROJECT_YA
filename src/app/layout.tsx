import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/app/bottom-nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HHH Academy",
  description: "학생, 학부모, 관리자, 웹마스터를 위한 학원 관리 웹앱"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#FCE500"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <div className="fixed inset-0 -z-10 bg-[linear-gradient(120deg,rgba(255,255,255,.28),rgba(255,255,255,.08))]" />
        {children}
        <BottomNav />
      </body>
    </html>
  );
}

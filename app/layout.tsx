import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "PE-SDN — Quản lý chi tiêu cá nhân thông minh",
  description: "Ứng dụng theo dõi, phân loại và phân tích chi tiêu cá nhân hiện đại, trực quan và bảo mật.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans selection:bg-blue-500/20 selection:text-blue-700 dark:selection:bg-blue-400/20 dark:selection:text-blue-300">
        {children}
      </body>
    </html>
  );
}


import type { Metadata } from "next";
import { Noto_Serif_JP } from "next/font/google";
import "./globals.css";

const notoSerifJP = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "神制覇マップ - 古事記の神々を巡る旅",
  description: "日本全国の神社を巡り、古事記の神々を制覇しよう",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="dark">
      <body className={`${notoSerifJP.variable} font-serif antialiased`}>
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import "./theme.css";
import "./community.css";
export const metadata: Metadata = {
  title: "江城 Encore",
  description: "武汉演唱会与城市漫游指南。",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

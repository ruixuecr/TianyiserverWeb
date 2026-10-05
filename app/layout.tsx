import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "江城 Encore · 在武汉，赴一场热爱",
  description: "为一场演唱会而来，为一座城市停留。武汉演唱会与城市漫游指南。",
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

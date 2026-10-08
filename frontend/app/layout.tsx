import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";
import "./product.css";

export const metadata: Metadata = {
  title: "LensPilot AI｜多模态 AI 摄影助手",
  description: "一个同时理解照片内容和拍摄参数的 AI 摄影教练。",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}


import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="shell" style={{ padding: "72px 0", maxWidth: 820 }}>
      <p className="eyebrow">About LensPilot</p>
      <h1 style={{ fontSize: "clamp(42px, 7vw, 72px)" }}>让摄影建议有证据，也有下一步。</h1>
      <p className="hero-copy">
        LensPilot AI 是一个面向摄影新手的开源作品集项目。项目将真实实现图片分析、EXIF
        解析、结构化 AI 输出、历史记录和基础评测；尚未完成的能力会始终明确标记为规划中。
      </p>
      <div className="actions">
        <Link className="button secondary" href="/">
          返回首页
        </Link>
      </div>
    </main>
  );
}


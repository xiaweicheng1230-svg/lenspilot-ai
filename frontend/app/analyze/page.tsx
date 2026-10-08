import Link from "next/link";

import { PhotoUploader } from "@/components/upload/photo-uploader";

export default function AnalyzePage() {
  return (
    <main>
      <header className="global-nav">
        <div className="global-nav-inner">
        <Link className="wordmark" href="/">
          LensPilot <span>AI</span>
        </Link>
        <nav className="global-nav-links" aria-label="分析页导航">
          <Link href="/">首页</Link>
          <span className="nav-page-label">照片分析</span>
        </nav>
        </div>
      </header>

      <div className="analyze-intro">
        <p>LensPilot 分析工作台</p>
        <h1>上传照片。<br />让参数开口说话。</h1>
        <span>
          照片只保存在你的本地服务中；<br />GPS 信息不会显示，也不会进入后续 AI 上下文。
        </span>
      </div>

      <PhotoUploader />
    </main>
  );
}


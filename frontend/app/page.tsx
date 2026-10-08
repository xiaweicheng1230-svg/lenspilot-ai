import { ArrowRight, Camera, ChevronRight, ScanLine, SlidersHorizontal, Sparkles } from "lucide-react";
import Link from "next/link";

import { SystemStatus } from "@/components/system-status";

export default function HomePage() {
  return (
    <main className="site-home">
      <header className="global-nav">
        <div className="global-nav-inner">
          <Link className="wordmark" href="/" aria-label="LensPilot AI 首页">
            LensPilot <span>AI</span>
          </Link>
          <nav className="global-nav-links" aria-label="主导航">
            <a href="#how-it-works">功能</a>
            <Link href="/about">关于</Link>
            <Link className="nav-cta" href="/analyze">立即体验</Link>
          </nav>
        </div>
      </header>

      <section className="product-hero" id="top">
        <div className="hero-badge"><Sparkles size={14} /> 多模态 AI 摄影教练</div>
        <h1>你的照片，<br />下一张会更好。</h1>
        <p>
          <span>同时理解画面与拍摄参数。</span>
          <span>LensPilot 不只告诉你哪里有问题，</span>
          <span>还会解释原因，以及下一张具体怎么拍。</span>
        </p>
        <div className="hero-actions">
          <Link className="pill-button primary" href="/analyze">
            上传照片 <ArrowRight size={17} />
          </Link>
          <a className="text-link" href="#how-it-works">
            进一步了解 <ChevronRight size={16} />
          </a>
        </div>
        <div className="hero-status"><SystemStatus /></div>
      </section>

      <section className="product-stage" aria-label="LensPilot 产品预览">
        <div className="stage-glow" />
        <div className="stage-copy">
          <span>下一张怎么拍</span>
          <h2>先稳住快门，<br />再决定噪点。</h2>
          <p>根据当前照片与拍摄参数，给你一个可以在现场继续微调的起点。</p>
        </div>

        <div className="camera-interface" aria-hidden="true">
          <div className="viewfinder-corners"><i /><i /><i /><i /></div>
          <div className="focus-point" />
          <div className="exposure-scale">
            <span>−2</span><i /><i /><i className="active" /><i /><i /><span>+2</span>
          </div>
          <div className="setting-strip">
            <div><small>SHUTTER</small><strong>1/125</strong></div>
            <div className="recommended"><small>APERTURE</small><strong>f/2.8</strong></div>
            <div><small>ISO</small><strong>800</strong></div>
            <div><small>FOCAL</small><strong>50mm</strong></div>
          </div>
        </div>
      </section>

      <section className="story-section" id="how-it-works">
        <div className="story-heading">
          <p>从照片出发，真正学会摄影。</p>
          <h2>一套有证据的<br />拍摄复盘方式。</h2>
        </div>

        <div className="story-grid">
          <article className="story-card story-card-wide warm">
            <div className="story-icon"><ScanLine /></div>
            <span className="story-kicker">看见参数背后的原因</span>
            <h3>画面和 EXIF，<br />放在一起理解。</h3>
            <p>自动读取相机、镜头、焦距、光圈、快门与 ISO。没有的信息保持未知，不让 AI 凭空补全。</p>
            <div className="exif-mini">
              <span>SONY α7C II</span><span>50 mm</span><span>f/2.8</span><span>1/125 s</span><span>ISO 800</span>
            </div>
          </article>

          <article className="story-card dark">
            <div className="story-icon"><SlidersHorizontal /></div>
            <span className="story-kicker">建议不是绝对答案</span>
            <h3>给范围，<br />也讲清取舍。</h3>
            <p>现场光线、主体速度与设备防抖都会改变选择。LensPilot 给起点，也保留不确定性。</p>
          </article>

          <article className="story-card blue">
            <div className="story-icon"><Camera /></div>
            <span className="story-kicker">为下一次按下快门</span>
            <h3>不是评分，<br />是一堂私人摄影课。</h3>
            <Link className="card-link" href="/analyze">开始第一张 <ChevronRight size={17} /></Link>
          </article>
        </div>
      </section>

      <section className="closing-cta">
        <span>LensPilot AI</span>
        <h2>从你拍过的照片，<br />走向你想拍出的照片。</h2>
        <Link className="pill-button primary" href="/analyze">开始分析 <ArrowRight size={17} /></Link>
      </section>

      <footer className="site-footer">
        <div><strong>LensPilot AI</strong><span>多模态 AI 摄影助手</span></div>
        <p>当前已验证：图片上传、文件校验、缩略图与 EXIF 解析。</p>
      </footer>
    </main>
  );
}


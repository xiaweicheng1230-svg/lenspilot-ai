"use client";

import { AlertCircle, Camera, Check, ImageUp, RotateCcw, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, DragEvent, useEffect, useId, useState } from "react";

import { formatCamera, formatFileSize } from "@/lib/format";
import { uploadPhoto } from "@/services/photos";
import type { PhotoUploadResult } from "@/types/photo";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

type UploadState = "idle" | "ready" | "uploading" | "success" | "error";

function valueOrDash(value: string | number | null, suffix = ""): string {
  return value === null ? "—" : `${value}${suffix}`;
}

export function PhotoUploader() {
  const inputId = useId();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [state, setState] = useState<UploadState>("idle");
  const [result, setResult] = useState<PhotoUploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function chooseFile(nextFile: File) {
    setError(null);
    setResult(null);
    if (!ACCEPTED_TYPES.includes(nextFile.type)) {
      setState("error");
      setError("请选择 JPG、JPEG、PNG 或 WEBP 图片。");
      return;
    }
    if (nextFile.size > MAX_FILE_SIZE) {
      setState("error");
      setError("图片不能超过 10 MB。");
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(nextFile);
    setPreviewUrl(URL.createObjectURL(nextFile));
    setState("ready");
  }

  function handleInput(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0];
    if (nextFile) chooseFile(nextFile);
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    const nextFile = event.dataTransfer.files[0];
    if (nextFile) chooseFile(nextFile);
  }

  async function handleUpload() {
    if (!file) return;
    setState("uploading");
    setError(null);
    try {
      const uploaded = await uploadPhoto(file);
      setResult(uploaded);
      setState("success");
    } catch (uploadError) {
      setState("error");
      setError(uploadError instanceof Error ? uploadError.message : "照片上传失败，请重试。");
    }
  }

  function reset() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    setState("idle");
  }

  const camera = result ? formatCamera(result.exif.camera_make, result.exif.camera_model) : null;
  const exifRows = result
    ? [
        ["相机", camera],
        ["镜头", result.exif.lens_model],
        ["焦距", result.exif.focal_length_mm ? `${result.exif.focal_length_mm}mm` : null],
        ["光圈", result.exif.aperture ? `f/${result.exif.aperture}` : null],
        ["快门", result.exif.shutter_speed],
        ["ISO", result.exif.iso],
        [
          "曝光补偿",
          result.exif.exposure_compensation !== null
            ? `${result.exif.exposure_compensation > 0 ? "+" : ""}${result.exif.exposure_compensation} EV`
            : null,
        ],
        ["测光", result.exif.metering_mode],
        ["白平衡", result.exif.white_balance],
        [
          "拍摄时间",
          result.exif.taken_at ? new Date(result.exif.taken_at).toLocaleString("zh-CN") : null,
        ],
      ]
    : [];

  return (
    <section className="upload-workspace" aria-live="polite">
      <div className="workflow-steps" aria-label="分析步骤">
        <span className="active"><b>01</b> 上传照片</span>
        <span><b>02</b> 拍摄目标</span>
        <span><b>03</b> AI 分析</span>
        <span><b>04</b> 下一张建议</span>
      </div>

      <div className="workspace-grid">
        <div className="upload-panel">
          {!previewUrl ? (
            <div
              className={`drop-zone ${dragging ? "dragging" : ""}`}
              onDragEnter={() => setDragging(true)}
              onDragLeave={() => setDragging(false)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDrop}
            >
              <span className="upload-icon"><ImageUp size={25} /></span>
              <h2>把照片放到这里</h2>
              <p>拖拽照片，或从手机与电脑中选择</p>
              <label className="button primary" htmlFor={inputId}>
                <Camera size={17} /> 选择照片
              </label>
              <small>JPG、PNG、WEBP · 最大 10 MB</small>
            </div>
          ) : (
            <div className="photo-preview">
              <Image src={previewUrl} alt="待分析照片预览" fill unoptimized sizes="(max-width: 760px) 100vw, 58vw" />
              <div className="preview-overlay">
                <div>
                  <strong>{file?.name}</strong>
                  <span>{file ? formatFileSize(file.size) : ""}</span>
                </div>
                <button className="icon-button" type="button" onClick={reset} aria-label="重新选择照片">
                  <RotateCcw size={18} />
                </button>
              </div>
            </div>
          )}

          <input
            id={inputId}
            className="visually-hidden"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleInput}
          />

          {error && (
            <div className="inline-error" role="alert">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {file && state !== "success" && (
            <button
              className="button primary upload-action"
              type="button"
              onClick={handleUpload}
              disabled={state === "uploading"}
            >
              {state === "uploading" ? "正在安全读取照片…" : "上传并读取 EXIF"}
            </button>
          )}
        </div>

        <aside className="metadata-panel">
          {!result ? (
            <div className="metadata-empty">
              <ShieldCheck size={28} />
              <h2>拍摄参数将在这里出现</h2>
              <p>照片会先经过格式与大小校验。位置 GPS 不会显示，也不会提供给后续 AI 分析。</p>
            </div>
          ) : (
            <>
              <div className="metadata-heading">
                <div>
                  <p className="eyebrow">Photo information</p>
                  <h2>照片与 EXIF</h2>
                </div>
                <span className="success-chip"><Check size={14} /> 已读取</span>
              </div>

              <div className="file-facts">
                <span>{result.format}</span>
                <span>{result.width} × {result.height}</span>
                <span>{formatFileSize(result.file_size)}</span>
              </div>

              {result.exif_notice && <div className="exif-notice">{result.exif_notice}</div>}

              <dl className="exif-list">
                {exifRows.map(([label, value]) => (
                  <div key={String(label)}>
                    <dt>{label}</dt>
                    <dd>{valueOrDash(value)}</dd>
                  </div>
                ))}
              </dl>

              <button className="button secondary full-width" type="button" onClick={reset}>
                分析另一张照片
              </button>
            </>
          )}
        </aside>
      </div>
    </section>
  );
}


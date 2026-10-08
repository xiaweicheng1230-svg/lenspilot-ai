"use client";

import { useEffect, useState } from "react";

type HealthResponse = {
  status: "ok";
  ai_mode: "mock" | "live";
};

type ConnectionState = "checking" | "connected" | "unavailable";

export function SystemStatus() {
  const [connection, setConnection] = useState<ConnectionState>("checking");
  const [aiMode, setAiMode] = useState<HealthResponse["ai_mode"] | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

    async function checkApi() {
      try {
        const response = await fetch(`${apiBaseUrl}/health`, { signal: controller.signal });
        if (!response.ok) throw new Error("API health check failed");
        const payload = (await response.json()) as HealthResponse;
        setAiMode(payload.ai_mode);
        setConnection("connected");
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setConnection("unavailable");
      }
    }

    void checkApi();
    return () => controller.abort();
  }, []);

  if (connection === "checking") {
    return <span className="status">正在检查本地 API…</span>;
  }

  if (connection === "unavailable") {
    return (
      <span className="status">
        <span className="status-dot unavailable" /> API 未连接
      </span>
    );
  }

  return (
    <span className="status">
      <span className="status-dot connected" /> API 已连接 · {aiMode === "mock" ? "Mock 模式" : "真实 AI 模式"}
    </span>
  );
}


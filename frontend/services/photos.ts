import type { PhotoUploadResult } from "@/types/photo";

type ApiErrorBody = {
  detail?: string | { message?: string };
};

export async function uploadPhoto(file: File): Promise<PhotoUploadResult> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";
  const body = new FormData();
  body.append("photo", file);

  const response = await fetch(`${apiBaseUrl}/photos`, {
    method: "POST",
    body,
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as ApiErrorBody;
    const message =
      typeof payload.detail === "string"
        ? payload.detail
        : payload.detail?.message ?? "照片上传失败，请稍后重试。";
    throw new Error(message);
  }

  return (await response.json()) as PhotoUploadResult;
}


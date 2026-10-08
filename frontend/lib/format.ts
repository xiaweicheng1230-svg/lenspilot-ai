export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kilobytes = bytes / 1024;
  if (kilobytes < 1024) return `${kilobytes.toFixed(1)} KB`;
  return `${(kilobytes / 1024).toFixed(1)} MB`;
}

export function formatCamera(make: string | null, model: string | null): string | null {
  const parts = [make, model].filter(Boolean);
  if (parts.length === 0) return null;
  return Array.from(new Set(parts)).join(" ");
}


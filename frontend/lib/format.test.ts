import { describe, expect, it } from "vitest";

import { formatCamera, formatFileSize } from "./format";

describe("formatFileSize", () => {
  it("formats bytes, kilobytes, and megabytes", () => {
    expect(formatFileSize(800)).toBe("800 B");
    expect(formatFileSize(1536)).toBe("1.5 KB");
    expect(formatFileSize(2 * 1024 * 1024)).toBe("2.0 MB");
  });
});

describe("formatCamera", () => {
  it("joins available camera fields without duplicating them", () => {
    expect(formatCamera("Canon", "EOS R50")).toBe("Canon EOS R50");
    expect(formatCamera("Apple", "Apple")).toBe("Apple");
    expect(formatCamera(null, null)).toBeNull();
  });
});


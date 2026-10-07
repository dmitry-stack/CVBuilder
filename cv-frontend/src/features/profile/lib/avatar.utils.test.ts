import { describe, it, expect } from "vitest";
import {
  validateAvatarFile,
  fileToBase64,
  MAX_AVATAR_SIZE,
} from "./avatar.utils";

describe("avatar.utils", () => {
  describe("validateAvatarFile", () => {
    it("returns valid for PNG file within size limit", () => {
      const file = new File(["dummy content"], "avatar.png", {
        type: "image/png",
      });
      const result = validateAvatarFile(file);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("returns valid for JPEG file within size limit", () => {
      const file = new File(["dummy content"], "avatar.jpg", {
        type: "image/jpeg",
      });
      const result = validateAvatarFile(file);
      expect(result.isValid).toBe(true);
    });

    it("returns invalid for unsupported file format", () => {
      const file = new File(["dummy content"], "doc.pdf", {
        type: "application/pdf",
      });
      const result = validateAvatarFile(file);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("Unsupported file format");
    });

    it("returns invalid when file size exceeds MAX_AVATAR_SIZE (0.5MB)", () => {
      const largeContent = new Uint8Array(MAX_AVATAR_SIZE + 100);
      const file = new File([largeContent], "large.png", {
        type: "image/png",
      });
      const result = validateAvatarFile(file);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("0.5MB limit");
    });
  });

  describe("fileToBase64", () => {
    it("converts a file to base64 Data URL string", async () => {
      const file = new File(["hello world"], "test.png", {
        type: "image/png",
      });
      const base64 = await fileToBase64(file);
      expect(base64).toMatch(/^data:image\/png;base64,/);
    });
  });
});

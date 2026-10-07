export const MAX_AVATAR_SIZE = 500_000; // 0.5 MB

export const ALLOWED_AVATAR_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/svg+xml",
];

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateAvatarFile(file: File): FileValidationResult {
  if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: "Unsupported file format. Please upload PNG, JPG, GIF, or SVG.",
    };
  }

  if (file.size > MAX_AVATAR_SIZE) {
    return {
      isValid: false,
      error: "File size exceeds the 0.5MB limit.",
    };
  }

  return { isValid: true };
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to convert image to base64"));
      }
    };
    reader.onerror = () => {
      reject(reader.error || new Error("Failed to read image file"));
    };
    reader.readAsDataURL(file);
  });
}

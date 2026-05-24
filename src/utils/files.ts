import { AppStorage } from "../App";

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return AppStorage.t("zero_bytes");
  const k = 1024;
  const sizes = [
    AppStorage.t("bytes"),
    AppStorage.t("kb"),
    AppStorage.t("mb"),
    AppStorage.t("gb"),
  ];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

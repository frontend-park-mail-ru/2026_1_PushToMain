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

export function getIconByContentType(contentType: string) {
  const imageRegex = /^image\/(jpeg|png|webp|gif|svg\+xml|avif|bmp|tiff)$/;
  const videoRegex =
    /^video\/(mp4|webm|ogg|quicktime|x-msvideo|x-matroska|mpeg|x-ms-wmv|3gpp|x-flv)$/;
  const spreadsheetRegex =
    /^application\/(vnd\.ms-excel|vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet|vnd\.oasis\.opendocument\.spreadsheet)$/;
  const archiveRegex =
    /^application\/(zip|x-tar|x-gzip|gzip|x-bzip2|x-7z-compressed|x-rar-compressed|x-xz)$/;
  const musicRegex =
    /^audio\/(mpeg|ogg|wav|x-wav|x-ms-wma|aac|flac|midi|x-midi|webm|mp4)$/;
  const presentationRegex =
    /^application\/(vnd\.ms-powerpoint|vnd\.openxmlformats-officedocument\.presentationml\.presentation|vnd\.oasis\.opendocument\.presentation)$/;

  if (imageRegex.test(contentType)) {
    return "image";
  }
  if (videoRegex.test(contentType)) {
    return "video";
  }
  if (spreadsheetRegex.test(contentType)) {
    return "spreadsheet";
  }
  if (archiveRegex.test(contentType)) {
    return "archive";
  }
  if (musicRegex.test(contentType)) {
    return "music";
  }
  if (presentationRegex.test(contentType)) {
    return "presentation";
  }
}

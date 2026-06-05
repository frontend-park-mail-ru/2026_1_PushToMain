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

export function trimFileName(fileName: string): string {
  if (fileName.length < 40) return fileName;

  const lastDotIdx = fileName.lastIndexOf(".");
  const extension = fileName.substring(lastDotIdx, fileName.length);
  return (
    fileName.substring(0, 17).trim() +
    "..." +
    fileName
      .substring(lastDotIdx - 12 + extension.length, fileName.length)
      .trim()
  );
}

export function getIconByContentType(contentType: string): string {
  const imageRegex = /^image\/(jpeg|png|webp|gif|svg\+xml|avif|bmp|tiff)$/;
  const videoRegex =
    /^video\/(mp4|webm|ogg|quicktime|x-msvideo|x-matroska|mpeg|x-ms-wmv|3gpp|x-flv)$/;
  const spreadsheetRegex =
    /^application\/(vnd\.ms-excel|vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet|vnd\.oasis\.opendocument\.spreadsheet)$/;
  const archiveRegex =
    /^application\/(zip|x-tar|x-gzip|gzip|x-bzip2|x-7z-compressed|x-rar-compressed|x-zip-compressed|x-xz)$/;
  const musicRegex =
    /^audio\/(mpeg|ogg|wav|x-wav|x-ms-wma|aac|flac|midi|x-midi|webm|mp4)$/;
  const presentationRegex =
    /^application\/(vnd\.ms-powerpoint|vnd\.openxmlformats-officedocument\.presentationml\.presentation|vnd\.oasis\.opendocument\.presentation)$/;
  const executableRegex =
    /^application\/(x-msdownload|x-msi|x-ms-dos-executable|x-msdos-program|x-sh|x-python|x-perl|x-php|x-shellscript|x-java-archive|java-archive|x-elf|x-mach-binary|x-executable)$/;
  const pdfRegex = /^application\/pdf$/;
  const documentRegex =
    /^(text\/(plain|rtf|richtext)|application\/(rtf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document|vnd\.oasis\.opendocument\.text))$/;
  const codeRegex =
    /^(text\/(javascript|html|css|xml|x-?php|x-?python|x-?perl|x-?ruby|x-shellscript|x-sh|x-bash|x-csrc|x-c\+\+src|x-java-source|markdown))|application\/(javascript|json|xml|xhtml\+xml|ld\+json|x-httpd-php|x-python|x-perl|x-sh|x-shellscript|x-csh)$/;

  if (imageRegex.test(contentType)) return "image";
  if (videoRegex.test(contentType)) return "video";
  if (pdfRegex.test(contentType)) return "pdf";
  if (documentRegex.test(contentType)) return "document";
  if (spreadsheetRegex.test(contentType)) return "spreadsheet";
  if (archiveRegex.test(contentType)) return "archive";
  if (musicRegex.test(contentType)) return "music";
  if (presentationRegex.test(contentType)) return "presentation";
  if (codeRegex.test(contentType)) return "code";
  if (executableRegex.test(contentType)) return "executable";

  return "";
}

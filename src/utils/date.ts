import { AppStorage } from "../App";

export function formatTime(dateString: string) {
  if (!dateString) return "";

  const date = new Date(dateString);
  const currentTime = new Date();

  if (isNaN(date.getTime())) return "";

  if (Math.abs(currentTime.getFullYear() - date.getFullYear()) >= 1) {
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  if (date.toDateString() === currentTime.toDateString()) {
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const yesterday = new Date(currentTime);
  yesterday.setDate(currentTime.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return AppStorage.t("yesterday");
  }

  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "short",
  });
}

// src/utils/emailNotifications.ts
import { getInbox } from "../api/ApiEmail";
import { AppStorage } from "../App";

let pollingInterval: ReturnType<typeof setInterval> | null = null;
let lastEmailId: string | number | null = null;

async function fetchLatestEmail() {
  try {
    const data = await getInbox(0);
    if (data && data.emails && data.emails.length > 0) {
      return data.emails[0];
    }
    return null;
  } catch (err) {
    console.error("Email polling error:", err);
    return null;
  }
}

async function sendNotificationToSW(email: any) {
  try {
    const reg = await navigator.serviceWorker.ready;
    const sw = reg.active || reg.installing || reg.waiting;
    if (!sw) return;

    sw.postMessage({
      emailId: email.id,
      title: `${AppStorage.t("new_email_from")} ${email.sender_email || AppStorage.t("from_unknown")}`,
      body: email.header || AppStorage.t("empty_subject"),
      icon: "/assets/svg/favicon.svg",
      url: `/read/${email.id}`,
    });
  } catch (err) {
    console.error("Failed to send notification to SW:", err);
  }
}

async function checkForNewEmails() {
  if (Notification.permission !== "granted") return;

  const email = await fetchLatestEmail();
  if (!email) return;

  if (lastEmailId === null) {
    lastEmailId = email.id;
    return;
  }

  if (email.id !== lastEmailId) {
    await sendNotificationToSW(email);
    lastEmailId = email.id;
  }
}

function startPolling() {
  if (pollingInterval) return;
  if (Notification.permission !== "granted") return;
  if (!AppStorage.notificationsEnabled) return;
  lastEmailId = null;
  checkForNewEmails();
  pollingInterval = setInterval(checkForNewEmails, 30000);
}

function stopPolling() {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
}

export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    alert(AppStorage.t("notifs_not_supported"));
    return;
  }
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    if (AppStorage.email) {
      startPolling();
    }
  }
}

let unsubscribe: (() => void) | null = null;

export function initEmailNotifications() {
  if (!("serviceWorker" in navigator)) return;

  unsubscribe = AppStorage.subscribe(() => {
    const isLoggedIn = !!AppStorage.email && AppStorage.email !== "";
    if (
      isLoggedIn &&
      Notification.permission === "granted" &&
      AppStorage.notificationsEnabled
    ) {
      startPolling();
    } else {
      stopPolling();
    }
  });

  if (
    AppStorage.email &&
    Notification.permission === "granted" &&
    AppStorage.notificationsEnabled
  ) {
    startPolling();
  }
}

export function destroyEmailNotifications() {
  stopPolling();
  if (unsubscribe) unsubscribe();
}

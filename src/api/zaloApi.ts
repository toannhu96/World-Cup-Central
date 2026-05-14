import { getStorage, requestSendNotification, setStorage } from "zmp-sdk/apis";

export const NOTIFICATION_STORAGE_KEY = "wc2026_notification_permission_enabled";

/**
 * Checks whether this Mini App has locally recorded notification opt-in.
 */
export async function checkNotificationPermission(): Promise<boolean> {
  try {
    const { [NOTIFICATION_STORAGE_KEY]: enabled } = await getStorage({
      keys: [NOTIFICATION_STORAGE_KEY],
    });
    return enabled === "true";
  } catch (error) {
    console.error("Error checking notification preference:", error);
    return false;
  }
}

/**
 * Requests permission to send notifications to the user.
 * Call this only from an explicit user action in a notification-related UI.
 */
export async function requestMatchNotifications(): Promise<boolean> {
  try {
    const response = await requestSendNotification();
    console.log("Notification request response:", response);
    await setStorage({
      data: {
        [NOTIFICATION_STORAGE_KEY]: "true",
      },
    });
    return true;
  } catch (error) {
    console.error("Error requesting notifications:", error);
    return false;
  }
}

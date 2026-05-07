import { requestSendNotification, getSetting, getStorage, setStorage } from "zmp-sdk/apis";

export const NOTIFICATION_STORAGE_KEY = "wc2026_notification_permission_asked";

/**
 * Checks if the user has already granted notification permissions for the given template IDs.
 */
export async function checkNotificationPermission(templateIds: string[]): Promise<boolean> {
  try {
    const { authSetting } = await getSetting();
    return !!authSetting["scope.userLocation"]; 
  } catch (error) {
    console.error("Error checking settings:", error);
    return false;
  }
}

/**
 * Requests permission to send notifications to the user.
 */
export async function requestMatchNotifications(templateIds: string[]): Promise<boolean> {
  try {
    const response = await requestSendNotification({
      templateIds: templateIds,
    });
    console.log("Notification request response:", response);
    return true;
  } catch (error) {
    console.error("Error requesting notifications:", error);
    return false;
  }
}

/**
 * Tracks if the user has been asked for notification permissions.
 */
export async function hasAskedForNotifications(): Promise<boolean> {
  try {
    const { [NOTIFICATION_STORAGE_KEY]: asked } = await getStorage({
      keys: [NOTIFICATION_STORAGE_KEY],
    });
    return asked === "true";
  } catch (error) {
    console.error("Error reading storage:", error);
    return false;
  }
}

/**
 * Marks that the user has been asked for notification permissions.
 */
export async function setAskedForNotifications(): Promise<void> {
  try {
    await setStorage({
      data: {
        [NOTIFICATION_STORAGE_KEY]: "true",
      },
    });
  } catch (error) {
    console.error("Error writing storage:", error);
  }
}

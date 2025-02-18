import { useState, useEffect } from "react";

export const useNotifications = () => {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");

  useEffect(() => {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications");
      return;
    }
    setPermission(Notification.permission);
  }, []);

  const requestPermission = async () => {
    if (!("Notification" in window)) return;

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === "granted") {
        console.log("Notification permission granted.");
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  };

  const showNotification = (title: string, options?: NotificationOptions) => {
    if (permission !== "granted") return;

    new Notification(title, {
      icon: "/notification-icon.png",
      ...options,
    });
  };

  return {
    permission,
    requestPermission,
    showNotification,
  };
};

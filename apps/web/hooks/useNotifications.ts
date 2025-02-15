import { useState } from "react";

export const useNotifications = () => {
  const [permission, setPermission] = useState(Notification.permission);

  const initializeNotifications = async () => {
    if (Notification.permission === "default") {
      const result = await Notification.requestPermission();
      setPermission(result);
    }
  };

  return { permission, initializeNotifications };
};

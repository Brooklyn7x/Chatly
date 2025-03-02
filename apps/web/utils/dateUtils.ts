export const formatLastSeen = (timestamp: number | string): string => {
  if (!timestamp) return "";

  // Convert to milliseconds if timestamp is in seconds
  const time =
    typeof timestamp === "number" && timestamp < 1000000000000
      ? timestamp * 1000
      : timestamp;

  const date = new Date(time);
  const now = new Date();

  // If same day, show time only
  if (date.toDateString() === now.toDateString()) {
    return `Today at ${formatTimeOnly(time)}`;
  }

  // If yesterday, show "Yesterday"
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday at ${formatTimeOnly(time)}`;
  }

  // Otherwise, show full date
  return date.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatTimeOnly = (timestamp: number | string | Date): string => {
  if (!timestamp) return "";

  const date =
    typeof timestamp === "string" || typeof timestamp === "number"
      ? new Date(timestamp)
      : timestamp;

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatMessageTimestamp = (
  timestamp: number | string | Date
): string => {
  return formatTimeOnly(timestamp);
};

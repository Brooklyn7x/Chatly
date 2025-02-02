export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL!,
    timeout: 10000,
  },
  websocket: {
    url: process.env.NEXT_PUBLIC_WEBSOCKET_URL!,
    reconnectAttempts: 5,
    reconnectInterval: 1000,
  },
  upload: {
    maxSize: 1024 * 1024 * 10,
    allowedTypes: ["image/jpeg", "image/png", "image/gif", "application/pdf"],
  },
} as const;

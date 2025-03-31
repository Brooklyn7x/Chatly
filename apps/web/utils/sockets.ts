import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

interface SocketInitOptions {
  token: string;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
  timeout?: number;
}

export const initializeSocket = ({
  token,
  reconnectionAttempts = 5,
  reconnectionDelay = 1000,
  timeout = 20000,
}: SocketInitOptions): Socket => {
  if (socket) {
    socket.disconnect();
  }

  const socketEndpoint = process.env.NEXT_PUBLIC_WEBSOCKET_URL!;

  if (!socketEndpoint) {
    throw new Error("Socket endpoint not defined in environment variables");
  }

  socket = io(socketEndpoint, {
    auth: { token },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts,
    reconnectionDelay,
    timeout,
  });

  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const emitEvent = (event: string, data: unknown): void => {
  if (socket) {
    socket.emit(event, data);
  }
};

export const onEvent = (event: string, callback: (...args: any[]) => void): void => {
  if (socket) {
    socket.on(event, callback);
  }
};
  

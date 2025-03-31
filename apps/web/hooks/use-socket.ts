// import { initializeSocket, disconnectSocket } from "@/utils/sockets";
// import { useEffect, useState } from "react";
// import { Socket } from "socket.io-client";

// export const useSocket = (token?: string) => {
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [isConnected, setIsConnected] = useState<boolean>(false);

//   useEffect(() => {
//     if (!token) return;

//     const socketInstance = initializeSocket({ token });
//     setSocket(socketInstance as any);

//     socketInstance.on("connect", () => {
//       console.log("Socket connected");
//       setIsConnected(true);
//     });

//     socketInstance.on("disconnect", (reason) => {
//       console.log("Socket disconnected:", reason);
//       setIsConnected(false);
//     });

//     socketInstance.on("connect_error", (err) => {
//       console.error("Connection error:", err.message);
//     });

//     return () => {
//       console.log("Cleaning up socket");
//       disconnectSocket();
//     };
//   }, [token]);

//   return { socket, isConnected };
// };

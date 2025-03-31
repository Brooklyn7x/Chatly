// import { io, Socket } from "socket.io-client";
// import { EventEmitter } from "events";

// export class SocketService extends EventEmitter {
//   private socket: Socket | null = null;
//   private cleanupTimer: NodeJS.Timeout | null = null;
//   private reconnectAttempts = 0;
//   private maxReconnectAttempts = 5;
//   private reconnectTimer: NodeJS.Timeout | null = null;
//   private token: string = "";
//   private isConnecting = false;
//   private manuallyDisconnected = false;
//   private pingInterval: NodeJS.Timeout | null = null;
//   private pingTimeout: NodeJS.Timeout | null = null;
//   private lastPingTime: number = 0;
//   private connectionHealthy: boolean = true;
//   private lastConnectionAttempt: number = 0;
//   private connectionAttemptThrottleMs: number = 1000;

//   constructor() {
//     super();
//     this.initialize = this.initialize.bind(this);
//     this.disconnect = this.disconnect.bind(this);
//     this.setupCleanup = this.setupCleanup.bind(this);
//     // this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
//     this.reconnect = this.reconnect.bind(this);
//     // this.ping = this.ping.bind(this);
//     // this.resetPingTimeout = this.resetPingTimeout.bind(this);
//   }

//   initialize(token: string) {
//     const now = Date.now();
//     if (now - this.lastConnectionAttempt < this.connectionAttemptThrottleMs) {
//       console.log(
//         "Connection attempt throttled, too many attempts in short period"
//       );
//       setTimeout(
//         () => this.initialize(token),
//         this.connectionAttemptThrottleMs
//       );
//       return this.socket;
//     }
//     this.lastConnectionAttempt = now;

//     if (this.socket?.connected && this.token === token) {
//       console.log("Socket already connected with same token, reusing");
//       return this.socket;
//     }

//     if (this.isConnecting && this.token === token) {
//       console.log("Socket connection already in progress with same token");
//       return this.socket;
//     }

//     if (!token) {
//       console.log("No token provided for socket initialization");
//       this.emit("connect_error", new Error("No token provided"));
//       return null;
//     }

//     this.token = token;
//     this.isConnecting = true;
//     this.manuallyDisconnected = false;
//     this.connectionHealthy = true;

//     try {
//       if (this.token !== token) {
//         this.cleanupSocket();
//       }
//       console.log("Initializing socket connection...");
//       this.socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL!, {
//         auth: { token },
//         withCredentials: true,
//         autoConnect: true,
//         reconnection: false,
//         timeout: 10000,
//         transports: ["websocket", "polling"],
//       });

//       this.setupEventListeners();
//       this.setupCleanup();
//       return this.socket;
//     } catch (error) {
//       console.log("Socket initialization error:", error);
//       this.isConnecting = false;
//       this.emit("connect_error", error);
//       return null;
//     }
//   }

//   private cleanupSocket() {
//     if (this.socket) {
//       this.socket.removeAllListeners();
//       this.socket.disconnect();
//       this.socket = null;
//     }

//     if (this.pingInterval) {
//       clearInterval(this.pingInterval);
//       this.pingInterval = null;
//     }

//     if (this.pingTimeout) {
//       clearTimeout(this.pingTimeout);
//       this.pingTimeout = null;
//     }
//   }

//   private setupEventListeners() {
//     if (!this.socket) return;
//     this.socket.on("connect", () => {
//       console.log("Socket connected successfully");
//       this.isConnecting = false;
//       this.reconnectAttempts = 0;
//       this.connectionHealthy = true;
//       this.emit("connected");

//       if (this.reconnectTimer) {
//         clearTimeout(this.reconnectTimer);
//         this.reconnectTimer = null;
//       }
//     });

//     this.socket.on("disconnect", (reason) => {
//       console.log("Socket disconnected:", reason);
//       this.isConnecting = false;
//       this.connectionHealthy = false;
//       this.emit("disconnected", reason);

//       if (this.pingInterval) {
//         clearInterval(this.pingInterval);
//         this.pingInterval = null;
//       }

//       if (this.pingTimeout) {
//         clearTimeout(this.pingTimeout);
//         this.pingTimeout = null;
//       }

//       if (
//         reason === "io client disconnect" ||
//         reason === "io server disconnect" ||
//         this.manuallyDisconnected
//       ) {
//         console.log("Not attempting reconnect due to intentional disconnect");
//         return;
//       }

//       this.attemptReconnect();
//     });

//     this.socket.on("connect_error", (err) => {
//       console.log("Socket connection error:", err.message);
//       this.isConnecting = false;
//       this.connectionHealthy = false;
//       this.emit("connect_error", err);

//       if (!this.manuallyDisconnected) {
//         this.attemptReconnect();
//       }
//     });

//     this.socket.on("chat_joined", (data: any) => {
//       this.emit("chat_joined", data);
//     });

//     this.socket.on("chat_leaved", (data) => {
//       this.emit("chat_leaved", data);
//     });

//     this.socket.on("chat_error", (error: any) => {
//       this.emit("chat_error", error);
//     });

//     this.socket.on("message:new", (response: any) => {
//       this.emit("message:new", response);
//     });

//     this.socket.on("message:sent", (response: any) => {
//       this.emit("message:sent", response);
//     });

//     this.socket.on("message:delivered", (response: any) => {
//       this.emit("message:delivered", response);
//     });

//     this.socket.on(
//       "message:read:ack",
//       (data: {
//         conversationId: string;
//         messageIds: string[];
//         readBy: string;
//         timestamp: string;
//       }) => {
//         this.emit("message:read:ack", data);
//       }
//     );

//     this.socket.on("message:edited", (data: any) => {
//       this.emit("message:edited", data);
//     });

//     this.socket.on("message:deleted", (data: any) => {
//       this.emit("message:deleted", data);
//     });

//     this.socket.on("message:error", (error: any) => {
//       this.emit("message:error", error);
//     });

//     this.socket.on("typing:start", (data: any) => {
//       this.emit("typing:start", data);
//     });

//     this.socket.on("typing:stop", (data: any) => {
//       this.emit("typing:stop", data);
//     });

//     this.socket.on("typing:update", (data: any) => {
//       this.emit("typing:update", data);
//     });

//     this.socket.on("group:joined", (data) => {
//       this.emit("group:joined", data);
//     });

//     this.socket.on("group:member_added", (data) => {
//       this.emit("group:member_added", data);
//     });

//     this.socket.on("group:member_removed", (data) => {
//       this.emit("group:member_removed", data);
//     });

//     this.socket.on("group:updated", (data) => {
//       this.emit("group:updated", data);
//     });

//     this.socket.on("group:invite_sent", (data) => {
//       this.emit("group:invite_sent", data);
//     });

//     this.socket.on("group:invite_received", (data) => {
//       this.emit("group:invite_received", data);
//     });

//     this.socket.on("group:error", (error) => {
//       this.emit("group:error", error);
//     });

//     this.socket.on("user:status_change", (data: any) => {
//       this.emit("user:status_change", data);
//     });

//     this.socket.on("error", (error) => {
//       console.log("Socket error:", error);
//       this.emit("error", error);
//     });
//   }

//   private attemptReconnect() {
//     if (this.reconnectTimer || this.manuallyDisconnected || !this.token) {
//       return;
//     }

//     this.reconnectAttempts++;

//     if (this.reconnectAttempts > this.maxReconnectAttempts) {
//       console.log(
//         `Max reconnection attempts (${this.maxReconnectAttempts}) reached`
//       );
//       this.emit(
//         "connect_error",
//         new Error("Max reconnection attempts reached")
//       );
//       setTimeout(() => {
//         this.reconnectAttempts = 0;
//       }, 60000);
//       return;
//     }

//     const delay = Math.min(1000 * Math.pow(1.5, this.reconnectAttempts), 30000);
//     console.log(
//       `Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`
//     );

//     this.reconnectTimer = setTimeout(() => {
//       this.reconnect();
//       this.reconnectTimer = null;
//     }, delay);
//   }

//   private reconnect() {
//     if (this.manuallyDisconnected || !this.token) return;
//     if (this.isConnecting) return;
//     console.log("Attempting to reconnect...");
//     this.initialize(this.token);
//   }

//   private disconnectForVisibility() {
//     this.isConnecting = false;

//     this.connectionHealthy = false;

//     if (this.reconnectTimer) {
//       clearTimeout(this.reconnectTimer);
//       this.reconnectTimer = null;
//     }

//     if (this.socket) {
//       console.log("Disconnecting socket due to page hidden");
//       this.socket.disconnect();
//     }

//     if (this.cleanupTimer) {
//       clearTimeout(this.cleanupTimer);
//       this.cleanupTimer = null;
//     }
//   }

//   // private handleVisibilityChange() {
//   //   if (document.visibilityState === "hidden") {
//   //     console.log(
//   //       "Page hidden, disconnecting socket without removing listeners"
//   //     );
//   //     this.disconnectForVisibility();
//   //   } else if (document.visibilityState === "visible") {
//   //     console.log("Page visible, attempting to reconnect");

//   //     if (this.cleanupTimer) {
//   //       clearTimeout(this.cleanupTimer);
//   //       this.cleanupTimer = null;
//   //     }

//   //     if (this.token && this.socket) {
//   //       console.log("Reconnecting socket after page became visible");

//   //       if (this.socket && !this.socket.connected && !this.isConnecting) {
//   //         this.isConnecting = true;
//   //         this.socket.connect();
//   //       } else {
//   //         this.reconnect();
//   //       }
//   //     }
//   //   }
//   // }
//   private setupCleanup() {
//     if (this.cleanupTimer) {
//       clearTimeout(this.cleanupTimer);
//       this.cleanupTimer = null;
//     }

//     if (typeof window !== "undefined") {
//       window.removeEventListener("beforeunload", this.disconnect);
//       window.removeEventListener("pagehide", this.disconnect);
//       // document.removeEventListener(
//       //   "visibilitychange",
//       //   this.handleVisibilityChange
//       // );
//       window.addEventListener("beforeunload", this.disconnect);
//       window.addEventListener("pagehide", this.disconnect);
//       // document.addEventListener(
//       //   "visibilitychange",
//       //   this.handleVisibilityChange
//       // );

//       // window.addEventListener("online", () => {
//       //   console.log("Browser went online");
//       //   if (
//       //     !this.socket?.connected &&
//       //     !this.isConnecting &&
//       //     !this.manuallyDisconnected
//       //   ) {
//       //     console.log("Reconnecting after coming online");
//       //     this.reconnect();
//       //   }
//       // });

//       // window.addEventListener("offline", () => {
//       //   console.log("Browser went offline");
//       //   this.connectionHealthy = false;
//       // });
//     }
//   }

//   sendMessage(
//     // chatId: string,
//     // content: string,
//     // type: string,
//     // tempId?: string,
//     // recipientId?: string
//     data: any
//   ) {
//     if (!this.socket?.connected) {
//       throw new Error("Socket not connected");
//     }
//     this.socket.emit(
//       "message:send",
//       // conversationId: chatId,
//       // type,
//       // content,
//       // tempId,
//       // recipientId,
//       data
//     );
//   }

//   editMessage(messageId: string, content: string) {
//     if (!this.socket?.connected) {
//       throw new Error("Socket not connected");
//     }
//     this.socket.emit("message:edit", {
//       messageId,
//       content,
//     });
//   }

//   deleteMessage(messageId: string) {
//     if (!this.socket?.connected) {
//       throw new Error("Socket not connected");
//     }
//     this.socket.emit("message:delete", {
//       messageId,
//     });
//   }

//   markMessageAsRead(messageIds: string[], chatId: string) {
//     if (!this.socket?.connected) return;
//     this.socket.emit("message:read", {
//       conversationId: chatId,
//       messageIds,
//     });
//   }

//   joinChat(chatId: string) {
//     if (this.socket?.connected) {
//       this.socket.emit("chat:join", chatId);
//     }
//   }

//   leaveChat(chatId: string) {
//     if (this.socket?.connected) {
//       this.socket.emit("chat:leave", chatId);
//     }
//   }

//   updateChat(data: any) {
//     if (this.socket?.connected) {
//       this.socket.emit("chat:update", { data });
//     }
//   }

//   updateGroupSetting(data: any) {
//     if (this.socket?.connected) {
//       this.socket.emit("group:update_settings", { data });
//     }
//   }

//   addGroupMember(data: any) {
//     if (this.socket?.connected) {
//       this.socket.emit("group:add_member", { data });
//     }
//   }

//   removeGroupMember(data: any) {
//     if (this.socket?.connected) {
//       this.socket.emit("group:remove_member", { data });
//     }
//   }

//   joinGroup(data: { groupId: string }) {
//     if (this.socket?.connected) {
//       this.socket.emit("group:join", data);
//     }
//   }

//   leaveGroup(data: any) {
//     if (this.socket?.connected) {
//       this.socket.emit("group:leave", { data });
//     }
//   }

//   updateGroup(data: any) {
//     if (this.socket?.connected) {
//       this.socket.emit("group:update", { data });
//     }
//   }

//   sendTypingStart(conversationId: string, userId: string) {
//     if (this.socket?.connected) {
//       this.socket.emit("typing:start", {
//         conversationId,
//         userId,
//       });
//     }
//   }

//   sendTypingStop(conversationId: string, userId: string) {
//     if (!this.socket?.connected) return;
//     this.socket.emit("typing:stop", {
//       conversationId,
//       userId,
//     });
//   }

//   isConnected(): boolean {
//     return !!this.socket?.connected && this.connectionHealthy;
//   }

//   getConnectionState() {
//     return {
//       connected: !!this.socket?.connected,
//       connecting: this.isConnecting,
//       healthy: this.connectionHealthy,
//       reconnectAttempts: this.reconnectAttempts,
//     };
//   }

//   disconnect() {
//     this.isConnecting = false;
//     this.manuallyDisconnected = true;
//     this.connectionHealthy = false;

//     if (this.reconnectTimer) {
//       clearTimeout(this.reconnectTimer);
//       this.reconnectTimer = null;
//     }

//     if (this.socket) {
//       console.log("Manually disconnecting socket");
//       this.socket.removeAllListeners();
//       this.socket.close();
//       this.socket.disconnect();
//       this.socket = null;
//     }

//     if (typeof window !== "undefined") {
//       window.removeEventListener("beforeunload", this.disconnect);
//       window.removeEventListener("pagehide", this.disconnect);
//       // document.removeEventListener(
//       //   "visibilitychange",
//       //   this.handleVisibilityChange
//       // );
//       window.removeEventListener("online", this.reconnect);
//       window.removeEventListener("offline", () => {
//         this.connectionHealthy = false;
//       });
//     }

//     // Clear any cleanup timer
//     if (this.cleanupTimer) {
//       clearTimeout(this.cleanupTimer);
//       this.cleanupTimer = null;
//     }

//     // Emit disconnected event
//     this.emit("disconnected", "Manual disconnect");
//   }
// }

// export const socketService = new SocketService();

// // let socket: Socket | null = null;
// // export const initializeSocket = (token: string) => {
// //   if (socket) {
// //     return socket;
// //   }

// //   socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL, {
// //     auth: { token },
// //     autoConnect: true,
// //     reconnection: true,
// //     reconnectionAttempts: 5,
// //     reconnectionDelay: 1000,
// //   });

// //   socket.on("connect", () => {
// //     console.log("Socket connected");
// //   });
// //   socket.on("disconnect", () => {
// //     console.log("Socket disconnected");
// //   });
// //   socket.on("error", (error) => {
// //     console.log("Socket connection error:", error.message);
// //   });

// //   return socket;
// // };

// // export const getSocket = (): Socket | null => socket;

// // export const disconnectSocket = (): void => {
// //   if (socket) {
// //     socket.disconnect();
// //     socket = null;
// //   }
// // };

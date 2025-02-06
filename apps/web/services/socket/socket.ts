// import useAuthStore from "@/store/useAuthStore";
// import { io, Socket } from "socket.io-client";

// interface Message {
//   senderId: string;
//   receiverId?: string;
//   groupId?: string;
//   content: string;
//   conversationId: string;
//   type: string;
// }

// interface GroupCreateData {
//   name: string;
//   description?: string;
//   participants: string[];
// }

// interface GroupResponse {
//   conversationId: string;
//   title: string;
//   createdBy: string;
// }

// interface UserStatus {
//   userId: string;
//   status: "offline" | "online";
// }
// interface MessageStatus {
//   messageId: string;
//   status: "sent" | "delivered" | "read";
//   conversationId: string;
//   timestamp: Date;
//   readBy?: string;
// }

// interface MarksAsRead {
//   messageIds: string[];
//   conversationId: string;
// }

// interface FileUploadData {
//   file: File;
//   conversationId: string;
//   receiverId?: string;
//   caption?: string;
//   type: "image" | "video" | "document";
// }

// interface FileUploadResponse {
//   fileId: string;
//   messageId: string;
//   attachment: {
//     url: string;
//     name: string;
//     type: string;
//     size: number;
//     metadata: any;
//   };
// }

// export class SocketService {
//   private socket: Socket | null = null;
//   private messageCallbacks: ((message: Message) => void)[] = [];
//   private typingCallbacks: ((data: {
//     userId: string;
//     isTyping: boolean;
//   }) => void)[] = [];
//   private messageStatusCallbacks: ((data: MessageStatus) => void)[] = [];
//   private groupCallbacks: ((data: GroupResponse) => void)[] = [];
//   private statusCallbacks: ((data: UserStatus) => void)[] = [];

//   connect(): void {
//     if (this.socket?.connected) return;
//     const token = useAuthStore.getState().accessToken;
//     if (!token) {
//       throw new Error("No authentication token found");
//     }
//     this.socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL!, {
//       auth: { token },
//       transports: ["websocket"],
//       reconnection: true,
//       reconnectionAttempts: 5,
//       reconnectionDelay: 3000,
//       timeout: 10000,
//     });

//     this.setupSocketListeners();
//   }

//   private setupSocketListeners(): void {
//     if (!this.socket) return;

//     this.socket.on("connect", () => {
//       console.log("Connected to socket server");
//     });

//     this.socket.on("disconnect", () => {
//       console.log("Disconnected from socket server");
//     });

//     this.socket.on("connect_error", (err) => {
//       console.error("Connection error:", err);
//     });

//     this.socket.on("user:status", (data: UserStatus) => {
//       this.statusCallbacks.forEach((callback) => callback(data));
//     });

//     this.socket.on("message:new", (message: Message) => {
//       this.messageCallbacks.forEach((callback) => callback(message));
//     });

//     this.socket.on(
//       "message:sent",
//       (response: {
//         messageId: string;
//         tempId: string;
//         status: "sent";
//         timestamp: Date;
//       }) => {
//         console.log("Message sent confirmation:", response);
//         // useMessageStore
//         //   .getState()
//         //   .updateMessageId(response.tempId, response.messageId);
//       }
//     );

//     this.socket.on("message:status", (data: MessageStatus) => {
//       this.messageStatusCallbacks.forEach((callback) => callback(data));
//     });

//     this.socket.on("message:error", (error) => {
//       console.error("Message error:", error);
//     });

//     this.socket.on("file:error", (error) => {
//       console.error("File error", error);
//     });

//     this.socket.on("group:created", (data: GroupResponse) => {
//       this.groupCallbacks.forEach((callback) => callback(data));
//     });

//     this.socket.on(
//       "typing:update",
//       (data: { userId: string; isTyping: boolean }) => {
//         this.typingCallbacks.forEach((callback) => callback(data));
//       }
//     );

//     this.socket.on("group:create:error", (error) => {
//       console.error("Group creation error:", error);
//     });
//   }

//   disconnect(): void {
//     if (this.socket) {
//       this.socket.disconnect();
//       this.socket = null;
//     }
//   }
//   onUserStatusChange(callback: (data: UserStatus) => void): () => void {
//     this.statusCallbacks.push(callback);
//     return () => {
//       this.statusCallbacks = this.statusCallbacks.filter(
//         (cb) => cb !== callback
//       );
//     };
//   }

//   sendMessage(message: Message): void {
//     if (!this.socket?.connected) {
//       console.error("Socket not connected");
//       return;
//     }
//     this.socket.emit("message:send", message);
//   }
//   onMessageSent(
//     callback: (data: {
//       messageId: string;
//       tempId?: string;
//       status: "sent";
//       timestamp: Date;
//     }) => void
//   ): () => void {
//     if (!this.socket) return () => {};

//     const handler = (data: any) => callback(data);
//     this.socket.on("message:sent", handler);

//     return () => {
//       this.socket?.off("message:sent", handler);
//     };
//   }

//   onMessageReceived(callback: (message: any) => void): () => void {
//     this.messageCallbacks.push(callback);
//     return () => {
//       this.messageCallbacks = this.messageCallbacks.filter(
//         (cb) => cb !== callback
//       );
//     };
//   }

//   onMessageStatus(callback: (message: MessageStatus) => void): () => void {
//     this.messageStatusCallbacks.push(callback);
//     return () => {
//       this.messageStatusCallbacks = this.messageStatusCallbacks.filter(
//         (cb) => cb !== callback
//       );
//     };
//   }

//   uploadFile(data: FileUploadData): Promise<FileUploadResponse> {
//     console.log(data, "file uploading....");
//     return new Promise((resolve, reject) => {
//       if (!this.socket?.connected) {
//         reject(new Error("Socket not connected"));
//         return;
//       }

//       const reader = new FileReader();
//       reader.onload = () => {
//         const base64String = reader.result as string;

//         if (!base64String) {
//           reject(new Error("Failed to read file data"));
//           return;
//         }

//         const fileData = {
//           file: base64String,
//           originalname: data.file.name,
//           mimetype: data.file.type,
//           size: data.file.size,
//           conversationId: data.conversationId,
//           receiverId: data.receiverId,
//           type: data.type,
//         };

//         console.log("Sending file data", {
//           filename: fileData.originalname,
//           type: fileData.type,
//           size: fileData.size,
//         });

//         this.socket?.emit("file:upload", fileData);

//         this.socket?.once("file:uploaded", (response: FileUploadResponse) => {
//           resolve(response);
//         });

//         this.socket?.once("file:error", (error) => {
//           reject(error);
//           console.log(error, "file error");
//         });
//       };

//       reader.onerror = () => {
//         const error = new Error("Failed to read file");
//         console.error(error);
//         reject(error);
//       };
//       reader.readAsArrayBuffer(data.file);
//     });
//   }

//   markMessagesAsRead(data: {
//     messageIds: string[];
//     conversationId: string;
//   }): void {
//     if (!this.socket?.connected) {
//       console.error("Socket not connected");
//       return;
//     }
//     this.socket.emit("message:read", data);
//   }

//   onMessagesReadAck(
//     callback: (data: {
//       messageIds: string[];
//       conversationId: string;
//       timestamp: Date;
//     }) => void
//   ): () => void {
//     if (!this.socket) return () => {};

//     const handler = (data: any) => callback(data);
//     this.socket.on("messages:read:ack", handler);

//     return () => {
//       this.socket?.off("messages:read:ack", handler);
//     };
//   }

//   startTyping(receiverId: string): void {
//     if (!this.socket?.connected) return;
//     this.socket.emit("typing:start", { receiverId });
//   }

//   stopTyping(receiverId: string): void {
//     if (!this.socket?.connected) return;
//     this.socket.emit("typing:stop", { receiverId });
//   }

//   onTypingUpdate(
//     callback: (data: { userId: string; isTyping: boolean }) => void
//   ): () => void {
//     this.typingCallbacks.push(callback);
//     return () => {
//       this.typingCallbacks = this.typingCallbacks.filter(
//         (cb) => cb !== callback
//       );
//     };
//   }

//   createGroup(data: {
//     name?: string;
//     description?: string;
//     participantIds: string[];
//     avatar?: string;
//   }): Promise<GroupResponse> {
//     console.log("Creating group with participants:", data);
//     return new Promise((resolve, reject) => {
//       if (!this.socket?.connected) {
//         reject(new Error("Socket not connected"));
//         return;
//       }

//       this.socket.emit("group:create", data);

//       const handleSuccess = (response: GroupResponse) => {
//         this.socket?.off("group:created", handleSuccess);
//         this.socket?.off("group:create:error", handleError);
//         resolve(response);
//       };

//       const handleError = (error: any) => {
//         this.socket?.off("group:created", handleSuccess);
//         this.socket?.off("group:create:error", handleError);
//         reject(error);
//       };

//       this.socket.once("group:created", handleSuccess);
//       this.socket.once("group:create:error", handleError);
//     });
//   }

//   onGroupCreated(callback: (data: GroupResponse) => void): () => void {
//     this.groupCallbacks.push(callback);
//     return () => {
//       this.groupCallbacks = this.groupCallbacks.filter((cb) => cb !== callback);
//     };
//   }

//   joinGroup(conversationId: string): void {
//     if (!this.socket?.connected) return;
//     this.socket.emit("group:join", { conversationId });
//   }

//   leaveGroup(conversationId: string): void {
//     if (!this.socket?.connected) return;
//     this.socket.emit("group:leave", { conversationId });
//   }
// }

// const socketService = new SocketService();
// export default socketService;

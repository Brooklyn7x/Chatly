"use client";
import { createContext, useContext, useEffect, ReactNode } from "react";
import { useSocketStore } from "@/store/useSocketStore";
import { useChatStore } from "@/store/useChatStore";
import { Socket } from "socket.io-client";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "sonner";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  reconnect: () => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const {
    socket,
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    reconnect,
    on,
    off,
  } = useSocketStore();

  const { isAuthenticated, user } = useAppStore();

  const {
    addMessage,
    updateMessage,
    addTypingUser,
    removeTypingUser,
    setTypingUsers,
    updateUserStatus,
    setUserOnline,
    setUserOffline,
    updateChat,
    addNewChat,
    deleteChat,
  } = useChatStore();

  // Connect/disconnect based on authentication
  useEffect(() => {
    if (isAuthenticated && !isConnected && !isConnecting) {
      console.log("🔗 Connecting to socket...");
      connect();
    } else if (!isAuthenticated && isConnected && !isConnecting) {
      console.log("🔌 Disconnecting from socket...");
      disconnect();
    }
  }, [isAuthenticated, isConnected, isConnecting, connect, disconnect]);

  // ONLY LISTEN TO EVENTS - NO EMITTING HERE!
  useEffect(() => {
    if (!socket || !isConnected) {
      console.log("⚠️ Socket not ready for listeners");
      return;
    }

    console.log("🎧 SocketProvider: Setting up event listeners");

    // ===== MESSAGE EVENTS =====
    const handleNewMessage = (data: { message: any }) => {
      console.log("📨 NEW MESSAGE RECEIVED:", data);
      if (data && data.message) {
        addMessage(data.message);
        toast.success("New message received");
      }
    };

    const handleMessageAck = (data: { tempId: string; message: any }) => {
      console.log("✅ MESSAGE ACK:", data);
      if (data && data.message && data.tempId) {
        updateMessage(data.message.conversationId, data.message._id, {
          ...data.message,
          _id: data.message._id,
          id: data.message._id,
        });
      }
    };

    const handleMessageError = (data: { message: string }) => {
      console.error("❌ MESSAGE ERROR:", data);
      if (data && data.message) {
        toast.error(data.message);
      }
    };

    // ===== TYPING EVENTS =====
    const handleTypingStart = (data: { chatId: string; userId: string }) => {
      console.log("⌨️ TYPING START:", data);
      if (data && data.chatId && data.userId && data.userId !== user?.id) {
        addTypingUser(data.chatId, data.userId);
      }
    };

    const handleTypingStop = (data: { chatId: string; userId: string }) => {
      console.log("⌨️ TYPING STOP:", data);
      if (data && data.chatId && data.userId) {
        removeTypingUser(data.chatId, data.userId);
      }
    };

    // ===== CHAT EVENTS =====
    const handleChatJoined = (data: { userId: string; chatId: string }) => {
      console.log("🚪 CHAT JOINED:", data);
    };

    const handleConversationNew = (payload: { data: any }) => {
      console.log("🗨️ NEW CONVERSATION:", payload);
      if (payload && payload.data) {
        addNewChat(payload.data);
      }
    };

    // ===== CONNECTION EVENTS =====
    const handleConnected = () => {
      console.log("🟢 SOCKET CONNECTED");
    };

    const handleDisconnected = () => {
      console.log("🔴 SOCKET DISCONNECTED");
      setTypingUsers("", []);
    };

    // Register event listeners
    on("connect", handleConnected);
    on("disconnect", handleDisconnected);
    on("message_new", handleNewMessage);
    on("message_ack", handleMessageAck);
    on("message_error", handleMessageError);
    on("typing_start", handleTypingStart);
    on("typing_stop", handleTypingStop);
    on("chat_joined", handleChatJoined);
    on("conversation:new", handleConversationNew);

    // Cleanup
    return () => {
      console.log("🧹 SocketProvider: Cleaning up listeners");
      off("connect", handleConnected);
      off("disconnect", handleDisconnected);
      off("message_new", handleNewMessage);
      off("message_ack", handleMessageAck);
      off("message_error", handleMessageError);
      off("typing_start", handleTypingStart);
      off("typing_stop", handleTypingStop);
      off("chat_joined", handleChatJoined);
      off("conversation:new", handleConversationNew);
    };
  }, [
    socket,
    isConnected,
    user?.id,
    addMessage,
    updateMessage,
    addTypingUser,
    removeTypingUser,
    setTypingUsers,
    addNewChat,
    on,
    off,
  ]);

  // Simple context - only connection state
  const contextValue: SocketContextType = {
    socket,
    isConnected,
    isConnecting,
    error,
    reconnect,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;

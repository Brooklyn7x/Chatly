import React, { useEffect } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import EmptyChat from "./EmptyChat";
import useChat from "@/hooks/useChat";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

const ChatArea = () => {
  // Only use useChat - clean and simple!
  const {
    isConnected,
    isConnecting,
    error,
    reconnect,
    activeChatId,
    activeChat,
    joinChat,
  } = useChat();

  // Join chat when activeChatId changes and we're connected
  useEffect(() => {
    if (activeChatId && isConnected) {
      console.log("🚪 ChatArea: Joining chat", activeChatId);
      joinChat(activeChatId);
    }
  }, [activeChatId, isConnected, joinChat]);

  // Show connection error
  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex flex-col gap-2">
            <span>Connection failed: {error}</span>
            <Button onClick={reconnect} variant="outline" size="sm">
              Reconnect
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show connecting state
  if (isConnecting) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
          <span>Connecting...</span>
        </div>
      </div>
    );
  }

  // Show disconnected state
  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <Alert className="max-w-md">
          <WifiOff className="h-4 w-4" />
          <AlertDescription className="flex flex-col gap-2">
            <span>Not connected to server</span>
            <Button onClick={reconnect} variant="outline" size="sm">
              Connect
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show empty state if no active chat
  if (!activeChatId || !activeChat) {
    return <EmptyChat />;
  }

  // Show the chat interface
  return (
    <div className="flex flex-col h-full">
      <ChatHeader chat={activeChat} />
      <ChatMessages chatId={activeChatId} />
      <ChatInput />

      {/* Debug info for development */}
      {process.env.NODE_ENV === "development" && (
        <div className="text-xs text-muted-foreground p-2 border-t bg-muted/30">
          <div className="flex items-center gap-4">
            <span>
              Connection: {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
            </span>
            <span>Chat: {activeChatId?.slice(-6) || "None"}</span>
            <span>Type: {activeChat?.type || "N/A"}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatArea;

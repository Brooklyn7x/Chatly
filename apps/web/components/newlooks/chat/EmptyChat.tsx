import { MessageCircle } from "lucide-react";

const EmptyChat = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-center p-6">
      <div className="bg-primary/10 rounded-full p-4 mb-4">
        <MessageCircle size={32} className="text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
      <p className="text-muted-foreground">
        Choose a chat from the sidebar or start a new conversation
      </p>
    </div>
  );
};

export default EmptyChat;

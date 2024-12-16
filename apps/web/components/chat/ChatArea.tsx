import ChatHeader from "../sidebar/SidebarHeader";
import ChatList from "../message/MessageList";
import ChatInput from "../message/MessageInput";
import { useState } from "react";
import { ArrowLeft, Bell, Pencil, Phone, Trash, X } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import MessageList from "../message/MessageList";
import MessageInput from "../message/MessageInput";
import { useChatStore } from "@/store/useChatStore";

export default function ChatArea() {
  const { selectedChatId, chats, sendMessage } = useChatStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  console.log(selectedChatId)
  const currentChat = chats.find((chat) => chat.id === selectedChatId);
  const handleSendMessage = async (content: string, attachments?: File[]) => {
    if (!selectedChatId || !content.trim()) return;
    try {
      await sendMessage(selectedChatId, content);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };
  return (
    <div className="flex-1 flex flex-col relative">
      <ChatHeader
        onProfileClick={() => setIsProfileOpen(!isProfileOpen)}
        user={currentChat?.participants[0]}
      />
      <MessageList
        messages={currentChat?.messages}
        currentUserId={useChatStore.getState().currentUser?.id || ""}
      />
      <MessageInput onSendMessage={handleSendMessage} />

      <UserProfilePanel
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
}

interface UserProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

function UserProfilePanel({ isOpen, onClose }: UserProfilePanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  if (!isOpen) return null;
  return (
    <div
      className={cn(
        "fixed inset-y-0 right-0 w-full sm:w-[400px] bg-background sm:border shadow-md",
        "transition-transform duration-300 ease-in-out",
        "flex flex-col",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="flex-none border-b px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-slate-100/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <h1 className="text-lg">User Info</h1>
          </div>

          <button onClick={() => setIsEditing(true)}>
            <Pencil className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex flex-col items-center justify-center gap-8">
          <div className="h-32 w-32 rounded-full border relative translate-y-5 overflow-hidden ">
            <Image
              src={"/user.png"}
              alt="user"
              fill
              className="object-cover"
              layout="lazy"
              sizes="100px"
            />
          </div>

          <div className="mt-2">
            <h1 className="text-xl font-semibold">Shubh Babu</h1>
            <p className="text-center mt-2 text-sm text-muted-foreground">
              last seen recently when?
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-6 p-4">
            <Phone className="text-muted-foreground" />
            <p className="flex flex-col mt-0">
              +9012344354{" "}
              <span className="text-muted-foreground text-sm">Phone</span>{" "}
            </p>
          </div>
          <p className="flex items-center gap-6 p-4">
            <Bell className="text-muted-foreground" />
            <span>Notifications</span>
          </p>
        </div>
      </div>

      {isEditing && (
        <EditProfileForm
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
        />
      )}
    </div>
  );
}

interface EditProfileFormProps {
  isOpen: boolean;
  onClose: () => void;
}

function EditProfileForm({ isOpen, onClose }: EditProfileFormProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 bg-background",
        "transition-transform duration-300 ease-in-out",
        "flex flex-col",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="flex-none border-b px-4 py-2">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onClose()}
            className="p-2 rounded-full hover:bg-slate-50/10 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <h1 className="text-lg font-mono">Edit</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <div className="flex flex-col items-center justify-center gap-8">
          <div className="h-32 w-32 rounded-full border relative translate-y-5 overflow-hidden ">
            <Image
              src={"/user.png"}
              alt="user"
              fill
              className="object-cover"
              layout="lazy"
              sizes="100px"
            />
          </div>

          <div className="mt-2">
            <h1 className="text-xl font-semibold">Shubh Babu</h1>
            <p className="text-center mt-2 text-sm text-muted-foreground">
              original name{" "}
            </p>
          </div>
        </div>

        <form className="flex flex-col gap-6 mt-6">
          <Input className="h-12" placeholder="First name" />

          <Input className="h-12" placeholder="Last name" />
        </form>

        <div className="mt-4">
          <button className="flex items-center gap-6 p-2 border w-full rounded-md px-4 py-3 text-red-600">
            <Trash className="h-5 w-5" />
            Delete Contact
          </button>
        </div>
      </div>
    </div>
  );
}

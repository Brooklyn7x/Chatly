import { Chat } from "@/types";
import { Switch } from "@radix-ui/react-switch";
import { Bell, Pin, Trash, UserPlus } from "lucide-react";
import AddMemberDailog from "../../modal/AddMemberDailog";
import DeleteChatDailog from "../../modal/DeleteChatDailog";

interface ChatInfoSettingProps {
  isGroup: boolean;
  chat: Chat;
}

const ChatSetting = ({ isGroup, chat }: ChatInfoSettingProps) => {
  return (
    <div className="p-5">
      <h4 className="text-sm font-medium mb-4 text-muted-foreground">
        Settings
      </h4>

      <div className="space-y-5">
        <div className="flex items-center justify-between group hover:bg-muted/50 p-2 rounded-md transition-colors">
          <div className="flex items-center gap-3">
            <Bell size={16} className="text-muted-foreground" />
            <span className="text-sm">Mute notifications</span>
          </div>
          <Switch />
        </div>

        <div className="flex items-center justify-between group hover:bg-muted/50 p-2 rounded-md transition-colors">
          <div className="flex items-center gap-3">
            <Pin size={16} className="text-muted-foreground" />
            <span className="text-sm">Pin conversation</span>
          </div>
          <Switch />
        </div>

        {isGroup && (
          <div className="flex items-center justify-between group hover:bg-muted/50 p-2 rounded-md transition-colors">
            <div className="flex items-center gap-3">
              <UserPlus size={16} className="text-muted-foreground" />
              <span className="text-sm">Add participants</span>
            </div>
            <AddMemberDailog
              chatId={chat?._id || ""}
              participants={chat?.participants as any}
            />
          </div>
        )}

        <div className="flex items-center justify-between group hover:bg-muted/50 p-2 rounded-md transition-colors">
          <div className="flex items-center gap-3 text-red-500">
            <Trash size={16} />
            <span className="text-sm">Delete chat</span>
          </div>
          <DeleteChatDailog chatId={chat?._id || ""} />
        </div>
      </div>
    </div>
  );
};

export default ChatSetting;

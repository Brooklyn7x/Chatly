import { Button } from "@/components/ui/button";
import { MoreVertical, Phone, Video } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Chat } from "@/types";

interface ChatMetadataProps {
  chat: Chat;
  isGroup?: boolean;
  onEditChatInfo: () => void;
}

const ChatMetadata = ({ chat, isGroup, onEditChatInfo }: ChatMetadataProps) => {
  const chatName = chat?.name || "Chat";
  return (
    <div className="p-5 flex flex-col items-center">
      <div className="relative size-20 rounded-full mb-3">
        {/* <Image
          src={generateAvatarUrl(chatName)}
          alt={chatName}
          height={80}
          width={80}
          className="aspect-square rounded-full"
        /> */}

        <div className="h-24 w-24 flex items-center justify-center border rounded-full py-4">
          NA
        </div>

        {!isGroup && (
          <div className="absolute h-3 w-3 rounded-full bg-green-400 bottom-1 right-1 border-2 border-card" />
        )}
      </div>
      <h3 className="text-lg font-semibold">{chatName}</h3>
      <p className="text-sm text-muted-foreground">
        {isGroup
          ? `Group · ${chat?.participants?.length || 0} members`
          : "Last seen recently"}
      </p>

      <div className="flex gap-2 mt-4">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-9 w-9 bg-card/90 border"
        >
          <Phone className="text-muted-foreground" size={16} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-9 w-9 bg-card/90 border"
        >
          <Video className="text-muted-foreground" size={16} />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-9 w-9 bg-card/90 border"
            >
              <MoreVertical className="text-muted-foreground" size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onEditChatInfo}>Edit</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ChatMetadata;

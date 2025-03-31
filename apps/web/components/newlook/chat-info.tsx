"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  MoreVertical,
  Phone,
  Video,
  Trash,
  X,
  Pin,
  UserPlus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const participants = [
  {
    id: 1,
    name: "John Doe",
    avatar: "https://example.com/avatar1.jpg",
    role: "Admin",
  },
  {
    id: 2,
    name: "Jane Smith",
    avatar: "https://example.com/avatar2.jpg",
    role: "Member",
  },
  // Add more participants here
];

const ChatInfoPage = ({ chatName = "Group Chat" }) => {
  return (
    <div className="w-80 border-l bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-full p-4">
      {/* Chat Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Chat Info</h2>
        <Button variant="ghost" size="icon" className="rounded-full">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      {/* Chat Details */}
      <div className="mt-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-20 w-20 mb-4">
            <AvatarImage src="https://example.com/group-avatar.jpg" />
            <AvatarFallback>{chatName[0]}</AvatarFallback>
          </Avatar>
          <h3 className="text-lg font-semibold">{chatName}</h3>
          <p className="text-sm text-muted-foreground">Group Chat</p>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4 mt-6">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Participants */}
      <div>
        <h4 className="font-semibold mb-4">Participants</h4>
        <div className="space-y-3">
          {participants.map((participant) => (
            <div key={participant.id} className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={participant.avatar} />
                <AvatarFallback>{participant.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">{participant.name}</p>
                <p className="text-xs text-muted-foreground">
                  {participant.role}
                </p>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-6" />

      {/* Chat Settings */}
      <div>
        <h4 className="font-semibold mb-4">Chat Settings</h4>
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start gap-3">
            <X className="h-4 w-4" />
            <span>Mute Notifications</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Pin className="h-4 w-4" />
            <span>Pin Chat</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <UserPlus className="h-4 w-4" />
            <span>Add People</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInfoPage;

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Pencil, Check, ArrowLeft } from "lucide-react";

export const ProfileView = ({ onBack }: { onBack: () => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("John Doe");
  const [avatar, setAvatar] = useState("/default-avatar.png");

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">Profile</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex justify-center">
          <Avatar className="h-20 w-20">
            <AvatarImage src={avatar} />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
        {isEditing ? (
          <>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
            />
            <Input
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="Avatar URL"
            />
            <Button onClick={handleSave} className="w-full gap-2">
              <Check className="h-4 w-4" />
              <span>Save Changes</span>
            </Button>
          </>
        ) : (
          <>
            <div className="text-center">
              <h3 className="text-xl font-semibold">{name}</h3>
              <p className="text-sm text-muted-foreground">Online</p>
            </div>
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="w-full gap-2"
            >
              <Pencil className="h-4 w-4" />
              <span>Edit Profile</span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Input } from "../ui/input";

export const CreateChannel = ({ onBack } : { onBack : () => void}) => {
  const [channelName, setChannelName] = useState("");

  const handleCreateChannel = () => {
    // Add logic to create a channel (e.g., API call)
    console.log("Creating channel:", channelName);
    onBack(); // Close the view after creation
  };

  return (
    <div className="h-full flex flex-col">
      {/* Back Button */}
      <div className="p-4 border-b flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">Create Channel</h2>
      </div>

      {/* Create Channel Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <Input
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
          placeholder="Enter channel name"
        />
        <Button onClick={handleCreateChannel} className="w-full">
          Create Channel
        </Button>
      </div>
    </div>
  );
};

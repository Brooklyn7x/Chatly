import { useState } from "react";
import { UserItem } from "../sidebar/UserItem";
import { UserAvatar } from "../shared/Avatar";

interface SharedMediaProps {
  chat: any;
}
type tabs = "members" | "media" | "link" | "links";
export const SharedMedia = ({ chat }: SharedMediaProps) => {
  const [activeTab, setActiveTab] = useState<tabs>("members");

  return (
    <div>
      <div className="flex gap-4 mb-4">
        {["members", "media", "files", "links"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as typeof activeTab)}
            className={`
              px-4 py-2 rounded-lg text-sm
              ${
                activeTab === tab
                  ? "bg-muted text-green-400"
                  : "text-white hover:bg-muted/60"
              }
            `}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "members" && (
        <div className="space-y-1">
          {chat?.participants.map((participant: any) => (
            <UserItem key={participant.userId._id} user={participant.userId} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-3 gap-1">
        {activeTab === "media" &&
          Array.from({ length: 10 }).map((item, index) => (
            <div
              key={index}
              className="aspect-square relative cursor-pointer group"
            >
              <UserAvatar />
              <div
                className="absolute inset-0 bg-black/50 opacity-0 
            group-hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
      </div>
    </div>
  );
};

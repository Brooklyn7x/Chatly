import { useState } from "react";
import { UserItem } from "../sidebar/UserItem";

interface SharedMediaProps {
  chat: any;
}
type tabs = "members" | "media" | "link" | "links";
export const SharedMedia = ({ chat }: SharedMediaProps) => {
  const [activeTab, setActiveTab] = useState<tabs>("members");

  return (
    <div>
      <div className="flex items-center justify-center gap-2 border-b py-2 px-5">
        {["members", "media", "files", "links"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as typeof activeTab)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${
                activeTab === tab
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-muted/40"
              }
              
            `}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      <div className="p-2 pt-4">
        {activeTab === "members" && (
          <div className="space-y-2">
            {chat?.participants.map((participant: any) => (
              <UserItem
                key={participant.userId._id}
                user={participant.userId}
                className="hover:bg-muted/50 rounded-lg transition-colors duration-200"
              />
            ))}
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 ">
          {activeTab === "media" &&
            Array.from({ length: 10 }).map((item, index) => (
              <div
                key={index}
                className="aspect-square relative cursor-pointer group rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
              >
                <img
                  alt="user"
                  src="/user.png"
                  className="object-cover w-full h-full"
                />
                <div
                  className="absolute inset-0 bg-black/50 opacity-0 
                group-hover:opacity-100 transition-opacity duration-200"
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

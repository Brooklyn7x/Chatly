import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/useChatStore";
import { useChatPanelStore } from "@/store/useChatPanelStore";
import { EmptyState } from "./EmptyChat";
import { Suspense } from "react";

const ChatArea = dynamic(() => import("./ChatArea"));
const ChatInfo = dynamic(() => import("./ChatInfo"));

interface ChatContainerProps {
  isMobile: boolean;
}
export const ChatContainer = ({ isMobile }: ChatContainerProps) => {
  const { activeChatId } = useChatStore();
  const { isOpen } = useChatPanelStore();
  return (
    <div
      className={cn(
        "flex flex-col h-full",
        "bg-secondary/30",
        "transition-transform duration-300",
        {
          "fixed inset-0": isMobile,
          "relative flex-1": !isMobile,
          "translate-x-full": isMobile && !activeChatId,
          "translate-x-0": !isMobile || activeChatId,
        }
      )}
    >
      <Suspense fallback={<div>Loading chat...</div>}>
        <ChatArea />
      </Suspense>
      {isOpen && (
        <Suspense fallback={<div>Loading chat info...</div>}>
          <ChatInfo />
        </Suspense>
      )}
      {!activeChatId && <EmptyState />}
    </div>
  );
};

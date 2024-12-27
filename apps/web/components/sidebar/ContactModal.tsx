import { ArrowLeft, Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
  if (!isOpen) return null;
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-background flex flex-col p-4",
        "transform transition-all duration-300 ease-in-out origin-right",
        isOpen ? "translate-x-0 " : "translate-x-full "
      )}
    >
      <div className="flex flex-col w-full">
        <div className="h-16 flex items-center gap-4 py-2 px-4 border-b mb-4">
          <button
            onClick={() => onClose()}
            className="p-2 text-muted-foreground rounded-full transition-all duration-300 ease-in-out hover:bg-muted/70"
          >
            <ArrowLeft />
          </button>
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <input
              onChange={(e) => {}}
              className="w-full h-10 pl-12 pr-4 bg-muted/50 rounded-full border text-md outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search"
            />
          </div>
        </div>
        <div>{/* <ChatList chats={[]} /> */}</div>

        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => {}}
            className="h-14 w-14 text-center bg-muted rounded-full flex items-center justify-center hover:bg-muted/60 transition-all duration-300 ease-in-out transform rotate-0"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

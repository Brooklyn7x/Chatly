import { useState } from "react";
import { ArrowLeft, ArrowRight, Camera, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface GroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GroupModal = ({ isOpen, onClose }: GroupModalProps) => {
  if (!isOpen) return null;
  const [step, setStep] = useState<"step1" | "step2">("step1");

  return (
    <div className={cn("fixed inset-0 z-50 bg-background flex flex-col p-4")}>
      {step === "step1" && (
        <div className="flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => onClose()}
              className="p-2 text-muted-foreground rounded-full transition-all duration-300 ease-in-out hover:bg-muted/70"
            >
              <ArrowLeft />
            </button>
            <h1 className="flex-1 text-lg">Add Member</h1>
          </div>

          <div className="relative w-full mb-4">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <input
              onChange={() => {}}
              className="w-full h-10 pl-12 pr-4 bg-background text-md outline-none focus:ring-0 border rounded-md"
              placeholder="Add people"
            />
          </div>

          <div className="flex-1 border-t pt-4">Add user list</div>
        </div>
      )}
      {step === "step2" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => setStep("step1")}
              className="p-2 text-muted-foreground rounded-full transition-all duration-300 ease-in-out hover:bg-muted/70"
            >
              <ArrowLeft />
            </button>
            <h1 className="text-xl font-semibold">New Group</h1>
          </div>

          <div className="flex flex-col items-center justify-center gap-4">
            <div className="p-10 border rounded-full">
              <Camera className="h-12 w-12" />
            </div>
            <input type="file" className="hidden" />
          </div>
          <div className="w-full px-10">
            <input
              className="h-14 w-full pl-5 rounded-md border"
              placeholder="Group Name"
            />
          </div>
        </div>
      )}

      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => setStep("step2")}
          className="h-14 w-14 text-center bg-muted rounded-full flex items-center justify-center hover:bg-muted/60 transition-all duration-300 ease-in-out transform"
        >
          <ArrowRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

import data from "@emoji-mart/data";
import { Popover, PopoverContent } from "@/components/ui/popover";
import dynamic from "next/dynamic";

const Picker = dynamic(() => import("@emoji-mart/react"), { ssr: false });

interface EmojiPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onEmojiSelect: (emoji: string) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}
function EmojiPicker({ isOpen, onClose, onEmojiSelect }: EmojiPickerProps) {
  return (
    // <div
    //   ref={containerRef}
    //   className={cn(
    //     "absolute z-50",
    //     "transition-all duration-200 ease-in-out transform origin-bottom-left",
    //     isOpen
    //       ? "opacity-100 scale-100 translate-y-0"
    //       : "opacity-0 scale-50 translate-y-4 pointer-events-none"
    //   )}
    //   style={{
    //     bottom: "100%",
    //     left: "4",
    //     width: "320px",
    //   }}
    // >
    //   <Picker
    //     data={data}
    //     onEmojiSelect={(emoji: any) => {
    //       onEmojiSelect(emoji.native);
    //       onClose();
    //     }}
    //     navPosition="top"
    //     previewPosition="none"
    //     skinTonePosition="none"
    //     searchPosition="sticky"
    //     categories={[
    //       "frequent",
    //       "smileys_people",
    //       "animals_nature",
    //       "food_drink",
    //       "activities",
    //       "travel_places",
    //       "objects",
    //       "symbols",
    //       "flags",
    //     ]}
    //   />
    // </div>

    <Popover open={isOpen} onOpenChange={onClose}>
      <PopoverContent className="w-96 p-0 border-none" align="start" side="top">
        <Picker
          data={data}
          onEmojiSelect={(emoji: any) => {
            onEmojiSelect(emoji.native);
            onClose();
          }}
          navPosition="top"
          previewPosition="none"
          skinTonePosition="none"
          searchPosition="sticky"
          categories={[
            "frequent",
            "smileys_people",
            "animals_nature",
            "food_drink",
            "activities",
            "travel_places",
            "objects",
            "symbols",
            "flags",
          ]}
        />
      </PopoverContent>
    </Popover>
  );
}

export default EmojiPicker;

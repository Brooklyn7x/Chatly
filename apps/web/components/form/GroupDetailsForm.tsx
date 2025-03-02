import { cn } from "@/lib/utils";
import { Camera } from "lucide-react";

interface GroupDetailsFormProps {
  name: string;
  previewImage?: string;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const GroupDetailsForm = ({
  name,
  previewImage,
  onNameChange,
  onImageChange,
}: GroupDetailsFormProps) => {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative group h-32 w-32">
        <button
          className={cn(
            "h-full w-full rounded-full",
            "bg-muted/50",
            "flex items-center justify-center",
            "transition-all hover:bg-muted/70",
            "overflow-hidden"
          )}
        >
          {previewImage ? (
            <img
              src={previewImage}
              alt="Group"
              className="h-full w-full object-cover"
            />
          ) : (
            <Camera className="h-12 w-12 text-muted-foreground" />
          )}
        </button>
        <input
          type="file"
          accept="image/*"
          onChange={onImageChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>

      <div className="w-full px-6">
        <input
          value={name}
          onChange={onNameChange}
          className="w-full h-12 px-4 rounded-lg border bg-muted/50 
                outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Group Name"
        />
      </div>
    </div>
  );
};

import { Button } from "@/components/ui/button";
import { ImageIcon, Link } from "lucide-react";

const SharedMedia = () => {
  return (
    <div className="p-5 border-t">
      <h4 className="text-sm font-medium mb-4 flex justify-between items-center">
        <span className="text-muted-foreground">Shared Media</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 text-xs text-muted-foreground"
        >
          See all
        </Button>
      </h4>

      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="aspect-square bg-muted rounded-md overflow-hidden relative group cursor-pointer"
          >
            {item % 2 === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageIcon size={16} className="text-muted-foreground" />
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Link size={16} className="text-muted-foreground" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full bg-white/20"
              >
                <ImageIcon size={14} className="text-white" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SharedMedia;

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt: string;
}

export function ImageModal({ isOpen, onClose, src, alt }: ImageModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full h-full max-w-[90vw] max-h-[90vh] p-4">
        <DialogTitle className="sr-only">Preview</DialogTitle>
        <Image
          src={src}
          alt={alt}
          fill
          loading="lazy"
          className="object-contain"
        />
      </DialogContent>
    </Dialog>
  );
}

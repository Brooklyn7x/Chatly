import Image from "next/image";
import { useState } from "react";
import { ImageModal } from "./ImageModal";
import { MessageType } from "@/types";

type Attachment = {
  url: string;
  type: string;
  name?: string;
  size?: number;
  mimeType?: string;
};

interface MessageContentProp {
  isOwn: boolean;
  content: string;
  type: MessageType;
  attachments?: Attachment[];
}

export const MessageContent = ({
  isOwn,
  content,

  attachments = [],
}: MessageContentProp) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const openImage = (url: string) => setSelectedImage(url);
  const closeImage = () => setSelectedImage(null);

  return (
    <>
      <div className="flex flex-col gap-2">
        {attachments.map((attachment, index) => {
          switch (attachment.type) {
            case "image":
              return (
                <div
                  className="relative w-48 h-48 cursor-pointer"
                  onClick={() => openImage(attachment.url)}
                  key={index}
                >
                  <Image
                    src={attachment.url}
                    alt={"Attachment image"}
                    className="rounded-md object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAxMDAgMTAwJyBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSd4TWluWU1pbiBtZWV0Jz48cmVjdCB3aWR0aD0nMTAwJyBoZWlnaHQ9JzEwMCcgZmlsbD0nI2YyZjJmMicvPjx0ZXh0IHg9JzUwJyB5PSc1MCcgZm9udC1zaXplPScxMicgZm9udC1mYW1pbHk9J3N5c3RlbS11aSwgLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCAmcXVvdDsuU0ZOU1RleHQtUmVndWxhciZxdW90Oywgc2Fucy1zZXJpZicgZmlsbD0nI2NjYycgZG9taW5hbnQtYmFzZWxpbmU9J21pZGRsZScgdGV4dC1hbmNob3I9J21pZGRsZSc+TG9hZGluZy4uLjwvdGV4dD48L3N2Zz4="
                  />
                </div>
              );

            case "video":
              return (
                <video
                  key={index}
                  controls
                  className="w-full max-w-md rounded-lg"
                  preload="none"
                >
                  <source src={attachment.url} type={attachment.mimeType} />
                  Your browser does not support the video tag.
                </video>
              );

            case "file":
              return (
                <a
                  key={index}
                  href={attachment.url}
                  download={attachment.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 bg-background rounded-lg border"
                >
                  <span className="truncate">
                    {attachment.name || "Download File"}
                  </span>
                </a>
              );

            default:
              return null;
          }
        })}

        {content && (
          <p className={`${isOwn ? "text-black" : "text-white"}`}>{content}</p>
        )}
      </div>

      {selectedImage && (
        <ImageModal
          isOpen={!!selectedImage}
          onClose={closeImage}
          src={selectedImage}
          alt="Full screen image"
        />
      )}
    </>
  );
};

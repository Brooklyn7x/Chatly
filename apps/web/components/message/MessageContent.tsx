import { ImageIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type Attachment = {
  url: string;
  type: string;
  name?: string;
  size?: number;
  mimeType?: string;
};

type MessageType = "text" | "image" | "video" | "audio" | "file";

export const MessageContent = ({
  content,
  type,
  attachments = [],
}: {
  content: string;
  type: MessageType;
  attachments?: Attachment[];
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openImage = (url: string) => setSelectedImage(url);
  const closeImage = () => setSelectedImage(null);

  if (attachments.length > 0) {
    return (
      <>
        <div className="flex flex-col gap-2">
          {attachments.map((attachment, index) => {
            switch (attachment.type) {
              case "image":
                return (
                  <div
                    key={index}
                    className="relative w-48 h-48 cursor-pointer"
                    onClick={() => openImage(attachment.url)}
                  >
                    <Image
                      src={attachment.url}
                      alt={`Attachment ${index + 1}`}
                      className="rounded-md object-cover"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
                    />
                  </div>
                );
              case "video":
                return (
                  <video
                    key={index}
                    controls
                    className="w-full max-w-md rounded-lg"
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
          {content && <p className="text-sm mt-2">{content}</p>}
        </div>

        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={closeImage}
          >
            <div className="relative max-w-full max-h-full">
              <Image
                src={selectedImage}
                alt="Full screen image"
                width={1920}
                height={1080}
                className="object-contain"
                style={{ maxWidth: "100vw", maxHeight: "100vh" }}
              />
              <button
                className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/75"
                onClick={closeImage}
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  switch (type) {
    case "text":
      return <p className="text-sm">{content}</p>;
    case "image":
      return (
        <div className="relative w-48 h-48">
          <ImageIcon />
        </div>
      );
    case "video":
      return (
        <video controls className="w-full max-w-md rounded-lg">
          <source src={content} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    case "audio":
      return (
        <audio controls className="w-full max-w-md">
          <source src={content} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      );
    default:
      return null;
  }
};

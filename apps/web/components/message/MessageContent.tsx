import { ImageIcon } from "lucide-react";
import Image from "next/image";

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
  if (attachments.length > 0) {
    return (
      <div className="flex flex-col gap-2">
        {attachments.map((attachment, index) => {
          switch (attachment.type) {
            case "image":
              return (
                <div key={index} className="relative w-48 h-48">
                  <Image
                    src={attachment.url}
                    alt={`Attachment ${index + 1}`}
                    className="rounded-md object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={false}
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

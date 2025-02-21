import Image from "next/image";

type MessageType = "text" | "image" | "video" | "audio" | "file";

export const MessageContent = ({
  content,
  type,
}: {
  content: string;
  type: MessageType;
}) => {
  //tap to view full image function
  switch (type) {
    case "text":
      return <p className="text-sm">{content}</p>;
    case "image":
      return (
        <div className="relative w-48 h-48">
          <Image
            src="/user.jpeg"
            alt="Message image"
            className="rounded-md object-cover"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
        </div>
      );
    case "video":
      return <p className="text-sm">Video content</p>;
    case "audio":
      return <p className="text-sm">Audio content</p>;
    default:
      return null;
  }
};

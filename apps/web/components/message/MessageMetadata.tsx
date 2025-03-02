import { MessageStatus } from "./MessageStatus";

interface MessageMetadataProps {
  timestamp?: Date;
  status?: string;
  isOwn: boolean;
  isEdited: boolean;
}

export function MessageMetadata({
  timestamp,
  status,
  isOwn,
  isEdited,
}: MessageMetadataProps) {
  return (
    <div className="flex items-center justify-end gap-2 mt-1">
      {isEdited && <span className="text-xs italic">(edited)</span>}
      <span className="text-xs">
        {new Date(timestamp || new Date()).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
      {isOwn && status && <MessageStatus status={status} />}
    </div>
  );
}

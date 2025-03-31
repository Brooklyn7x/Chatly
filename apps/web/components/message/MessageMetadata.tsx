import { MessageStatus } from "./MessageStatus";
import { formatMessageTimestamp } from "@/utils/dateUtils";
type StatusType = "sending" | "sent" | "delivered" | "read" | "failed";

interface MessageMetadataProps {
  timestamp: Date;
  status?: StatusType;
  isOwn: boolean;
  isEdited: boolean;
  isDeleted: boolean;
}

export function MessageMetadata({
  timestamp,
  status,
  isOwn,
  isEdited,
  isDeleted,
}: MessageMetadataProps) {
  if (isDeleted) {
    return null;
  }
  return (
    <div className="flex items-center justify-end gap-2 mt-1">
      {isEdited && <span className="text-xs text-muted-foreground italic">(edited)</span>}
      <span className="text-xs text-muted-foreground">
        {formatMessageTimestamp(timestamp)}
      </span>
      {isOwn && status && <MessageStatus status={status} />}
    </div>
  );
}

import { MessageStatus } from "./MessageStatus";
import { formatMessageTimestamp } from "@/utils/dateUtils";
type StatusType = "sending" | "sent" | "delivered" | "read" | "failed";
interface MessageMetadataProps {
  timestamp: Date;
  status?: StatusType;
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
      <span className="text-xs">{formatMessageTimestamp(timestamp)}</span>
      {isOwn && status && <MessageStatus status={status} />}
    </div>
  );
}

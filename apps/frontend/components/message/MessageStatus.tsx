import { Check, CheckCheck, Clock } from "lucide-react";

type StatusType = "sending" | "sent" | "delivered" | "read";

export const MessageStatus = ({ status }: { status: StatusType }) => {
  switch (status) {
    case "sending":
      return <Clock className="h-4 w-4 text-gray-400" />;
    case "sent":
      return <Check className="h-4 w-4 text-gray-400" />;
    case "delivered":
      return <CheckCheck className="h-4 w-4 text-gray-400" />;
    case "read":
      return <CheckCheck className="h-4 w-4 text-blue-500" />;
    default:
      return null;
  }
};

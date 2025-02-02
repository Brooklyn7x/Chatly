import { Check, CheckCheck, Clock, XCircle } from "lucide-react";

type StatusType = "sending" | "sent" | "delivered" | "read" | "failed";

export const MessageStatus = ({ status }: { status: StatusType }) => {
  switch (status) {
    case "sending":
      return <Clock className="h-4 w-4 text-white" />;
    case "sent":
      return <Check className="h-4 w-4 text-white" />;
    case "delivered":
      return <CheckCheck className="h-4 w-4 text-white" />;
    case "read":
      return <CheckCheck className="h-4 w-4 text-green-400" />;
    case "failed":
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return null;
  }
};

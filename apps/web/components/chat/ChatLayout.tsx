import Sidebar from "../sidebar/Sidebar";
import { ChatContainer } from "./ChatContainer";
import { ChatInfo } from "./ChatInfo";

export default function ChatLayout() {
  return (
    <div className="flex h-dvh overflow-hidden">
      <Sidebar />
      <ChatContainer />
      <ChatInfo />
    </div>
  );
}

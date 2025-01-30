import { useChats } from "@/hooks/useChats";
import { ChatList } from "../chat/ChatList";

interface SidebarContentProps {
  view: string;
}

const SidebarContent = ({ view }: SidebarContentProps) => {
  const { chats, isLoading } = useChats();

  if (isLoading) {
    <ChatListSkeleton />;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {view === "main" && <ChatList chats={chats} />}
      {view === "search" && <SearchView />}
      {view === "contacts" && <ContactList contacts={[]} />}
      {view === "archived" && <ArchivedChats />}
      {view === "settings" && <Settings />}
    </div>
  );
};

interface SearchViewProps {
  query: string;
}

export const SearchView = ({ query }: SearchViewProps) => {
  return <div>Search View</div>;
};

interface ContactListProps {
  contacts: any[];
}
const ContactList = ({ contacts }: ContactListProps) => {
  return <div>Contact List</div>;
};
const ArchivedChats = () => {
  return <div>Archived Chats</div>;
};

const Settings = () => {
  return <div>Settings</div>;
};

export default SidebarContent;

const ChatListSkeleton = () => {
  return (
    <div className="space-y-4 p-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
};

// "use client";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Plus,
//   Search,
//   ChevronDown,
//   MessageCircle,
//   Users,
//   Lock,
//   Video,
//   FileText,
//   Star,
//   Hash,
//   MoreVertical,
//   Pin,
//   Archive,
//   Trash,
//   UserPlus,
//   BellOff,
//   X,
//   List,
//   MailWarning,
//   Pencil,
// } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
// import { useState } from "react";
// import { ProfileView } from "./ProfileView";
// // import { CreateDirectChat } from "./CreateDirectChat";
// import { CreateChannel } from "./CreateChannel";
// // import { CreateGroupChat } from "./CreateGroupChat";

// const chats = [
//   {
//     id: 1,
//     name: "John Doe",
//     lastMessage: "Hey, how are you?",
//     timestamp: "2h ago",
//     unread: 1,
//     avatar: "https://github.com/shadcn.png",
//     pinned: true, // Mark as pinned
//   },
//   {
//     id: 2,
//     name: "Work Team",
//     lastMessage: "Let's meet at 3 PM",
//     timestamp: "Yesterday",
//     unread: 0,
//     avatar: "https://github.com/team.png",
//     pinned: false, // Not pinned
//   },
//   // Add more chats here
// ];

// const ChatSidebar = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeFilter, setActiveFilter] = useState("all"); // Default filter: All
//   const [isProfileOpen, setIsProfileOpen] = useState(false); // Profile view state
//   const [isCreateDirectChatOpen, setIsCreateDirectChatOpen] = useState(false); // Direct chat view state
//   const [isCreateGroupChatOpen, setIsCreateGroupChatOpen] = useState(false); // Group chat view state
//   const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false); // Channel view state

//   const filteredChats = chats.filter((chat) => {
//     const query = searchQuery.toLowerCase();
//     const matchesSearch =
//       chat.name.toLowerCase().includes(query) ||
//       chat.lastMessage.toLowerCase().includes(query);

//     switch (activeFilter) {
//       case "favorites":
//         return matchesSearch && chat.favorite;
//       case "unread":
//         return matchesSearch && chat.unread > 0;
//       case "archived":
//         return matchesSearch && chat.archived;
//       case "muted":
//         return matchesSearch && chat.muted;
//       default:
//         return matchesSearch; // "All" filter
//     }
//   });

//   return (
//     <div className="h-screen w-80 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex flex-col">
//       {/* Profile View */}
//       {isProfileOpen ? (
//         <ProfileView onBack={() => setIsProfileOpen(false)} />
//       ) : isCreateDirectChatOpen ? (
//         <CreateDirectChat onBack={() => setIsCreateDirectChatOpen(false)} />
//       ) : isCreateGroupChatOpen ? (
//         <CreateGroupChat onBack={() => setIsCreateGroupChatOpen(false)} />
//       ) : isCreateChannelOpen ? (
//         <CreateChannel onBack={() => setIsCreateChannelOpen(false)} />
//       ) : (
//         <>
//           <>
//             {/* Header */}
//             <div className="p-4 border-b flex items-center justify-between">
//               <h2 className="text-xl font-semibold">Chats</h2>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={() => setIsProfileOpen(true)}
//               >
//                 <Pencil className="h-4 w-4" />
//               </Button>
//             </div>

//             {/* Search Bar */}
//             <div className="p-4 border-b">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Search chats..."
//                   className="pl-10"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//               </div>
//             </div>

//             {/* Filter Bar */}
//             <div className="p-2 border-b mx-4 my-2 flex items-center gap-4 overflow-x-auto">
//               <Button
//                 variant={activeFilter === "all" ? "default" : "ghost"}
//                 size="sm"
//                 className="flex items-center gap-2"
//                 onClick={() => setActiveFilter("all")}
//               >
//                 <List className="h-4 w-4" />
//                 <span>All</span>
//               </Button>
//               <Button
//                 variant={activeFilter === "favorites" ? "default" : "ghost"}
//                 size="sm"
//                 className="flex items-center gap-2"
//                 onClick={() => setActiveFilter("favorites")}
//               >
//                 <Star className="h-4 w-4" />
//                 <span>Favorites</span>
//               </Button>
//               <Button
//                 variant={activeFilter === "unread" ? "default" : "ghost"}
//                 size="sm"
//                 className="flex items-center gap-2"
//                 onClick={() => setActiveFilter("unread")}
//               >
//                 <MailWarning className="h-4 w-4" />
//                 <span>Unread</span>
//               </Button>
//               <Button
//                 variant={activeFilter === "archived" ? "default" : "ghost"}
//                 size="sm"
//                 className="flex items-center gap-2"
//                 onClick={() => setActiveFilter("archived")}
//               >
//                 <Archive className="h-4 w-4" />
//                 <span>Archived</span>
//               </Button>
//               <Button
//                 variant={activeFilter === "muted" ? "default" : "ghost"}
//                 size="sm"
//                 className="flex items-center gap-2"
//                 onClick={() => setActiveFilter("muted")}
//               >
//                 <BellOff className="h-4 w-4" />
//                 <span>Muted</span>
//               </Button>
//             </div>

//             {/* Chat List */}
//             <div className="flex-1 overflow-y-auto p-2 space-y-1">
//               {filteredChats.map((chat) => (
//                 <div
//                   key={chat.id}
//                   className="flex items-center gap-3 p-3 hover:bg-secondary/50 rounded-lg transition-colors cursor-pointer group"
//                 >
//                   <Avatar className="h-10 w-10">
//                     <AvatarImage src={chat.avatar} />
//                     <AvatarFallback>{chat.name[0]}</AvatarFallback>
//                   </Avatar>
//                   <div className="flex-1 min-w-0">
//                     <h3 className="font-medium truncate">{chat.name}</h3>
//                     <p className="text-sm text-muted-foreground truncate">
//                       {chat.lastMessage}
//                     </p>
//                   </div>
//                   <div className="flex flex-col items-end space-y-1">
//                     <span className="text-xs text-muted-foreground">
//                       {chat.timestamp}
//                     </span>
//                     {chat.unread > 0 && (
//                       <Badge
//                         variant="default"
//                         className="h-5 w-5 justify-center p-0"
//                       >
//                         {chat.unread}
//                       </Badge>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </>
//           <div className="p-4 border-t">
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button className="w-full gap-2" variant="outline">
//                   <Plus className="h-4 w-4" />
//                   <span>New Chat</span>
//                   <ChevronDown className="h-4 w-4 ml-auto" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent className="w-64">
//                 <DropdownMenuItem
//                   className="flex items-center gap-3 p-3"
//                   onClick={() => setIsCreateDirectChatOpen(true)}
//                 >
//                   <MessageCircle className="h-4 w-4 text-primary" />
//                   <div>
//                     <p className="font-medium">Direct Message</p>
//                     <p className="text-xs text-muted-foreground">
//                       Start a private conversation
//                     </p>
//                   </div>
//                 </DropdownMenuItem>

//                 <DropdownMenuItem
//                   className="flex items-center gap-3 p-3"
//                   onClick={() => setIsCreateGroupChatOpen(true)}
//                 >
//                   <Users className="h-4 w-4 text-primary" />
//                   <div>
//                     <p className="font-medium">Group Chat</p>
//                     <p className="text-xs text-muted-foreground">
//                       Create a group with multiple people
//                     </p>
//                   </div>
//                 </DropdownMenuItem>

//                 <DropdownMenuItem
//                   className="flex items-center gap-3 p-3"
//                   onClick={() => setIsCreateChannelOpen(true)}
//                 >
//                   <Lock className="h-4 w-4 text-primary" />
//                   <div>
//                     <p className="font-medium">Private Channel</p>
//                     <p className="text-xs text-muted-foreground">
//                       Create an invite-only channel
//                     </p>
//                   </div>
//                 </DropdownMenuItem>

//                 <DropdownMenuSeparator />
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </>
//       )}

//       {/* New Chat Button with Enhanced Dropdown */}
//     </div>
//   );
// };

// export default ChatSidebar;

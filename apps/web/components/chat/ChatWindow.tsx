// "use client";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Send,
//   Smile,
//   Paperclip,
//   MoreVertical,
//   Video,
//   Phone,
//   Info,
//   Edit,
//   Pin,
//   Trash,
//   Search,
// } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { useState, useEffect } from "react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import data from "@emoji-mart/data";
// import Picker from "@emoji-mart/react";
// // import { useAuthStore } from "@/store/useAuthStore";

// const initialMessages = [
//   {
//     id: 1,
//     sender: "John Doe",
//     avatar: "https://example.com/avatar1.jpg",
//     content: "Hey, how's it going?",
//     timestamp: "10:00 AM",
//     isMe: false,
//     pinned: false,
//     deleted: false,
//     reactions: { "👍": 1, "😄": 2 },
//   },
//   {
//     id: 2,
//     sender: "You",
//     avatar: "https://example.com/avatar2.jpg",
//     content: "Great! Just working on the project.",
//     timestamp: "10:05 AM",
//     isMe: true,
//     pinned: false,
//     deleted: false,
//     reactions: { "👏": 1 },
//   },
//   // Add more messages here
// ];

// const REACTION_EMOJIS = ["👍", "😄", "❤️", "👏", "🔥"]; // Limited set of 5 emojis

// const NewChatArea = ({ chatName = "John Doe" }) => {
//   //   const { user } = useAuthStore();
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState(initialMessages);
//   const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
//   const [editContent, setEditContent] = useState("");
//   const [messageToDelete, setMessageToDelete] = useState<number | null>(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [isTyping, setIsTyping] = useState(false);
//   const [otherUserTyping, setOtherUserTyping] = useState(false);

//   // Simulate typing detection (replace with real-time implementation)
//   useEffect(() => {
//     if (message) {
//       setIsTyping(true);
//       // Simulate other user typing
//       const typingTimeout = setTimeout(() => {
//         setOtherUserTyping(true);
//       }, 1000);

//       return () => {
//         clearTimeout(typingTimeout);
//         setIsTyping(false);
//         setOtherUserTyping(false);
//       };
//     } else {
//       setIsTyping(false);
//       setOtherUserTyping(false);
//     }
//   }, [message]);

//   const filteredMessages = searchQuery
//     ? messages.filter((msg) =>
//         msg.content.toLowerCase().includes(searchQuery.toLowerCase())
//       )
//     : messages;

//   const highlightText = (text: string, query: string) => {
//     if (!query) return text;
//     const parts = text.split(new RegExp(`(${query})`, "gi"));
//     return parts.map((part, index) =>
//       part.toLowerCase() === query.toLowerCase() ? (
//         <span key={index} className="bg-yellow-200 text-black">
//           {part}
//         </span>
//       ) : (
//         part
//       )
//     );
//   };

//   // Filter pinned messages
//   const pinnedMessages = messages.filter((msg) => msg.pinned && !msg.deleted);

//   // Filter regular messages (excluding pinned and deleted)
//   const regularMessages = messages.filter((msg) => !msg.pinned && !msg.deleted);

//   const handleDeleteMessage = (id: number) => {
//     setMessages((prev) =>
//       prev.map((msg) =>
//         msg.id === id
//           ? { ...msg, deleted: true, content: "This message was deleted" }
//           : msg
//       )
//     );
//     setMessageToDelete(null);
//   };

//   const handleEditMessage = (id: number, content: string) => {
//     setEditingMessageId(id);
//     setEditContent(content);
//   };

//   const saveEditedMessage = (id: number) => {
//     setMessages((prev) =>
//       prev.map((msg) =>
//         msg.id === id ? { ...msg, content: editContent } : msg
//       )
//     );
//     setEditingMessageId(null);
//     setEditContent("");
//   };

//   const handlePinMessage = (id: number) => {
//     setMessages((prev) =>
//       prev.map((msg) => (msg.id === id ? { ...msg, pinned: !msg.pinned } : msg))
//     );
//   };

//   const handleAddReaction = (messageId: number, emoji: string) => {
//     setMessages((prev) =>
//       prev.map((msg) =>
//         msg.id === messageId
//           ? {
//               ...msg,
//               reactions: {
//                 ...msg.reactions,
//                 [emoji]: (msg.reactions[emoji] || 0) + 1,
//               },
//             }
//           : msg
//       )
//     );
//   };

//   const isAdmin = true; // Example role-based permission

//   return (
//     <div className="flex flex-col h-full">
//       {/* Chat Header */}
//       <div className="border-b p-4 flex items-center justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//         <div className="flex items-center gap-3">
//           <Avatar className="h-10 w-10">
//             <AvatarImage src="https://example.com/avatar1.jpg" />
//             <AvatarFallback>{chatName[0]}</AvatarFallback>
//           </Avatar>
//           <div>
//             <h2 className="font-semibold">{chatName}</h2>
//             {otherUserTyping && (
//               <p className="text-xs text-muted-foreground">Typing...</p>
//             )}
//           </div>
//         </div>
//         <div className="flex items-center gap-2">
//           <Button
//             variant="ghost"
//             size="icon"
//             className="rounded-full"
//             onClick={() => setIsSearchOpen(!isSearchOpen)}
//           >
//             <Search className="h-4 w-4" />
//           </Button>
//           <Button variant="ghost" size="icon" className="rounded-full">
//             <Video className="h-4 w-4" />
//           </Button>
//           <Button variant="ghost" size="icon" className="rounded-full">
//             <Phone className="h-4 w-4" />
//           </Button>
//           <Button variant="ghost" size="icon" className="rounded-full">
//             <Info className="h-4 w-4" />
//           </Button>
//           <Button variant="ghost" size="icon" className="rounded-full">
//             <MoreVertical className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>

//       {/* Search Bar */}
//       {isSearchOpen && (
//         <div className="border-b p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search messages..."
//               className="pl-10"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
//         </div>
//       )}

//       {/* Pinned Messages Bar */}
//       {pinnedMessages.length > 0 && (
//         <div className="border-b p-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//           <div className="flex items-center gap-2">
//             <Pin className="h-4 w-4 text-primary" />
//             <h4 className="text-sm font-semibold">Pinned Messages</h4>
//           </div>
//           <ScrollArea className="w-full mt-2">
//             <div className="flex gap-2">
//               {pinnedMessages.map((message) => (
//                 <motion.div
//                   key={message.id}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                   transition={{ duration: 0.2 }}
//                   className="flex-shrink-0 p-2 bg-secondary rounded-lg max-w-[200px] cursor-pointer hover:bg-secondary/80 transition-colors group"
//                   onClick={() => {
//                     // Scroll to the pinned message in the chat
//                     const element = document.getElementById(
//                       `message-${message.id}`
//                     );
//                     element?.scrollIntoView({ behavior: "smooth" });
//                   }}
//                 >
//                   <div className="flex items-center gap-2">
//                     <Avatar className="h-6 w-6">
//                       <AvatarImage src={message.avatar} />
//                       <AvatarFallback>{message.sender[0]}</AvatarFallback>
//                     </Avatar>
//                     <p className="text-sm truncate">{message.content}</p>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </ScrollArea>
//         </div>
//       )}

//       {/* Message List */}
//       <ScrollArea className="flex-1 p-4 space-y-4">
//         <AnimatePresence>
//           {messages.map((message) => (
//             <motion.div
//               key={message.id}
//               id={`message-${message.id}`}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               transition={{ duration: 0.2 }}
//               className={`flex gap-3 group ${
//                 message.isMe ? "justify-end" : "justify-start"
//               }`}
//             >
//               {!message.isMe && (
//                 <Avatar className="h-8 w-8">
//                   <AvatarImage src={message.avatar} />
//                   <AvatarFallback>{message.sender[0]}</AvatarFallback>
//                 </Avatar>
//               )}
//               <div
//                 className={`max-w-[75%] p-3 rounded-lg relative ${
//                   message.isMe
//                     ? "bg-primary text-primary-foreground"
//                     : "bg-secondary"
//                 } ${message.deleted ? "opacity-70 italic" : ""}`}
//               >
//                 {message.pinned && (
//                   <Pin className="h-3 w-3 absolute -top-1.5 -left-1.5 text-primary" />
//                 )}
//                 {!message.isMe && (
//                   <p className="text-sm font-medium mb-1">{message.sender}</p>
//                 )}
//                 {editingMessageId === message.id ? (
//                   <Input
//                     value={editContent}
//                     onChange={(e) => setEditContent(e.target.value)}
//                     onBlur={() => saveEditedMessage(message.id)}
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter") saveEditedMessage(message.id);
//                     }}
//                     autoFocus
//                   />
//                 ) : (
//                   <p className="text-sm">{message.content}</p>
//                 )}
//                 <p className="text-xs text-muted-foreground mt-1">
//                   {message.timestamp}
//                 </p>

//                 {/* Reactions */}
//                 {Object.entries(message.reactions).length > 0 && (
//                   <div className="flex gap-1 mt-2">
//                     {Object.entries(message.reactions).map(([emoji, count]) => (
//                       <Button
//                         key={emoji}
//                         variant="outline"
//                         size="sm"
//                         className="h-6 px-2 rounded-full text-xs"
//                         onClick={() => handleAddReaction(message.id, emoji)}
//                       >
//                         {emoji} {count}
//                       </Button>
//                     ))}
//                   </div>
//                 )}

//                 {/* Add Reaction Popover */}
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="h-6 w-6 absolute -bottom-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
//                     >
//                       <Smile className="h-3 w-3" />
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-auto p-2">
//                     <div className="flex gap-2">
//                       {REACTION_EMOJIS.map((emoji) => (
//                         <Button
//                           key={emoji}
//                           variant="ghost"
//                           size="sm"
//                           className="h-8 w-8 p-0 text-lg"
//                           onClick={() => handleAddReaction(message.id, emoji)}
//                         >
//                           {emoji}
//                         </Button>
//                       ))}
//                     </div>
//                   </PopoverContent>
//                 </Popover>

//                 {/* Message Options Dropdown */}
//                 {!message.deleted && (isAdmin || message.isMe) && (
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="h-6 w-6 absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
//                       >
//                         <MoreVertical className="h-3 w-3" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent className="w-48">
//                       {message.isMe && (
//                         <DropdownMenuItem
//                           className="flex items-center gap-3"
//                           onClick={() =>
//                             handleEditMessage(message.id, message.content)
//                           }
//                         >
//                           <Edit className="h-4 w-4" />
//                           <span>Edit</span>
//                         </DropdownMenuItem>
//                       )}
//                       <DropdownMenuItem
//                         className="flex items-center gap-3"
//                         onClick={() => handlePinMessage(message.id)}
//                       >
//                         <Pin className="h-4 w-4" />
//                         <span>Pin</span>
//                       </DropdownMenuItem>
//                       <DropdownMenuItem
//                         className="flex items-center gap-3 text-red-500"
//                         onClick={() => setMessageToDelete(message.id)}
//                       >
//                         <Trash className="h-4 w-4" />
//                         <span>Delete</span>
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 )}
//               </div>
//             </motion.div>
//           ))}
//         </AnimatePresence>
//       </ScrollArea>

//       {/* Delete Confirmation Dialog */}
//       <AlertDialog
//         open={messageToDelete !== null}
//         onOpenChange={() => setMessageToDelete(null)}
//       >
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//             <AlertDialogDescription>
//               This action cannot be undone. This will permanently delete the
//               message.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               className="bg-red-500 hover:bg-red-600"
//               onClick={() =>
//                 messageToDelete && handleDeleteMessage(messageToDelete)
//               }
//             >
//               Delete
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       {/* Chat Input */}
//       <div className="border-t p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//         <div className="flex items-center gap-2">
//           <Button variant="ghost" size="icon" className="rounded-full">
//             <Smile className="h-4 w-4" />
//           </Button>
//           <Button variant="ghost" size="icon" className="rounded-full">
//             <Paperclip className="h-4 w-4" />
//           </Button>
//           <Input
//             placeholder="Type a message..."
//             className="flex-1"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//           />
//           <Button size="icon" className="rounded-full" disabled={!message}>
//             <Send className="h-4 w-4" />
//           </Button>
//         </div>
//         {isTyping && <p className="text-xs teground mt-2">u are typing...</p>}
//       </div>
//     </div>
//   );
// };

// export default NewChatArea;

// "use client";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Send,
//   Smile,
//   Paperclip,
//   MoreVertical,
//   Video,
//   Phone,
//   Info,
//   Edit,
//   Pin,
//   Trash,
//   Search,
//   Image,
//   File,
//   Link,
//   Check,
// } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { useState, useEffect } from "react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import data from "@emoji-mart/data";
// import Picker from "@emoji-mart/react";
// // import { useAuthStore } from "@/store/useAuthStore";

// const initialMessages = [
//   {
//     id: 1,
//     sender: "John Doe",
//     avatar: "https://example.com/avatar1.jpg",
//     type: "text",
//     content: "Hey, how's it going?",
//     timestamp: "10:00 AM",
//     isMe: false,
//     pinned: false,
//     deleted: false,
//   },
//   {
//     id: 2,
//     sender: "You",
//     avatar: "https://example.com/avatar2.jpg",
//     type: "text",
//     content: "Great! Just working on the project.",
//     timestamp: "10:05 AM",
//     isMe: true,
//     pinned: false,
//     deleted: false,
//     reactions: { "👏": 1 },
//   },
//   {
//     id: 3,
//     sender: "System",
//     type: "system",
//     content: "Jane Smith joined the chat",
//     timestamp: "10:10 AM",
//     isMe: false,
//     pinned: false,
//     deleted: false,
//   },
//   {
//     id: 4,
//     sender: "John Doe",
//     avatar: "https://example.com/avatar1.jpg",
//     type: "file",
//     content: {
//       name: "Project_Report.pdf",
//       size: "2.5 MB",
//       url: "https://example.com/Project_Report.pdf",
//     },
//     timestamp: "10:15 AM",
//     isMe: false,
//     pinned: false,
//     deleted: false,
//   },
//   {
//     id: 5,
//     sender: "You",
//     avatar: "https://example.com/avatar2.jpg",
//     type: "link",
//     content: {
//       url: "https://example.com",
//       title: "Example Website",
//       description: "This is an example website",
//     },
//     timestamp: "10:20 AM",
//     isMe: true,
//     pinned: false,
//     deleted: false,
//     reactions: {},
//   },
//   // Add more messages here
// ];

// const REACTION_EMOJIS = ["👍", "😄", "❤️", "👏", "🔥"]; // Limited set of 5 emojis

// const NewChatArea = ({ chatName = "John Doe" }) => {
//   //   const { user } = useAuthStore();
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState(initialMessages);
//   const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
//   const [editContent, setEditContent] = useState("");
//   const [messageToDelete, setMessageToDelete] = useState<number | null>(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [isTyping, setIsTyping] = useState(false);
//   const [otherUserTyping, setOtherUserTyping] = useState(false);
//   const [selectedMessages, setSelectedMessages] = useState<number[]>([]);
//   const [isSelectMode, setIsSelectMode] = useState(false);

//   // Toggle message selection
//   const toggleMessageSelection = (id: number) => {
//     if (isSelectMode) {
//       setSelectedMessages((prev) =>
//         prev.includes(id) ? prev.filter((msgId) => msgId !== id) : [...prev, id]
//       );
//     }
//   };

//   // Enter select mode
//   const enterSelectMode = () => {
//     setIsSelectMode(true);
//   };

//   // Exit select mode
//   const exitSelectMode = () => {
//     setIsSelectMode(false);
//     setSelectedMessages([]);
//   };

//   // Delete selected messages
//   const deleteSelectedMessages = () => {
//     setMessages((prev) =>
//       prev.map((msg) =>
//         selectedMessages.includes(msg.id)
//           ? { ...msg, deleted: true, content: "This message was deleted" }
//           : msg
//       )
//     );
//     exitSelectMode();
//   };

//   // Pin selected messages
//   const pinSelectedMessages = () => {
//     setMessages((prev) =>
//       prev.map((msg) =>
//         selectedMessages.includes(msg.id) ? { ...msg, pinned: true } : msg
//       )
//     );
//     exitSelectMode();
//   };

//   // Simulate typing detection (replace with real-time implementation)
//   useEffect(() => {
//     if (message) {
//       setIsTyping(true);
//       // Simulate other user typing
//       const typingTimeout = setTimeout(() => {
//         setOtherUserTyping(true);
//       }, 1000);

//       return () => {
//         clearTimeout(typingTimeout);
//         setIsTyping(false);
//         setOtherUserTyping(false);
//       };
//     } else {
//       setIsTyping(false);
//       setOtherUserTyping(false);
//     }
//   }, [message]);

//   const filteredMessages = searchQuery
//     ? messages.filter((msg) =>
//         msg.content.toLowerCase().includes(searchQuery.toLowerCase())
//       )
//     : messages;

//   const highlightText = (text: string, query: string) => {
//     if (!query) return text;
//     const parts = text.split(new RegExp(`(${query})`, "gi"));
//     return parts.map((part, index) =>
//       part.toLowerCase() === query.toLowerCase() ? (
//         <span key={index} className="bg-yellow-200 text-black">
//           {part}
//         </span>
//       ) : (
//         part
//       )
//     );
//   };

//   // Filter pinned messages
//   const pinnedMessages = messages.filter((msg) => msg.pinned && !msg.deleted);

//   // Filter regular messages (excluding pinned and deleted)
//   const regularMessages = messages.filter((msg) => !msg.pinned && !msg.deleted);

//   const handleDeleteMessage = (id: number) => {
//     setMessages((prev) =>
//       prev.map((msg) =>
//         msg.id === id
//           ? { ...msg, deleted: true, content: "This message was deleted" }
//           : msg
//       )
//     );
//     setMessageToDelete(null);
//   };

//   const handleEditMessage = (id: number, content: string) => {
//     setEditingMessageId(id);
//     setEditContent(content);
//   };

//   const saveEditedMessage = (id: number) => {
//     setMessages((prev) =>
//       prev.map((msg) =>
//         msg.id === id ? { ...msg, content: editContent } : msg
//       )
//     );
//     setEditingMessageId(null);
//     setEditContent("");
//   };

//   const handlePinMessage = (id: number) => {
//     setMessages((prev) =>
//       prev.map((msg) => (msg.id === id ? { ...msg, pinned: !msg.pinned } : msg))
//     );
//   };

//   const handleAddReaction = (messageId: number, emoji: string) => {
//     setMessages((prev) =>
//       prev.map((msg) =>
//         msg.id === messageId
//           ? {
//               ...msg,
//               reactions: {
//                 ...msg.reactions,
//                 [emoji]: (msg.reactions[emoji] || 0) + 1,
//               },
//             }
//           : msg
//       )
//     );
//   };

//   const isAdmin = true; // Example role-based permission

//   const renderMessageContent = (message: any) => {
//     switch (message.type) {
//       case "text":
//         return <p className="text-sm">{message.content}</p>;
//       case "image":
//         return (
//           <div className="max-w-[300px]">
//             <img
//               src={message.content}
//               alt="Sent image"
//               className="w-full h-auto rounded-lg"
//             />
//           </div>
//         );
//       case "file":
//         return (
//           <a
//             href={message.content.url}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="flex items-center gap-2 p-2 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
//           >
//             <File className="h-4 w-4" />
//             <div>
//               <p className="text-sm font-medium">{message.content.name}</p>
//               <p className="text-xs text-muted-foreground">
//                 {message.content.size}
//               </p>
//             </div>
//           </a>
//         );
//       case "link":
//         return (
//           <a
//             href={message.content.url}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="block p-2 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
//           >
//             <p className="text-sm font-medium">{message.content.title}</p>
//             <p className="text-xs text-muted-foreground">
//               {message.content.description}
//             </p>
//           </a>
//         );
//       case "system":
//         return (
//           <p className="text-sm text-muted-foreground text-center">
//             {message.content}
//           </p>
//         );
//       default:
//         return <p className="text-sm">{message.content}</p>;
//     }
//   };

//   return (
//     <div className="flex flex-col h-full">
//       {/* Chat Header */}
//       <div className="border-b p-4 flex items-center justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//         <div className="flex items-center gap-3">
//           <Avatar className="h-10 w-10">
//             <AvatarImage src="https://example.com/avatar1.jpg" />
//             <AvatarFallback>{chatName[0]}</AvatarFallback>
//           </Avatar>
//           <div>
//             <h2 className="font-semibold">{chatName}</h2>
//             {otherUserTyping && (
//               <div className="flex items-center gap-1">
//                 <span className="text-xs text-muted-foreground">Typing</span>
//                 <TypingIndicator />
//               </div>
//             )}
//           </div>
//         </div>
//         <div className="flex items-center gap-2">
//           <Button
//             variant="ghost"
//             size="icon"
//             className="rounded-full"
//             onClick={() => setIsSearchOpen(!isSearchOpen)}
//           >
//             <Search className="h-4 w-4" />
//           </Button>
//           <Button variant="ghost" size="icon" className="rounded-full">
//             <Video className="h-4 w-4" />
//           </Button>
//           <Button variant="ghost" size="icon" className="rounded-full">
//             <Phone className="h-4 w-4" />
//           </Button>
//           <Button variant="ghost" size="icon" className="rounded-full">
//             <Info className="h-4 w-4" />
//           </Button>
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" size="icon" className="rounded-full">
//                 <MoreVertical className="h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent className="w-48">
//               <DropdownMenuItem
//                 className="flex items-center gap-3"
//                 onClick={enterSelectMode}
//               >
//                 <Check className="h-4 w-4" />
//                 <span>Select Messages</span>
//               </DropdownMenuItem>
//               {message.isMe && (
//                 <DropdownMenuItem
//                   className="flex items-center gap-3"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleEditMessage(message.id, message.content);
//                   }}
//                 >
//                   <Edit className="h-4 w-4" />
//                   <span>Edit</span>
//                 </DropdownMenuItem>
//               )}
//               <DropdownMenuItem
//                 className="flex items-center gap-3"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handlePinMessage(message.id);
//                 }}
//               >
//                 <Pin className="h-4 w-4" />
//                 <span>Pin</span>
//               </DropdownMenuItem>
//               <DropdownMenuItem
//                 className="flex items-center gap-3 text-red-500"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setMessageToDelete(message.id);
//                 }}
//               >
//                 <Trash className="h-4 w-4" />
//                 <span>Delete</span>
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>

//       {/* Selection Actions Bar */}
//       {isSelectMode && (
//         <div className="border-b p-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={exitSelectMode}
//               className="text-muted-foreground"
//             >
//               {selectedMessages.length} selected
//             </Button>
//           </div>
//           <div className="flex items-center gap-2">
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={pinSelectedMessages}
//               className="flex items-center gap-2"
//             >
//               <Pin className="h-4 w-4" />
//               <span>Pin</span>
//             </Button>
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={deleteSelectedMessages}
//               className="flex items-center gap-2 text-red-500"
//             >
//               <Trash className="h-4 w-4" />
//               <span>Delete</span>
//             </Button>
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={exitSelectMode}
//               className="text-muted-foreground"
//             >
//               Cancel
//             </Button>
//           </div>
//         </div>
//       )}

//       {/* Search Bar */}
//       {isSearchOpen && (
//         <div className="border-b p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search messages..."
//               className="pl-10"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
//         </div>
//       )}

//       {/* Pinned Messages Bar */}
//       {pinnedMessages.length > 0 && (
//         <div className="border-b p-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//           <div className="flex items-center gap-2">
//             <Pin className="h-4 w-4 text-primary" />
//             <h4 className="text-sm font-semibold">Pinned Messages</h4>
//           </div>
//           <ScrollArea className="w-full mt-2">
//             <div className="flex gap-2">
//               {pinnedMessages.map((message) => (
//                 <motion.div
//                   key={message.id}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                   transition={{ duration: 0.2 }}
//                   className="flex-shrink-0 p-2 bg-secondary rounded-lg max-w-[200px] cursor-pointer hover:bg-secondary/80 transition-colors group"
//                   onClick={() => {
//                     // Scroll to the pinned message in the chat
//                     const element = document.getElementById(
//                       `message-${message.id}`
//                     );
//                     element?.scrollIntoView({ behavior: "smooth" });
//                   }}
//                 >
//                   <div className="flex items-center gap-2">
//                     <Avatar className="h-6 w-6">
//                       <AvatarImage src={message.avatar} />
//                       <AvatarFallback>{message.sender[0]}</AvatarFallback>
//                     </Avatar>
//                     <p className="text-sm truncate">{message.content}</p>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </ScrollArea>
//         </div>
//       )}

//       {/* Message List */}
//       <ScrollArea className="flex-1 p-4 space-y-4">
//         <AnimatePresence>
//           {messages.map((message) => (
//             <motion.div
//               key={message.id}
//               id={`message-${message.id}`}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               transition={{ duration: 0.2 }}
//               className={`flex gap-3 ${
//                 message.isMe ? "justify-end" : "justify-start"
//               } ${message.type === "system" ? "justify-center" : ""}`}
//               onClick={() => toggleMessageSelection(message.id)}
//             >
//               {!message.isMe && message.type !== "system" && (
//                 <Avatar className="h-8 w-8">
//                   <AvatarImage src={message.avatar} />
//                   <AvatarFallback>{message.sender[0]}</AvatarFallback>
//                 </Avatar>
//               )}
//               <div
//                 className={`max-w-[75%] p-3 rounded-lg relative ${
//                   message.isMe
//                     ? "bg-primary text-primary-foreground"
//                     : message.type === "system"
//                       ? "bg-transparent"
//                       : "bg-secondary"
//                 } ${message.deleted ? "opacity-70 italic" : ""} ${
//                   selectedMessages.includes(message.id)
//                     ? "ring-2 ring-primary"
//                     : ""
//                 }`}
//               >
//                 {selectedMessages.includes(message.id) && (
//                   <div className="absolute -top-2 -left-2 bg-primary rounded-full p-1">
//                     <Check className="h-3 w-3 text-primary-foreground" />
//                   </div>
//                 )}
//                 {message.pinned && (
//                   <Pin className="h-3 w-3 absolute -top-1.5 -left-1.5 text-primary" />
//                 )}
//                 {!message.isMe && message.type !== "system" && (
//                   <p className="text-sm font-medium mb-1">{message.sender}</p>
//                 )}
//                 {renderMessageContent(message)}
//                 <p className="text-xs text-muted-foreground mt-1">
//                   {message.timestamp}
//                 </p>

//                 {/* Reactions */}
//                 {/* {Object.entries(message.reactions).length > 0 && (
//                   <div className="flex gap-1 mt-2 flex-wrap">
//                     {Object.entries(message.reactions).map(([emoji, count]) => (
//                       <Button
//                         key={emoji}
//                         variant="outline"
//                         size="sm"
//                         className="h-6 px-2 rounded-full text-xs bg-background/50 backdrop-blur"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleAddReaction(message.id, emoji);
//                         }}
//                       >
//                         {emoji} {count}
//                       </Button>
//                     ))}
//                   </div>
//                 )} */}

//                 {/* Add Reaction Popover */}
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="h-6 w-6 absolute -bottom-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
//                     >
//                       <Smile className="h-3 w-3" />
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-auto p-2">
//                     <div className="flex gap-2">
//                       {REACTION_EMOJIS.map((emoji) => (
//                         <Button
//                           key={emoji}
//                           variant="ghost"
//                           size="sm"
//                           className="h-8 w-8 p-0 text-lg"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleAddReaction(message.id, emoji);
//                           }}
//                         >
//                           {emoji}
//                         </Button>
//                       ))}
//                     </div>
//                   </PopoverContent>
//                 </Popover>

//                 {/* Message Options Dropdown */}
//                 {!message.deleted && (isAdmin || message.isMe) && (
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="h-6 w-6 absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
//                       >
//                         <MoreVertical className="h-3 w-3" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent className="w-48">
//                       {message.isMe && (
//                         <DropdownMenuItem
//                           className="flex items-center gap-3"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleEditMessage(message.id, message.content);
//                           }}
//                         >
//                           <Edit className="h-4 w-4" />
//                           <span>Edit</span>
//                         </DropdownMenuItem>
//                       )}
//                       <DropdownMenuItem
//                         className="flex items-center gap-3"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handlePinMessage(message.id);
//                         }}
//                       >
//                         <Pin className="h-4 w-4" />
//                         <span>Pin</span>
//                       </DropdownMenuItem>
//                       <DropdownMenuItem
//                         className="flex items-center gap-3 text-red-500"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           setMessageToDelete(message.id);
//                         }}
//                       >
//                         <Trash className="h-4 w-4" />
//                         <span>Delete</span>
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 )}
//               </div>
//             </motion.div>
//           ))}
//         </AnimatePresence>
//       </ScrollArea>

//       {/* Delete Confirmation Dialog */}
//       <AlertDialog
//         open={messageToDelete !== null}
//         onOpenChange={() => setMessageToDelete(null)}
//       >
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//             <AlertDialogDescription>
//               This action cannot be undone. This will permanently delete the
//               message.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               className="bg-red-500 hover:bg-red-600"
//               onClick={() =>
//                 messageToDelete && handleDeleteMessage(messageToDelete)
//               }
//             >
//               Delete
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       {/* Chat Input */}
//       <div className="border-t p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//         <div className="flex items-center gap-2">
//           <Button
//             variant="ghost"
//             size="icon"
//             className="rounded-full hover:bg-background/50"
//           >
//             <Smile className="h-4 w-4" />
//           </Button>
//           <Button
//             variant="ghost"
//             size="icon"
//             className="rounded-full hover:bg-background/50"
//           >
//             <Paperclip className="h-4 w-4" />
//           </Button>
//           <Input
//             placeholder="Type a message..."
//             className="flex-1 bg-background/50 backdrop-blur hover:bg-background/60 focus:bg-background/60 transition-colors"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//           />
//           <Button
//             size="icon"
//             className="rounded-full bg-primary hover:bg-primary/90 transition-colors"
//             disabled={!message}
//           >
//             <Send className="h-4 w-4" />
//           </Button>
//         </div>
//         {isTyping && (
//           <p className="text-xs text-muted-foreground mt-2 animate-pulse">
//             Typing...
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// const TypingIndicator = () => {
//   return (
//     <div className="flex items-center gap-1">
//       <motion.div
//         className="w-1.5 h-1.5 bg-muted-foreground rounded-full"
//         animate={{ y: [0, -4, 0] }}
//         transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
//       />
//       <motion.div
//         className="w-1.5 h-1.5 bg-muted-foreground rounded-full"
//         animate={{ y: [0, -4, 0] }}
//         transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
//       />
//       <motion.div
//         className="w-1.5 h-1.5 bg-muted-foreground rounded-full"
//         animate={{ y: [0, -4, 0] }}
//         transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
//       />
//     </div>
//   );
// };

// export default NewChatArea;

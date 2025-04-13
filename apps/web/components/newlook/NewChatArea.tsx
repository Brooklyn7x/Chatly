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
//   Plus,
//   Bell,
//   X,
//   Palette,
//   BookOpen,
// } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { useState, useEffect, useRef } from "react";
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
// import data from "@emoji-mart/data"; // Install emoji-mart for the emoji picker
// import Picker from "@emoji-mart/react"; // Install emoji-mart for the emoji picker

// import { Progress } from "@/components/ui/progress"; // Add a Progress component

// const defaultEmojis = ["👍", "❤️", "😂", "😮", "👏"];

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

// // Example sticker data (replace with your own stickers)
// const stickers = [
//   { id: "1", url: "/stickers/sticker1.png" },
//   { id: "2", url: "/stickers/sticker2.png" },
//   { id: "3", url: "/stickers/sticker3.png" },
//   { id: "4", url: "/stickers/sticker4.png" },
// ];

// // Example themes with fancy backgrounds
// const themes = [
//   {
//     name: "Default",
//     background: "bg-background",
//     textColor: "text-foreground",
//     buttonColor: "bg-primary",
//   },
//   {
//     name: "Dark",
//     background: "bg-gray-900",
//     textColor: "text-white",
//     buttonColor: "bg-blue-600",
//   },
//   {
//     name: "Light",
//     background: "bg-white",
//     textColor: "text-gray-900",
//     buttonColor: "bg-blue-500",
//   },
//   {
//     name: "Sunset",
//     background: "bg-gradient-to-br from-orange-400 to-pink-500",
//     textColor: "text-white",
//     buttonColor: "bg-purple-600",
//   },
//   {
//     name: "Ocean",
//     background: "bg-gradient-to-br from-blue-400 to-teal-500",
//     textColor: "text-white",
//     buttonColor: "bg-teal-600",
//   },
//   {
//     name: "Galaxy",
//     background: "bg-[url('/backgrounds/galaxy.jpg')] backdrop-blur-sm",
//     textColor: "text-white",
//     buttonColor: "bg-indigo-600",
//   },
//   {
//     name: "Pattern",
//     background: "bg-[url('/backgrounds/pattern.png')] bg-repeat",
//     textColor: "text-gray-900",
//     buttonColor: "bg-yellow-500",
//   },
//   {
//     name: "Abstract",
//     background: "bg-[url('/user.png')] bg-cover bg-center",
//     textColor: "text-white",
//     buttonColor: "bg-pink-600",
//   },
// ];

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
//   const [unreadMessageCount, setUnreadMessageCount] = useState(0);
//   const [latestMessage, setLatestMessage] = useState<{
//     sender: string;
//     avatar: string;
//     content: string;
//   } | null>(null);
//   const scrollAreaRef = useRef<HTMLDivElement>(null);
//   const [attachments, setAttachments] = useState<
//     Array<{ file: File; previewUrl: string; uploadProgress?: number }>
//   >([]);
//   const [isUploading, setIsUploading] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [selectedTheme, setSelectedTheme] = useState(themes[0]); // Default theme
//   const [isSummaryVisible, setIsSummaryVisible] = useState(false);
//   const [summary, setSummary] = useState("");

//   // Simulate new messages (replace with real-time implementation)
//   // useEffect(() => {
//   //   const interval = setInterval(() => {
//   //     const newMessage = {
//   //       id: messages.length + 1,
//   //       sender: "John Doe",
//   //       avatar: "https://example.com/avatar1.jpg",
//   //       type: "text",
//   //       content: "New message!",
//   //       timestamp: new Date().toLocaleTimeString(),
//   //       isMe: false,
//   //       pinned: false,
//   //       deleted: false,
//   //       reactions: {},
//   //     };
//   //     // setMessages((prev) => [...prev, newMessage]);

//   //     // Set the latest message for the notification bar
//   //     setLatestMessage({
//   //       sender: newMessage.sender,
//   //       avatar: newMessage.avatar,
//   //       content: newMessage.content,
//   //     });

//   //     // Clear the notification after 5 seconds
//   //     setTimeout(() => {
//   //       setLatestMessage(null);
//   //     }, 10000);

//   //     setUnreadMessageCount((prev) => prev + 1); // Increment unread message count
//   //   }, 1000); // Simulate a new message every 10 seconds

//   //   return () => clearInterval(interval);
//   // }, [messages]);

//   // Scroll to the bottom and mark messages as read
//   const scrollToBottom = () => {
//     if (scrollAreaRef.current) {
//       scrollAreaRef.current.scrollTo({
//         top: scrollAreaRef.current.scrollHeight,
//         behavior: "smooth",
//       });
//       setUnreadMessageCount(0); // Reset unread message count
//     }
//   };

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

//   const handleEmojiSelect = (emoji: any) => {
//     setMessage((prev) => prev + emoji.native);
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

//   // Handle file selection
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files) {
//       const newAttachments = Array.from(files).map((file) => ({
//         file,
//         previewUrl: URL.createObjectURL(file),
//         uploadProgress: 0,
//       }));
//       setAttachments((prev) => [...prev, ...newAttachments]);
//       startUpload(newAttachments);
//     }
//   };

//   // Simulate file upload
//   const startUpload = (
//     attachments: Array<{
//       file: File;
//       previewUrl: string;
//       uploadProgress?: number;
//     }>
//   ) => {
//     setIsUploading(true);
//     attachments.forEach((attachment, index) => {
//       const interval = setInterval(() => {
//         setAttachments((prev) =>
//           prev.map((a, i) =>
//             i === index
//               ? { ...a, uploadProgress: Math.min(a.uploadProgress! + 10, 100) }
//               : a
//           )
//         );
//       }, 200);

//       setTimeout(() => {
//         clearInterval(interval);
//         if (index === attachments.length - 1) {
//           setIsUploading(false);
//         }
//       }, 2000);
//     });
//   };

//   // Remove an attachment
//   const removeAttachment = (index: number) => {
//     setAttachments((prev) => prev.filter((_, i) => i !== index));
//   };

//   // Clear all attachments
//   const clearAttachments = () => {
//     setAttachments([]);
//   };

//   // Send message with attachments
//   const sendMessage = () => {
//     if (message.trim() || attachments.length > 0) {
//       // TODO: Send message and attachments to the server
//       console.log("Message:", message);
//       console.log("Attachments:", attachments);
//       setMessage("");
//       clearAttachments();
//     }
//   };

//   // Handle sticker selection
//   const handleStickerSelect = (stickerUrl: string) => {
//     // TODO: Send sticker to the server
//     console.log("Sticker sent:", stickerUrl);
//   };

//   // Handle theme selection
//   const handleThemeSelect = (theme: any) => {
//     setSelectedTheme(theme);
//   };

//   // Toggle summary visibility
//   const toggleSummary = () => {
//     setIsSummaryVisible((prev) => !prev);
//     // TODO: Call backend API to generate summary
//     setSummary(
//       "This is a placeholder summary. Integrate with an AI model to generate a real summary."
//     );
//   };

//   return (
//     <motion.div
//       key={selectedTheme.name}
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       transition={{ duration: 0.5 }}
//       className={`flex flex-col h-full ${selectedTheme.background} ${selectedTheme.textColor}`}
//     >
//       {/* Notification Bar */}
//       {latestMessage && (
//         <motion.div
//           initial={{ opacity: 0, y: -50 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -50 }}
//           transition={{ duration: 0.3 }}
//           className="fixed top-0 left-0 right-0 z-50 p-2"
//         >
//           <div
//             className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-lg p-2 shadow-sm flex items-center gap-2 cursor-pointer hover:bg-secondary/80 transition-colors"
//             onClick={scrollToBottom}
//           >
//             <Avatar className="h-6 w-6">
//               <AvatarImage src={latestMessage.avatar} />
//               <AvatarFallback>{latestMessage.sender[0]}</AvatarFallback>
//             </Avatar>
//             <div>
//               <p className="text-sm font-medium">{latestMessage.sender}</p>
//               <p className="text-sm text-muted-foreground">
//                 {latestMessage.content}
//               </p>
//             </div>
//           </div>
//         </motion.div>
//       )}

//       {/* Chat Header */}
//       <div className="border-b p-4 flex items-center justify-between backdrop-blur-sm bg-background/50">
//         <div className="flex items-center gap-2">
//           <Avatar>
//             <AvatarImage src="https://github.com/shadcn.png" />
//             <AvatarFallback>CN</AvatarFallback>
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
//           {/* Unread Messages Badge */}
//           {unreadMessageCount > 0 && (
//             <Button
//               variant="ghost"
//               size="icon"
//               className="rounded-full relative"
//               onClick={scrollToBottom}
//             >
//               <Bell className="h-4 w-4" />
//               <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full text-xs px-1.5">
//                 {unreadMessageCount}
//               </span>
//             </Button>
//           )}
//           <Button variant="ghost" size="icon" className="rounded-full">
//             <Video className="h-4 w-4" />
//           </Button>
//           <Button variant="ghost" size="icon" className="rounded-full">
//             <Phone className="h-4 w-4" />
//           </Button>
//           <Button variant="ghost" size="icon" className="rounded-full">
//             <Info className="h-4 w-4" />
//           </Button>
//           <Button
//             variant="ghost"
//             size="icon"
//             className="rounded-full"
//             onClick={toggleSummary}
//           >
//             <BookOpen className="h-4 w-4" />
//           </Button>
//           <Popover>
//             <PopoverTrigger asChild>
//               <Button variant="ghost" size="icon" className="rounded-full">
//                 <Palette className="h-4 w-4" />
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-48 p-2">
//               <h4 className="text-sm font-semibold mb-2">Select Theme</h4>
//               <div className="space-y-1">
//                 {themes.map((theme) => (
//                   <Button
//                     key={theme.name}
//                     variant="ghost"
//                     className="w-full justify-start"
//                     onClick={() => handleThemeSelect(theme)}
//                   >
//                     {theme.name}
//                   </Button>
//                 ))}
//               </div>
//             </PopoverContent>
//           </Popover>
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

//       {/* Summary Section */}
//       {isSummaryVisible && (
//         <motion.div
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -10 }}
//           transition={{ duration: 0.3 }}
//           className="border-b p-4 bg-background/50 backdrop-blur-sm"
//         >
//           <div className="flex items-center justify-between mb-2">
//             <h3 className="font-semibold">Chat Summary</h3>
//             <Button
//               variant="ghost"
//               size="icon"
//               className="rounded-full"
//               onClick={toggleSummary}
//             >
//               <X className="h-4 w-4" />
//             </Button>
//           </div>
//           <div className="bg-background/80 p-3 rounded-lg border">
//             <p className="text-sm">{summary}</p>
//           </div>
//         </motion.div>
//       )}

//       {/* Message List */}
//       <ScrollArea className="flex-1 p-4 space-y-4" ref={scrollAreaRef}>
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

//       {/* Attachment Previews */}
//       {attachments.length > 0 && (
//         <div className="border-t p-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//           <div className="flex items-center justify-between">
//             <h4 className="text-sm font-semibold">Attachments</h4>
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={clearAttachments}
//               className="text-muted-foreground"
//             >
//               Clear All
//             </Button>
//           </div>
//           <div className="flex gap-2 mt-2 overflow-x-auto">
//             {attachments.map((attachment, index) => (
//               <div key={index} className="relative">
//                 {attachment.file.type.startsWith("image/") ? (
//                   <img
//                     src={attachment.previewUrl}
//                     alt="Attachment preview"
//                     className="h-20 w-20 object-cover rounded-lg"
//                   />
//                 ) : (
//                   <div className="h-20 w-20 bg-secondary rounded-lg flex items-center justify-center">
//                     <File className="h-6 w-6 text-muted-foreground" />
//                     <p className="text-xs text-muted-foreground mt-1 truncate">
//                       {attachment.file.name}
//                     </p>
//                   </div>
//                 )}
//                 {attachment.uploadProgress! < 100 && (
//                   <Progress
//                     value={attachment.uploadProgress}
//                     className="absolute bottom-0 left-0 w-full h-1 rounded-b-lg"
//                   />
//                 )}
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="h-6 w-6 absolute -top-2 -right-2 bg-background rounded-full p-1"
//                   onClick={() => removeAttachment(index)}
//                 >
//                   <X className="h-3 w-3" />
//                 </Button>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Chat Input */}
//       <div className={`border-t p-4 backdrop-blur-sm bg-background/50`}>
//         <div className="flex items-center gap-2">
//           <Button
//             variant="ghost"
//             size="icon"
//             className="rounded-full"
//             onClick={() => fileInputRef.current?.click()}
//           >
//             <Paperclip className="h-4 w-4" />
//           </Button>
//           <Popover>
//             <PopoverTrigger asChild>
//               <Button variant="ghost" size="icon" className="rounded-full">
//                 <Smile className="h-4 w-4" />
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-auto p-0">
//               <Picker data={data} onEmojiSelect={handleEmojiSelect} />
//             </PopoverContent>
//           </Popover>
//           <Popover>
//             <PopoverTrigger asChild>
//               <Button variant="ghost" size="icon" className="rounded-full">
//                 <Image className="h-4 w-4" />
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-64 p-2">
//               <div className="grid grid-cols-3 gap-2">
//                 {stickers.map((sticker) => (
//                   <Button
//                     key={sticker.id}
//                     variant="ghost"
//                     size="icon"
//                     className="h-12 w-12 p-0"
//                     onClick={() => handleStickerSelect(sticker.url)}
//                   >
//                     <img
//                       src={sticker.url}
//                       alt="Sticker"
//                       className="h-full w-full object-cover"
//                     />
//                   </Button>
//                 ))}
//               </div>
//             </PopoverContent>
//           </Popover>
//           <Input
//             placeholder="Type a message..."
//             className="flex-1"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//           />
//           <Button
//             size="icon"
//             className="rounded-full"
//             onClick={sendMessage}
//             disabled={isUploading}
//           >
//             <Send className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>

//       {/* Hidden file input */}
//       <input
//         type="file"
//         ref={fileInputRef}
//         className="hidden"
//         multiple
//         onChange={handleFileChange}
//       />
//     </motion.div>
//   );
// };

// // Typing Indicator Component
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

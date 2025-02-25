// app/chat/page.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  MessageSquare, Users, Phone, Settings, Search, Paperclip, 
  Smile, Send, MoreVertical, ChevronLeft, Image, X, Mic, 
  Video, FileText, Shield, ArrowLeft, Check, ChevronDown
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Glow effect component
const GlowingElement = ({ children, className = "", intensity = "medium", isActive = false }) => {
  const glowIntensity = {
    light: "0 0 8px rgba(var(--primary), 0.15)",
    medium: "0 0 12px rgba(var(--primary), 0.25)",
    strong: "0 0 16px rgba(var(--primary), 0.35)"
  };
  
  return (
    <motion.div 
      className={`relative ${className}`}
      animate={isActive ? { 
        boxShadow: [
          glowIntensity[intensity], 
          `0 0 ${intensity === "strong" ? 20 : 15}px rgba(var(--primary), ${intensity === "light" ? 0.25 : 0.4})`, 
          glowIntensity[intensity]
        ],
      } : {}}
      transition={{ 
        duration: 2.5, 
        repeat: Infinity,
        repeatType: "reverse"
      }}
    >
      {children}
    </motion.div>
  );
};

// Sample data for chats
const sampleChats = [
  {
    id: 1,
    name: "Team ChatSync",
    avatar: "/team-avatar.jpg",
    lastMessage: "Let's discuss the new features",
    timestamp: "9:41 AM",
    unread: 3,
    isGroup: true,
    isActive: true,
    online: true,
    members: ["Alex", "Sam", "Jordan", "Taylor"]
  },
  {
    id: 2,
    name: "Alex Taylor",
    avatar: "/alex-avatar.jpg",
    lastMessage: "I'll send you the document soon",
    timestamp: "Yesterday",
    unread: 0,
    isGroup: false,
    isActive: false,
    online: true
  },
  {
    id: 3,
    name: "Sam Johnson",
    avatar: "/sam-avatar.jpg",
    lastMessage: "Sounds good, looking forward to it",
    timestamp: "Yesterday",
    unread: 1,
    isGroup: false,
    isActive: false,
    online: false
  },
  {
    id: 4,
    name: "Marketing Team",
    avatar: "/marketing-avatar.jpg",
    lastMessage: "How are the campaigns performing?",
    timestamp: "Tuesday",
    unread: 0,
    isGroup: true,
    isActive: false,
    online: true,
    members: ["Alex", "Sam", "Jordan", "Taylor", "Casey", "Morgan"]
  },
  {
    id: 5,
    name: "Jordan Smith",
    avatar: "/jordan-avatar.jpg",
    lastMessage: "Can we schedule a quick call?",
    timestamp: "Monday",
    unread: 0,
    isGroup: false,
    isActive: false,
    online: true
  },
  {
    id: 6,
    name: "Taylor Brown",
    avatar: "/taylor-avatar.jpg",
    lastMessage: "Thanks for the help!",
    timestamp: "Last week",
    unread: 0,
    isGroup: false,
    isActive: false,
    online: false
  }
];

// Sample messages for the active chat
const sampleMessages = [
  {
    id: 1,
    sender: "system",
    content: "This conversation is end-to-end encrypted. No one outside this chat can read or listen to them.",
    timestamp: "9:30 AM"
  },
  {
    id: 2,
    sender: "Alex",
    senderAvatar: "/alex-avatar.jpg",
    content: "Hey team, I wanted to discuss some new features for our app",
    timestamp: "9:32 AM",
    status: "read"
  },
  {
    id: 3,
    sender: "Sam",
    senderAvatar: "/sam-avatar.jpg",
    content: "Sounds good! What do you have in mind?",
    timestamp: "9:34 AM",
    status: "read"
  },
  {
    id: 4,
    sender: "you",
    content: "I've been thinking about adding end-to-end encryption for all messages and files",
    timestamp: "9:36 AM",
    status: "read"
  },
  {
    id: 5,
    sender: "Alex",
    senderAvatar: "/alex-avatar.jpg",
    content: "That's a great idea! Privacy is becoming increasingly important",
    timestamp: "9:37 AM",
    status: "read"
  },
  {
    id: 6,
    sender: "Jordan",
    senderAvatar: "/jordan-avatar.jpg",
    content: "I agree. We should also consider adding self-destructing messages as an option",
    timestamp: "9:38 AM",
    status: "read"
  },
  {
    id: 7,
    sender: "you",
    content: "Good point, Jordan. We could add a timer option for messages to automatically delete after being read",
    timestamp: "9:39 AM",
    status: "read"
  },
  {
    id: 8,
    sender: "Taylor",
    senderAvatar: "/taylor-avatar.jpg",
    content: "Another feature to consider is multi-device sync with seamless history transfer",
    timestamp: "9:40 AM",
    status: "read"
  },
  {
    id: 9,
    sender: "Alex",
    senderAvatar: "/alex-avatar.jpg",
    content: "These are all excellent suggestions. Let's prioritize them and create a development roadmap",
    timestamp: "9:41 AM",
    status: "delivered"
  }
];

export default function ChatPage() {
  const [activeChatId, setActiveChatId] = useState(1);
  const [chatSidebar, setChatSidebar] = useState(true);
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState(sampleChats);
  const [messages, setMessages] = useState(sampleMessages);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachmentOptions, setAttachmentOptions] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const messagesEndRef = useRef(null);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send new message
  const handleSendMessage = () => {
    if (message.trim() === "") return;
    
    const newMessage = {
      id: messages.length + 1,
      sender: "you",
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "sent"
    };
    
    setMessages([...messages, newMessage]);
    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeChat = chats.find(chat => chat.id === activeChatId);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Chat Sidebar */}
      <AnimatePresence>
        {chatSidebar && (
          <motion.div 
            className="w-80 border-r flex flex-col bg-background"
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <GlowingElement intensity="light" className="rounded-full">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                    <MessageSquare className="h-4 w-4 text-primary-foreground" />
                  </div>
                </GlowingElement>
                <h2 className="text-xl font-semibold">ChatSync</h2>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary/80">
                  <Users className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary/80">
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search chats" 
                  className="pl-9 bg-secondary/50 border-0 focus-visible:ring-1 rounded-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Chats List */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence>
                {filteredChats.map((chat) => (
                  <motion.div 
                    key={chat.id}
                    className={`p-3 flex items-center border-b cursor-pointer ${
                      chat.isActive ? 'bg-secondary/40' : 'hover:bg-secondary/20'
                    }`}
                    onClick={() => setActiveChatId(chat.id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    whileHover={{ backgroundColor: "rgba(var(--secondary), 0.3)" }}
                  >
                    <GlowingElement 
                      intensity="light" 
                      className="h-12 w-12 rounded-full flex-shrink-0 mr-3 relative"
                      isActive={chat.isActive}
                    >
                      <div className="h-12 w-12 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center text-xl font-semibold overflow-hidden">
                        {chat.avatar ? 
                          <img src={chat.avatar} alt={chat.name} className="h-full w-full object-cover" /> :
                          chat.name.charAt(0)
                        }
                      </div>
                      {chat.online && (
                        <motion.div 
                          className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"
                          animate={{ 
                            boxShadow: [
                              "0 0 0px rgba(74, 222, 128, 0.4)",
                              "0 0 3px rgba(74, 222, 128, 0.7)",
                              "0 0 0px rgba(74, 222, 128, 0.4)"
                            ]
                          }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity
                          }}
                        ></motion.div>
                      )}
                    </GlowingElement>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium truncate">{chat.name}</h3>
                        <span className="text-xs text-muted-foreground flex-shrink-0">{chat.timestamp}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                        {chat.unread > 0 && (
                          <GlowingElement 
                            className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-xs text-primary-foreground flex-shrink-0"
                            intensity="medium"
                            isActive={true}
                          >
                            <span>{chat.unread}</span>
                          </GlowingElement>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t">
              <Button className="w-full">
                <MessageSquare className="mr-2 h-4 w-4" />
                New Chat
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Main Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Chat Header */}
        <div className="p-4 border-b flex items-center justify-between bg-background/95 backdrop-blur-sm">
          <div className="flex items-center">
            {!chatSidebar && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="mr-2 rounded-full hover:bg-secondary/80"
                onClick={() => setChatSidebar(true)}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            <GlowingElement 
              intensity="light" 
              className="h-10 w-10 rounded-full flex-shrink-0 mr-3 relative"
            >
              <div className="h-10 w-10 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center overflow-hidden">
                {activeChat?.avatar ? 
                  <img src={activeChat.avatar} alt={activeChat.name} className="h-full w-full object-cover" /> :
                  activeChat?.name.charAt(0)
                }
              </div>
              {activeChat?.online && (
                <motion.div 
                  className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background"
                  animate={{ 
                    boxShadow: [
                      "0 0 0px rgba(74, 222, 128, 0.4)",
                      "0 0 3px rgba(74, 222, 128, 0.7)",
                      "0 0 0px rgba(74, 222, 128, 0.4)"
                    ]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity
                  }}
                ></motion.div>
              )}
            </GlowingElement>
            <div>
              <h2 className="font-medium flex items-center">
                {activeChat?.name}
                {activeChat?.isGroup && (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="outline-none">
                      <ChevronDown className="h-4 w-4 ml-1 text-muted-foreground" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                        Group Members:
                      </div>
                      {activeChat?.members?.map((member, index) => (
                        <DropdownMenuItem key={index}>
                          {member}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </h2>
              {activeChat?.online ? (
                <p className="text-xs text-muted-foreground flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5"></span>
                  Online
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">Offline</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-secondary/80"
            >
              <Phone className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-secondary/80"
            >
              <Video className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-secondary/80"
              onClick={() => setChatSidebar(!chatSidebar)}
            >
              {chatSidebar ? <ChevronLeft className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full hover:bg-secondary/80"
                >
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View contact</DropdownMenuItem>
                <DropdownMenuItem>Media, links, and docs</DropdownMenuItem>
                <DropdownMenuItem>Search</DropdownMenuItem>
                <DropdownMenuItem>Mute notifications</DropdownMenuItem>
                <DropdownMenuItem className="text-red-500">Clear chat</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-background/90 relative">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "you" ? "justify-end" : msg.sender === "system" ? "justify-center" : "justify-start"}`}>
                {msg.sender !== "you" && msg.sender !== "system" && (
                  <div className="h-8 w-8 rounded-full bg-secondary flex-shrink-0 mr-2 overflow-hidden">
                    {msg.senderAvatar ? 
                      <img src={msg.senderAvatar} alt={msg.sender} className="h-full w-full object-cover" /> :
                      msg.sender.charAt(0)
                    }
                  </div>
                )}
                <motion.div 
                  className={`max-w-[75%] rounded-lg px-4 py-2 mb-1 ${
                    msg.sender === "you" 
                      ? "bg-primary text-primary-foreground" 
                      : msg.sender === "system"
                      ? "bg-secondary/50 text-muted-foreground text-sm"
                      : "bg-secondary"
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  whileHover={msg.sender === "you" ? { 
                    boxShadow: "0 0 10px rgba(var(--primary), 0.3)"
                  } : msg.sender !== "system" ? { 
                    boxShadow: "0 0 10px rgba(var(--secondary), 0.5)"
                  } : {}}
                >
                  {msg.sender !== "you" && msg.sender !== "system" && (
                    <p className="text-xs font-medium text-primary/80 mb-1">{msg.sender}</p>
                  )}
                  <p>{msg.content}</p>
                  <div className="flex items-center justify-end mt-1 space-x-1">
                    <span className="text-xs opacity-70">{msg.timestamp}</span>
                    {msg.sender === "you" && (
                      <span>
                        {msg.status === "sent" && <Check className="h-3 w-3 opacity-70" />}
                        {msg.status === "delivered" && (
                          <div className="flex">
                            <Check className="h-3 w-3 opacity-70" />
                            <Check className="h-3 w-3 opacity-70 -ml-1" />
                          </div>
                        )}
                        {msg.status === "read" && (
                          <div className="flex text-blue-400">
                            <Check className="h-3 w-3" />
                            <Check className="h-3 w-3 -ml-1" />
                          </div>
                        )}
                      </span>
                    )}
                  </div>
                </motion.div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Encryption indicator */}
          <GlowingElement 
            className="absolute top-2 left-1/2 transform -translate-x-1/2 flex items-center space-x-1 bg-secondary/30 px-2 py-1 rounded-full text-xs text-muted-foreground"
            intensity="light"
            isActive={true}
          >
            <Shield className="h-3 w-3 text-primary" />
            <span>End-to-end encrypted</span>
          </GlowingElement>
        </div>

        {/* Message Input */}
        <div className="p-4 border-t bg-background">
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              {/* Emoji picker */}
              <AnimatePresence>
                {showEmojiPicker && (
                  <motion.div 
                    className="absolute bottom-full mb-2 left-0 bg-background border rounded-lg shadow-lg p-2 h-60 w-full max-w-xs overflow-y-auto"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <div className="grid grid-cols-8 gap-1">
                      {Array.from({ length: 64 }, (_, i) => (
                        <button 
                          key={i} 
                          className="h-8 w-8 flex items-center justify-center rounded hover:bg-secondary"
                          onClick={() => {
                            setMessage(prev => prev + ["😊","😂","🥰","👍","🙏","❤️","🎉","🔥","😎","🤔","🥳","😢","😍","🤣","🥺","😁","👏","😱","🤩","😇","🤗","🙄","🤯","💪","🤮","🤡","👑","🧠"][i % 28]);
                            setShowEmojiPicker(false);
                          }}
                        >
                          {["😊","😂","🥰","👍","🙏","❤️","🎉","🔥","😎","🤔","🥳","😢","😍","🤣","🥺","😁","👏","😱","🤩","😇","🤗","🙄","🤯","💪","🤮","🤡","👑","🧠"][i % 28]}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Attachment options */}
              <AnimatePresence>
                {attachmentOptions && (
                  <motion.div 
                    className="absolute bottom-full mb-2 left-10 bg-background border rounded-lg shadow-lg p-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <div className="flex gap-2">
                      <GlowingElement intensity="light" className="rounded-full">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900"
                          onClick={() => setAttachmentOptions(false)}
                        >
                          <Image className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </Button>
                      </GlowingElement>
                      <GlowingElement intensity="light" className="rounded-full">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900"
                          onClick={() => setAttachmentOptions(false)}
                        >
                          <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </Button>
                      </GlowingElement>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="flex items-center bg-secondary/30 rounded-lg px-3 py-2">
                <Button 
                  type="button" 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8 rounded-full"
                  onClick={() => {
                    setShowEmojiPicker(!showEmojiPicker);
                    setAttachmentOptions(false);
                  }}
                >
                  <Smile className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                </Button>
                <Button 
                  type="button" 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8 rounded-full"
                  onClick={() => {
                    setAttachmentOptions(!attachmentOptions);
                    setShowEmojiPicker(false);
                  }}
                >
                  <Paperclip className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                </Button>
                <Input
                  type="text"
                  placeholder="Type a message"
                  className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
              </div>
            </div>
            <GlowingElement intensity="medium" className="rounded-full" isActive={message.trim() !== ""}>
              <Button 
                size="icon" 
                className={`rounded-full ${message.trim() === "" ? "bg-secondary hover:bg-secondary/80" : ""}`}
                onClick={handleSendMessage}
                disabled={message.trim() === ""}
              >
                <Send className="h-5 w-5" />
              </Button>
            </GlowingElement>
          </div>
        </div>
      </div>
    </div>
  );
}
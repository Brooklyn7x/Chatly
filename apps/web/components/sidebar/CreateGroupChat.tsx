// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { ArrowLeft, Search, Check, ArrowRight, Camera } from "lucide-react";

// export const CreateGroupChat = ({ onBack }: { onBack: () => void }) => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [groupName, setGroupName] = useState("");
//   const [step, setStep] = useState(1); // Step 1: Select Users, Step 2: Group Details
//   const [users, setUsers] = useState([
//     {
//       id: 1,
//       name: "Alice",
//       username: "alice123",
//       avatar: "https://example.com/avatar1.jpg",
//     },
//     {
//       id: 2,
//       name: "Bob",
//       username: "bob456",
//       avatar: "https://example.com/avatar2.jpg",
//     },
//     {
//       id: 3,
//       name: "Charlie",
//       username: "charlie789",
//       avatar: "https://example.com/avatar3.jpg",
//     },
//   ]);
//   const [groupImage, setGroupImage] = useState("");
//   const [allowMessages, setAllowMessages] = useState(true);
//   const [allowMedia, setAllowMedia] = useState(true);
//   const [allowMentions, setAllowMentions] = useState(true);

//   const handleSearch = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   const handleSelectUser = (user) => {
//     if (selectedUsers.some((u) => u.id === user.id)) {
//       // Deselect user if already selected
//       setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
//     } else {
//       // Select user
//       setSelectedUsers([...selectedUsers, user]);
//     }
//   };

//   const handleNextStep = () => {
//     if (selectedUsers.length > 0) {
//       setStep(2); // Move to Step 2: Group Details
//     }
//   };

//   const handleCreateGroupChat = () => {
//     if (groupName && selectedUsers.length > 0) {
//       // Add logic to create a group chat (e.g., API call)
//       console.log("Creating group chat:", {
//         groupName,
//         members: selectedUsers,
//       });
//       onBack(); // Close the view after creation
//     }
//   };

//   return (
//     <div className="h-full flex flex-col bg-gradient-to-b from-background/95 to-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//       {/* Back Button and Header */}
//       <div className="p-4 border-b flex items-center gap-4 bg-background/95 backdrop-blur">
//         <Button variant="ghost" size="icon" onClick={onBack}>
//           <ArrowLeft className="h-4 w-4" />
//         </Button>
//         <h2 className="text-xl font-semibold">
//           {step === 1 ? "Select Users" : "Group Details"}
//         </h2>
//       </div>

//       {/* Step 1: Search and Select Users */}
//       {step === 1 && (
//         <div className="flex-1 flex flex-col">
//           {/* Search Bar */}
//           <div className="p-4 border-b bg-background/95 backdrop-blur">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//               <Input
//                 value={searchQuery}
//                 onChange={handleSearch}
//                 placeholder="Search users..."
//                 className="pl-10"
//               />
//             </div>
//           </div>

//           {/* User List */}
//           <div className="flex-1 overflow-y-auto p-4 space-y-3">
//             {users
//               .filter((user) =>
//                 user.name.toLowerCase().includes(searchQuery.toLowerCase())
//               )
//               .map((user) => (
//                 <div
//                   key={user.id}
//                   className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${
//                     selectedUsers.some((u) => u.id === user.id)
//                       ? "bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 shadow-sm"
//                       : "bg-background hover:bg-secondary/10 border border-muted/20 hover:border-muted/30"
//                   }`}
//                   onClick={() => handleSelectUser(user)}
//                 >
//                   <Avatar className="h-12 w-12">
//                     <AvatarImage src={user.avatar} />
//                     <AvatarFallback>{user.name[0]}</AvatarFallback>
//                   </Avatar>
//                   <div className="flex-1">
//                     <h3 className="font-medium">{user.name}</h3>
//                     <p className="text-sm text-muted-foreground">
//                       {user.username}
//                     </p>
//                   </div>
//                   {selectedUsers.some((u) => u.id === user.id) && (
//                     <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white">
//                       <Check className="h-4 w-4" />
//                     </div>
//                   )}
//                 </div>
//               ))}
//           </div>

//           {/* Next Button */}
//           <div className="p-4 border-t bg-background/95 backdrop-blur">
//             <Button
//               onClick={handleNextStep}
//               className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all"
//               disabled={selectedUsers.length === 0}
//             >
//               Next
//             </Button>
//           </div>
//         </div>
//       )}

//       {/* Step 2: Group Details */}
//       {step === 2 && (
//         <div className="flex-1 flex flex-col">
//           {/* Group Image Upload */}
//           <div className="p-4 border-b bg-background/95 backdrop-blur">
//             <div className="flex flex-col items-center gap-4">
//               <label htmlFor="group-image" className="cursor-pointer">
//                 <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-all">
//                   <img
//                     src={groupImage || "https://via.placeholder.com/96"}
//                     alt="Group Image"
//                     className="w-full h-full object-cover"
//                   />
//                   <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
//                     <Camera className="h-6 w-6 text-white" />
//                   </div>
//                 </div>
//               </label>
//               <input
//                 id="group-image"
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 onChange={(e) => {
//                   const file = e.target.files?.[0];
//                   if (file) {
//                     const reader = new FileReader();
//                     reader.onload = () => {
//                       setGroupImage(reader.result as string);
//                     };
//                     reader.readAsDataURL(file);
//                   }
//                 }}
//               />
//               <p className="text-sm text-muted-foreground">
//                 Upload group image
//               </p>
//             </div>
//           </div>

//           {/* Group Name Input */}
//           <div className="p-4 border-b bg-background/95 backdrop-blur">
//             <Input
//               value={groupName}
//               onChange={(e) => setGroupName(e.target.value)}
//               placeholder="Enter group name"
//               className="w-full"
//             />
//           </div>

//           {/* Group Permissions */}
//           <div className="p-4 border-b bg-background/95 backdrop-blur">
//             <h3 className="text-lg font-semibold mb-4">Group Permissions</h3>
//             <div className="space-y-3">
//               <div className="flex items-center gap-3">
//                 <input
//                   type="checkbox"
//                   id="allow-messages"
//                   checked={allowMessages}
//                   onChange={(e) => setAllowMessages(e.target.checked)}
//                   className="h-5 w-5 rounded border-muted/20 focus:ring-primary"
//                 />
//                 <label htmlFor="allow-messages" className="text-sm">
//                   Allow all members to send messages
//                 </label>
//               </div>
//               <div className="flex items-center gap-3">
//                 <input
//                   type="checkbox"
//                   id="allow-media"
//                   checked={allowMedia}
//                   onChange={(e) => setAllowMedia(e.target.checked)}
//                   className="h-5 w-5 rounded border-muted/20 focus:ring-primary"
//                 />
//                 <label htmlFor="allow-media" className="text-sm">
//                   Allow all members to send media
//                 </label>
//               </div>
//               <div className="flex items-center gap-3">
//                 <input
//                   type="checkbox"
//                   id="allow-mentions"
//                   checked={allowMentions}
//                   onChange={(e) => setAllowMentions(e.target.checked)}
//                   className="h-5 w-5 rounded border-muted/20 focus:ring-primary"
//                 />
//                 <label htmlFor="allow-mentions" className="text-sm">
//                   Allow all members to mention others
//                 </label>
//               </div>
//             </div>
//           </div>

//           {/* Create Group Chat Button */}
//           <div className="p-4 border-t bg-background/95 backdrop-blur">
//             <Button
//               onClick={handleCreateGroupChat}
//               className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all"
//               disabled={!groupName || selectedUsers.length === 0}
//             >
//               Create Group Chat
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

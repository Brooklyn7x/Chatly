// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { ArrowLeft, Search, Check } from "lucide-react";

// export const CreateDirectChat = ({ onBack }: { onBack: () => void }) => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedUser, setSelectedUser] = useState(null);
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

//   const handleSearch = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   const handleSelectUser = (user) => {
//     setSelectedUser(user);
//   };

//   const handleCreateDirectChat = () => {
//     if (selectedUser) {
//       // Add logic to create a direct chat with the selected user (e.g., API call)
//       console.log("Creating direct chat with:", selectedUser);
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
//         <h2 className="text-xl font-semibold">Create Direct Chat</h2>
//       </div>

//       {/* Search Bar */}
//       <div className="p-4 border-b bg-background/95 backdrop-blur">
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//           <Input
//             value={searchQuery}
//             onChange={handleSearch}
//             placeholder="Search users..."
//             className="pl-10"
//           />
//         </div>
//       </div>

//       {/* User List */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-3">
//         {users
//           .filter((user) =>
//             user.name.toLowerCase().includes(searchQuery.toLowerCase())
//           )
//           .map((user) => (
//             <div
//               key={user.id}
//               className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${
//                 selectedUser?.id === user.id
//                   ? "bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 shadow-sm"
//                   : "bg-background hover:bg-secondary/10 border border-muted/20 hover:border-muted/30"
//               }`}
//               onClick={() => handleSelectUser(user)}
//             >
//               <Avatar className="h-12 w-12">
//                 <AvatarImage src={user.avatar} />
//                 <AvatarFallback>{user.name[0]}</AvatarFallback>
//               </Avatar>
//               <div className="flex-1">
//                 <h3 className="font-medium">{user.name}</h3>
//                 <p className="text-sm text-muted-foreground">{user.username}</p>
//               </div>
//               {selectedUser?.id === user.id && (
//                 <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
//                   <Check className="h-4 w-4 text-white" />
//                 </div>
//               )}
//             </div>
//           ))}
//       </div>

//       {/* Create Chat Button */}
//       <div className="p-4 border-t bg-background/95 backdrop-blur">
//         <Button
//           onClick={handleCreateDirectChat}
//           className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all"
//           disabled={!selectedUser}
//         >
//           Create Direct Chat
//         </Button>
//       </div>
//     </div>
//   );
// };

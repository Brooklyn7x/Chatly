// import Room, { IRoom } from "../models/room";

// export const createRoom = async (
//   name: string,
//   type: "private" | "group",
//   members: string[],
//   createdBy: string
// ): Promise<IRoom> => {
//   if (type === "private" && members.length !== 2) {
//     throw new Error("Private rooms must be exactly 2 members");
//   }

//   const room = new Room({
//     name,
//     type,
//     members,
//     createdBy,
//   });

//   return await room.save();
// };

// export const getUserRooms = async (userId: string): Promise<IRoom[]> => {
//   return await Room.find({ members: userId }).populate(
//     "members",
//     "username email"
//   );
// };

// export const deleteRoom = async (
//   roomId: string,
//   userId: string
// ): Promise<void> => {
//   const room = await Room.findById(roomId);
//   if (!room) {
//     throw new Error("Room not found");
//   }

//   if (room.createdBy.toString() !== userId) {
//     throw new Error("Only the creator can delete the room");
//   }

//   await Room.findByIdAndDelete(roomId);
// };

// export const getPaginatedRoom = async (
//   userId: string,
//   page: number,
//   limit: number
// ): Promise<IRoom[]> => {
//   return await Room.find({ members: userId })
//     .sort({ createdAt: -1 })
//     .skip((page - 1) * limit)
//     .limit(limit)
//     .populate("members", "username", "email");
// };

// export const updateRoomMetadata = async (
//   roomId: string,
//   userId: string,
//   updates: Partial<IRoom>
// ) => {
//   const room = await Room.findById(roomId);
//   if (!room) {
//     throw new Error("Room not found");
//   }
//   //admins
//   if (room.createdBy.toString() !== userId) {
//     throw new Error("You dont have permission to update this room");
//   }

//   Object.assign(room, updates);
//   return await room.save();
// };

// export const searchRooms = async (
//   userId: string,
//   query: string,
//   type?: "private" | "group"
// ): Promise<IRoom[]> => {
//   const filter: any = {
//     members: userId,
//     name: { $regex: query, $options: "i" },
//   };

//   if (type) {
//     filter.type = type;
//   }
//   return await Room.find(filter).populate("members", "username email");
// };

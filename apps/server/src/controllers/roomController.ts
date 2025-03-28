// import { NextFunction, Request, Response } from "express";
// import * as roomService from "../services/roomService";

// export const createRoom = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const { name, type, members } = req.body;
//     const createdBy = "67b62922491db6e9690d77a3";

//     const room = await roomService.createRoom(name, type, members, createdBy);
//     res.status(200).json({
//       success: true,
//       data: room,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const getUserRooms = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const { userId } = req.params;
//     const rooms = await roomService.getUserRooms(userId);

//     res.status(200).json({
//       success: true,
//       data: rooms,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const searchRooms = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const { query, type } = req.query;
//     const { userId } = req.body;
//     // change to jwt const userId = req.user.id
//     console.log(query, userId);
//     const rooms = await roomService.searchRooms(
//       userId,
//       query as string,
//       type as "private" | "group"
//     );

//     res.status(200).json({ success: true, data: rooms });
//   } catch (error) {
//     next(error);
//   }
// };

// export const updateRoomMetadata = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const { roomId } = req.params;
//     const { updates, userId } = req.body;
//     const room = await roomService.updateRoomMetadata(roomId, userId, updates);
//     res.status(200).json({ success: true, data: room });
//   } catch (error) {
//     next(error);
//   }
// };

// export const deleteRoom = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const { roomId } = req.params;
//     const { userId } = req.body;
//     console.log(roomId, userId);
//     await roomService.deleteRoom(roomId, userId);
//     res
//       .status(200)
//       .json({ success: true, message: "Room deleted successfully" });
//   } catch (error) {
//     next(error);
//   }
// };

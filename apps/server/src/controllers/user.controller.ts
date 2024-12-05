// import { UserService } from "../services/userService";
// import { Response } from "express";

// export class UserController {
//   private userService: UserService;

//   constructor() {
//     this.userService = new UserService();
//   }

//   getProfile = async (req: Request, res: Response) => {
//     try {
//       const user = await this.userService.getUserById(req.user._id);
//       res.status(200).json({
//         success: true,
//         data: user,
//       });
//     } catch (error) {
//       return res.status(401).json({ message: (error as Error).message });
//     }
//   };
//   updateProfile = async (req: Request, res: Response) => {
//     try {
//       const updatedUser = await this.userService.updateUser(
//         req.user._id,
//         req.body
//       );

//       res.status(200).json({
//         success: true,
//         data: updatedUser,
//       });
//     } catch (error) {
//       return res.status(401).json({ message: (error as Error).message });
//     }
//   };
//   searchUsers = async (req: Request, res: Response) => {
//     try {
//       const result = await this.userService.searchUser({
//         search: req.query.search as string,
//         page: Number(req.query.page),
//         limit: Number(req.query.limit),
//       });

//       res.status(200).json({
//         success: true,
//         data: result,
//       });
//     } catch (error) {
//       return res.status(401).json({ message: (error as Error).message });
//     }
//   };
//   deleteAccount = async (req: Request, res: Response) => {
//     try {
//       await this.userService.deleteUser(req.user._id);

//       res.status(200).json({
//         success: true,
//         message: "Account deleted successfully",
//       });
//     } catch (error) {
//       return res.status(401).json({ message: (error as Error).message });
//     }
//   };
// }

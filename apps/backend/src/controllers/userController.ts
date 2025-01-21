import { Request, Response } from "express";
import { BaseController } from "./baseController";
import { UserService } from "../services/userService";

export class UserController extends BaseController {
  private userService: UserService;

  constructor() {
    super("UserController");
    this.userService = new UserService();
  }

  public getUserProfile = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const userId = req.params.userId || req.user!._id;

    await this.handleRequest(req, res, async () => {
      const result = await this.userService.getUserById(userId);

      if (result.success) {
        res.json(result.data);
      } else {
        this.sendError(res, 404, result.error!);
      }
    });
  };

  // public updateProfile = async (req: Request, res: Response): Promise<void> => {
  //   const userId = req.params!.id;
  //   const updateData: UpdateUserDTO = req.body;

  //   await this.handleRequest(req, res, async () => {
  //     const result = await this.userService.updateUser(userId, updateData);

  //     if (result.success) {
  //       res.json(result.data);
  //     } else {
  //       this.sendError(res, 400, result.error);
  //     }
  //   });
  // };

  // public updateStatus = async (req: Request, res: Response): Promise<void> => {
  //   const userId = req.params.userId;
  //   const { status } = req.body;

  //   await this.handleRequest(req, res, async () => {
  //     const result = await this.userService.updateUserStatus(userId, status);

  //     if (result.success) {
  //       res.json(result.data);
  //     } else {
  //       this.sendError(res, 400, result.error!);
  //     }
  //   });
  // };

  public searchUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const currentUserId = req.user!._id;
      const { query = "", limit, offset } = req.query;
      const result = await this.userService.searchUsers(
        query as string,
        currentUserId,
        {
          limit: limit ? parseInt(limit as string) : undefined,
          offset: offset ? parseInt(offset as string) : undefined,
        }
      );

      if (!result.success) {
        res.status(400).json(result);
        return;
      }
      res.json(result);
    } catch (error) {
      this.logger.error(error as any);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  };
}

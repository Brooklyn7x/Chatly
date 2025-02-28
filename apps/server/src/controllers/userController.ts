import { Request, Response } from "express";
import { BaseController } from "./baseController";
import { UserService } from "../services/userService";
import { UserStatus } from "../types/user";
import { UpdateUser } from "../validators/user";

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
    const userId = req.params.id;

    await this.handleRequest(req, res, async () => {
      const result = await this.userService.getUserById(userId);

      if (result.success) {
        res.json(result.data);
      } else {
        this.sendError(res, 404, result.error!);
      }
    });
  };

  public updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user._id;
      console.log(req.body)
      const validationResult = UpdateUser.safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          error: validationResult.error.errors[0].message,
        });
        return;
      }
      const updateData = validationResult.data;

      await this.handleRequest(req, res, async () => {
        const result = await this.userService.updateUser(userId, updateData);

        if (!result.success) {
          this.sendError(res, 400, result.error!);
          return;
        }

        res.status(200).json({
          success: true,
          data: result.data,
        });
      });
    } catch (error) {
      this.logger.error("Error updating user data :", error);
      res.status(500).json({
        success: false,
        error: "Internal server error during conversation update",
      });
    }
  };

  public updateStatus = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!._id;
    const { status } = req.body;

    if (!Object.values(UserStatus).includes(status)) {
      this.sendError(res, 400, "Invalid status value");
      return;
    }

    await this.handleRequest(req, res, async () => {
      const result = await this.userService.updateUserStatus(userId, status);

      if (!result.success) {
        this.sendError(res, 400, result.error!);
        return;
      }

      res.json({
        success: true,
        data: result.data,
      });
    });
  };

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

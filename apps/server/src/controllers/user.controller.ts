import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { BaseController } from "./base.controller";
import { UpdateUserDTO } from "../types/user.types";

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
    const userId = req.params.userId || req.user!.id;

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
    const { query } = req.query;

    await this.handleRequest(req, res, async () => {
      const result = await this.userService.searchUsers(query as any);
      res.json(result.data);
    });
  };
}

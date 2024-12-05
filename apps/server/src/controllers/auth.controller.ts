import { AuthService } from "../services/authService";
import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../utils/apiResponse";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.authService.register(req.body);
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.authService.login(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req.body;
    await this.authService.logout(user._id);

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  };

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;
    const result = await this.authService.refreshToken(refreshToken);

    res.status(200).json({
      success: true,
      data: result,
    });
  };

  async verifyToken(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res
          .status(401)
          .json({ message: "Authorization token required" });
      }

      const user = await this.authService.verifyToken(token);

      return ApiResponse.success(res, {
        message: "Token is valid",
        data: user,
      });
    } catch (error) {
      return res.status(401).json({ message: (error as Error).message });
    }
  }
}

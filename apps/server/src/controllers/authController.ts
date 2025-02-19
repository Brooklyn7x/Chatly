import { Request, Response } from "express";
import { BaseController } from "./baseController";
import { AuthService } from "../services/authService";
import { LoginDTO } from "../types/auth.types";
import { loginSchema, registerSchema } from "../validators/auth";

export class AuthController extends BaseController {
  private authService: AuthService;

  constructor() {
    super("AuthController");
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const parseResult = registerSchema.safeParse(req.body);
      if (!parseResult.success) {
        res.status(400).json({
          success: false,
          error: "Validation failed",
          details: parseResult.error.format(),
        });
        return;
      }

      const result = await this.authService.register(parseResult.data);
      if (!result.success) {
        res.status(400).json({ success: false, error: result.error });
        return;
      }

      if (result.success) {
        res.cookie("refreshToken", result.data.refreshToken, {
          httpOnly: true,
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
          success: true,
          accessToken: result.data!.accessToken,
        });
      } else {
        res.status(400).json({ error: result.error });
      }
    } catch (error) {
      this.logger.error("Registration error:", error);
      res
        .status(500)
        .json({
          success: false,
          error: "Internal server error failed to register user",
        });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const loginData: LoginDTO = req.body;

      const validateResult = loginSchema.safeParse(loginData);
      if (!validateResult.success) {
        res.status(400).json({
          success: false,
          error: "Validation failed",
          details: validateResult.error.format(),
        });
        return;
      }

      const result = await this.authService.login(loginData);
      if (result.success) {
        res.cookie("refreshToken", result.data!.refreshToken, {
          httpOnly: true,
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
          success: true,
          accessToken: result.data!.accessToken,
          user: result.data!.user,
        });
      } else {
        res.status(400).json({ error: result.error });
      }
    } catch (error) {
      this.logger.error("Login error:", error);
      res.status(500).json({ success: false, error: "Login failed" });
    }
  };

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        res.status(401).json({ error: "Refresh token required" });
      }

      const result = await this.authService.refreshToken(refreshToken);

      if (result.success) {
        res.cookie("refreshToken", result.data!.refreshToken, {
          httpOnly: true,
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({ accessToken: result.data!.accessToken });
      } else {
        res.status(401).json({ error: result.error });
      }
    } catch (error) {
      this.logger.error("Token refresh error:", error);
      res.status(500).json({ error: "Token refresh failed" });
    }
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      const refreshToken = req.cookies.refreshToken;
      const userId = req.user!._id;
      await this.authService.logout(userId, refreshToken);
      res.clearCookie("refreshToken");
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      this.logger.error("Logout error:", error);
      res.status(500).json({ error: "Logout failed" });
    }
  };

  verify = async (req: Request, res: Response): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        res.status(401).json({
          success: false,
          error: "Token not provided",
        });
        return;
      }

      const result = await this.authService.verify(token);
      if (!result.success) {
        res.status(401).json({
          success: false,
          error: result.error,
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: result.data,
      });
    } catch (error) {
      this.logger.error("Verifying  error:", error);
      res.status(500).json({
        success: false,
        error: "Token not found",
      });
    }
  };
}

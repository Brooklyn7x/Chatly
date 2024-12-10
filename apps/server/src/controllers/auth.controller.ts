import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import { LoginDTO } from "../types/auth.types";
import { z } from "zod";

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export class AuthController extends BaseController {
  private authService: AuthService;
  private userService: UserService;

  constructor() {
    super("AuthController");
    this.authService = new AuthService();
    this.userService = new UserService();
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      this.logger.info('Registration request received:', { body: req.body });
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
          accessToken: result.data!.accessToken,
          user: result.data!.user,
        });
      } else {
        res.status(400).json({ error: result.error });
      }
    } catch (error) {
      this.logger.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const loginData: LoginDTO = req.body;

      //validate Request
      // const validateResult = validateLoginData(loginData)
      // if(!validateResult.success){
      //     res.status(400).json({
      //         error: validateResult.error
      //     })
      // }

      const result = await this.authService.login(loginData);
      if (result.success) {
        res.cookie("refreshToken", result.data!.refreshToken, {
          httpOnly: true,
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
          accessToken: result.data!.accessToken,
          user: result.data!.user,
        });
      } else {
        res.status(400).json({ error: result.error });
      }
    } catch (error) {}
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
      const userId = req.user!.id;

      await this.authService.logout(userId, refreshToken);
      res.clearCookie("refreshToken");
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      this.logger.error("Logout error:", error);
      res.status(500).json({ error: "Logout failed" });
    }
  };
}

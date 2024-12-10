import { Request, Response } from "express";
import Logger from "../utils/logger";

export abstract class BaseController {
  protected logger: Logger;

  constructor(name: string) {
    this.logger = new Logger(name);
  }

  protected async handleRequest<T>(
    req: Request,
    res: Response,
    handler: () => Promise<T>
  ): Promise<void> {
    try {
      const result = await handler();
      res.json(result);
    } catch (error) {
      this.logger.error("Request handling error:", error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  }

  protected sendError(res: Response, status: number, message: string): void {
    res.status(status).json({ error: message });
  }
}

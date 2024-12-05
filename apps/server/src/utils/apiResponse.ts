// utils/apiResponse.ts
import { Response } from "express";

interface ApiResponseOptions {
  statusCode?: number;
  message?: string;
  data?: any;
  meta?: any;
}

export class ApiResponse {
  static success(res: Response, options: ApiResponseOptions) {
    const { statusCode = 200, message, data, meta } = options;

    return res.status(statusCode).json({
      success: true,
      message,
      data,
      meta,
    });
  }

  static error(res: Response, options: ApiResponseOptions) {
    const {
      statusCode = 500,
      message = "Internal Server Error",
      data,
    } = options;

    return res.status(statusCode).json({
      success: false,
      message,
      data,
    });
  }
}

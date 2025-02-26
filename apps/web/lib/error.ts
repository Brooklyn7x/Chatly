import axios from "axios";

export class AppError extends Error {
  constructor(message: string, code: string, status: number) {
    super(message);
    this.name = "AppError";
  }
}

export const handleApiError = (error: unknown) => {
  if (error instanceof AppError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    return new AppError(
      error.response?.data?.error || "An error occurred",
      error.response?.data?.code || "UNKNOWN_ERROR",
      error.response?.status || 500
    );
  }

  return new AppError("An unexpected error occurred", "UNKNOWN_ERROR", 500);
};

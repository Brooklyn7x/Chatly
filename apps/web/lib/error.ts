import axios from "axios";
import { toast } from "sonner";
import * as Sentry from "@sentry/nextjs";

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
      error.response?.data?.message || "An error occurred",
      error.response?.data?.code || "UNKNOWN_ERROR",
      error.response?.status || 500
    );
  }

  return new AppError("An unexpected error occurred", "UNKNOWN_ERROR", 500);
};

export const handleError = (
  error: unknown,
  fallbackMessage = "Something went wrong"
) => {
  // Normalise any error shape into AppError
  const appError = handleApiError(error);

  // Prefer the message from AppError, otherwise the provided fallback
  const message = appError.message || fallbackMessage;

  // 1️⃣  Show a non-blocking toast to the user
  toast.error(message);

  // 2️⃣  Send the raw error to Sentry for observability
  // Avoid double-logging if Sentry is not initialised in development
  try {
    Sentry.captureException(error);
  } catch (_) {
    /* no-op */
  }

  // 3️⃣  Return the normalised error so callers can still branch on it
  return appError;
};

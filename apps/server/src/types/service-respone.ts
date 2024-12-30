export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ServiceError {
  code: number;
  message: string;
  details?: Record<string, any>;
  stack?: string;
}

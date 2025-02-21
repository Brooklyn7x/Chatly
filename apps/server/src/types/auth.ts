export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  username: string;
  name: string;
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface TokenPayload {
  userId: string;
  type: "access" | "refresh";
}

export interface AuthSession {
  userId: string;
  deviceId: string;
  lastActive: Date;
  ipAddress: string;
  userAgent: string;
}

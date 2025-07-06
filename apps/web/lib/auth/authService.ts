import { LoginCredentials, RegisterCredentials, AuthResult } from "./types";
import { loginUser, register, logoutUser } from "@/services/authService";
import { me } from "@/services/userService";

/**
 * Core authentication service - handles all auth-related API calls
 * Separated from state management for better testability
 */
export class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      const response = await loginUser(credentials);

      if (response.success && response.data) {
        return {
          success: true,
          user: response.data,
        };
      }

      return {
        success: false,
        error: "Invalid credentials",
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  }

  async register(credentials: RegisterCredentials): Promise<AuthResult> {
    try {
      const response = await register(credentials);

      if (response.success && response.data) {
        return {
          success: true,
          user: response.data,
        };
      }

      return {
        success: false,
        error: response.message || "Registration failed",
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      };
    }
  }

  async logout(): Promise<void> {
    await logoutUser();
  }

  async getCurrentUser(): Promise<AuthResult> {
    try {
      const response = await me();

      if (response.data?.user) {
        return {
          success: true,
          user: response.data.user,
        };
      }

      return {
        success: false,
        error: "User not found",
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Authentication failed",
      };
    }
  }
}

// Singleton instance
export const authService = new AuthService();

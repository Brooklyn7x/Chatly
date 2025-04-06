import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  verifyToken,
} from "../utils/helper";

import { AppError } from "../utils/error";

const sanitizeUser = (user: any) => {
  const { password, __v, contacts, createdAt, updatedAt, ...rest } =
    user.toObject();
  return rest;
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await hashPassword(password);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    const userResponse = sanitizeUser(user);

    res.status(201).json({
      success: true,
      data: userResponse,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user: any = await User.findOne({ email });

    if (!user || !(await comparePassword(password, user.password))) {
      throw new AppError(401, "Invalid credentials");
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    const refreshTokenExpirySeconds = 7 * 24 * 60 * 60;

    const isProduction = (process.env.NODE_ENV as string) === "production";

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "strict",
      maxAge: 60 * 60 * 1000,
      path: "/",
      domain: ".chatlyz.xyz",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "strict",
      maxAge: refreshTokenExpirySeconds * 1000,
      domain: ".chatlyz.xyz",
      path: "/",
    });

    const userResponse = sanitizeUser(user);
    res.status(200).json({ success: true, data: userResponse });
  } catch (error) {
    next(error);
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json({ success: true });
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    const decoded: any = verifyToken(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    );

    const newAccessToken = generateAccessToken(decoded.id);
    const isProduction = (process.env.NODE_ENV as string) === "production";

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
      domain: ".chatlyz.xyz",
      path: "/",
    });

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

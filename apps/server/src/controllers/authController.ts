import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  getCookieDomain,
  hashPassword,
  verifyToken,
} from "../utils/helper";

import { AppError } from "../utils/error";

const sanitizeUser = (user: any) => {
  const { password, __v, contacts, createdAt, updatedAt, ...rest } =
    user.toObject();
  return rest;
};

const domain = [];

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
    const cookieDomain = getCookieDomain(req.hostname);

    res.cookie("accessToken", accessToken, {
      httpOnly: isProduction,
      secure: isProduction,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
      domain: cookieDomain,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: isProduction,
      secure: isProduction,
      sameSite: "strict",
      maxAge: refreshTokenExpirySeconds * 1000,
      domain: cookieDomain,
      path: "/",
    });

    const userResponse = sanitizeUser(user);
    res.status(200).json({ success: true, data: userResponse });
  } catch (error) {
    next(error);
  }
};

export const logout = (req: Request, res: Response) => {
  const isProduction = (process.env.NODE_ENV as string) === "production";
  const cookieDomain = getCookieDomain(req.hostname);

  res.clearCookie("accessToken", {
    httpOnly: isProduction,
    secure: isProduction,
    sameSite: "strict",
    path: "/",
    domain: cookieDomain,
  });
  res.clearCookie("refreshToken", {
    httpOnly: isProduction,
    secure: isProduction,
    sameSite: "strict",
    path: "/",
    domain: cookieDomain,
  });

  res.status(200).json({ success: true, message: "Logout Successfully" });
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
    const cookieDomain = getCookieDomain(req.hostname);

    res.cookie("accessToken", newAccessToken, {
      httpOnly: isProduction,
      secure: isProduction,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
      domain: cookieDomain,
      path: "/",
    });

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

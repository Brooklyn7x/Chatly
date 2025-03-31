import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  verifyToken,
} from "../utils/helper";

import redisClient from "../config/redis";

const sanitizeUser = (user: any) => {
  const { password, __v, contacts, createdAt, updatedAt, ...rest } =
    user.toObject();
  return rest;
};

export const registerUser = async (
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

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user: any = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Invalid email. Try again" });
      return;
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid password. Try again" });
      return;
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await redisClient.set(
      user._id.toString(),
      refreshToken,
      "EX",
      7 * 24 * 60 * 60
    );

    const userResponse = sanitizeUser(user);
    res
      .status(200)
      .json({ success: true, accessToken, refreshToken, data: userResponse });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.body;

    const decoded: any = verifyToken(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    );

    const storedToken = await redisClient.get(decoded.id);

    if (storedToken !== refreshToken) {
      res.status(401).json({ message: "Invalid refresh token" });
      return;
    }

    const newAccessToken = generateRefreshToken(decoded.id);

    res.status(200).json({ success: true, accessToken: newAccessToken });
  } catch (error) {
    next(error);
  }
};

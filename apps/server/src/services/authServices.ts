import redisClient from "../config/redis";
import User from "../models/user";
import { IUser } from "../types/user";
import { sendVerificationEmail } from "../utils/email";
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  generateVerificationToken,
  hashPassword,
  verifyToken,
} from "../utils/helper";

export const registerUser = async (
  username: string,
  email: string,
  password: string
): Promise<any> => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email is already registered");
  }

  const hashedPassword = await hashPassword(password);
  const verificationToken = generateVerificationToken();
  const user = new User({
    username,
    email,
    password: hashedPassword,
  });

  await user.save();
  await sendVerificationEmail(email, verificationToken);

  return user;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  const user: any = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await redisClient.set(
    user._id.toString(),
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  );

  return { accessToken, refreshToken };
};

export const refreshToken = async (refreshToken: string): Promise<string> => {
  try {
    const decoded: any = verifyToken(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    );
    const storedToken = await redisClient.get(decoded.id);

    if (storedToken !== refreshToken) {
      throw new Error("Invalid refresh token");
    }

    return generateRefreshToken(decoded.id);
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};

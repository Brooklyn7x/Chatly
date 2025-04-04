import { NextFunction, Request, Response } from "express";
import User from "../models/user";

const sanitizeUser = (user: any) => {
  const { password, __v, contacts, createdAt, updatedAt, ...rest } =
    user.toObject();
  return rest;
};

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ data: user });
  } catch (error) {
    next(Error);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const { username, email } = req.body;

    if (username || email) {
      const existingUser = await User.findOne({
        $or: [{ username: username }, { email: email }],
        _id: { $ne: userId },
      });

      if (existingUser) {
        if (existingUser.username === username) {
          res.status(400).json({ message: "Username is already taken" });
          return;
        }
        if (existingUser.email === email) {
          res.status(400).json({ message: "Username is already taken" });
          return;
        }
      }

      const updateUser = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            ...(username && { username }),
            ...(email && { email }),
          },
        },
        { new: true }
      ).select("-password");

      if (!updateUser) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.status(200).json({
        success: true,
        data: updateUser,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getContacts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    const user = await User.findById(userId)
      .select("contacts")
      .populate("contacts", "username email profilePicture");

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user.contacts,
    });
  } catch (error) {
    next(error);
  }
};

export const addContact = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const { id } = req.body;

    const contactUser = await User.findById(id);
    if (!contactUser) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const existingContact = user.contacts?.find(
      (contact) => contact.toString() === id
    );

    if (existingContact) {
      res.status(400).json({ message: "Contact already exists" });
      return;
    }
    const newContact = id;
    user.contacts.push(newContact);
    await user.save();

    res.status(201).json({
      message: "Contact added successfully",
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

export const searchUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { search } = req.query;
    const currentUserId = req.user?.id;

    if (!search || typeof search !== "string") {
      res.status(400).json({ message: "Please provide a search query" });
      return;
    }

    const users = await User.find({
      $and: [
        {
          $or: [
            { email: { $regex: search, $options: "i" } },
            { username: { $regex: search, $options: "i" } },
          ],
        },
        { _id: { $ne: currentUserId } },
      ],
    }).select("id username email profilePicture");

    if (!users.length) {
      res.status(404).json({ message: "No users found" });
      return;
    }

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const userResponse = sanitizeUser(user);
    res.status(200).json({ user: userResponse });
  } catch (error) {
    next(error);
  }
};

import { RequestHandler } from "express";
import UserModel from "../models/user";

export const updateUserController: RequestHandler = async (req, res) => {
  const { id: userId } = req.body;

  try {
    const response = await UserModel.findByIdAndUpdate(
      userId,
      req.body,
      {
        new: true,
      }
    );
    if (!response?.toJSON()) {
      res.status(404).send("User not found.");
      return;
    }

    res.json(response.toJSON());
  } catch (error) {
    res.status(400).json({ message: error?.message });
  }
};

export const getUserController: RequestHandler = async (req, res) => {
  const { id: userId } = req.params;

  try {
    const response = await UserModel.findById(userId);
    if (!response?.toJSON()) {
      res.status(404).send("User not found.");
      return;
    }

    res.json(response.toJSON());
  } catch (error) {
    res.status(400).json({ message: error?.message });
  }
};

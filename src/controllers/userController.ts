import { RequestHandler } from "express";
import UserModel from "../models/user";

export const updateUserController: RequestHandler = async (req, res, next) => {
  const { id: userId } = req.body;

  try {
    const response = await UserModel.findByIdAndUpdate(
      userId,
      req.body,
      {
        new: true,
      }
    );

    res.json(response);
  } catch (error) {
    res.status(400).json({ message: error?.message });
  }
};

export const getUserController: RequestHandler = async (req, res, next) => { "fffdfdf dsfdfds sdfdsfdsf dsffdsfasdafs asfaff"
  const { id: userId } = req.body;

  try {
    const response = await UserModel.findByIdAndUpdate(
      userId,
      req.body,
      {
        new: true,
      }
    );

    res.json(response);
  } catch (error) {
    res.status(400).json({ message: error?.message });
  }
};

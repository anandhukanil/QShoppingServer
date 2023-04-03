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

export const addToCartController: RequestHandler = async (req, res) => {
  const { id: userId, item } = req.body;

  try {
    const response = await UserModel.findByIdAndUpdate(
      userId,
      { $push: { cartItems: item } },
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

export const removeFromCartController: RequestHandler = async (req, res) => {
  const { id: userId, itemId } = req.body;

  try {
    const response = await UserModel.findByIdAndUpdate(
      userId,
      { $pull: { cartItems: {  item : { $elemMatch: { id: itemId  }}} } },
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

export const checkoutOrderController: RequestHandler = async (req, res) => {
  const { id: userId, items } = req.body;

  try {
    const response = await UserModel.findByIdAndUpdate(
      userId,
      { $push: { orders: { items, ordered: new Date().toISOString() } },
        $set: { cartItems: [] }
      },
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

export const updateCartItemCountController: RequestHandler = async (req, res) => {
  const { id: userId, itemId, count } = req.body;

  try {
    const data = await UserModel.findById(userId);
    if(!data?.toJSON()) {
      res.status(404).send("User not found.");
      return;
    }
    const updatedCart = data?.toJSON().cartItems?.map((cart) => (
      cart.item.id === itemId ? { ...cart, count: cart.count + count } : cart
    ));
    const response = await UserModel.findByIdAndUpdate(
      userId,
      { cartItems: updatedCart },
      { new: true },
    );

    res.json(response?.toJSON());
  } catch (error) {
    res.status(400).json({ message: error?.message });
  }
};

export const wishListItemController: RequestHandler = async (req, res) => {
  const { id: userId, item, action } = req.body;

  try {
    const data = await UserModel.findById(userId);
    if(!data?.toJSON()) {
      res.status(404).send("User not found.");
      return;
    }
    let response;
    if (action === "remove") {
      response = await UserModel.findByIdAndUpdate(
        userId,
        { $pullAll: {
          wishlistItems: [item],
        } },
        { new: true },
      );
    } else {
      response = await UserModel.findByIdAndUpdate(
        userId,
        { $push: { wishlistItems: item } },
        { new: true },
      );
    }

    res.json(response?.toJSON());
  } catch (error) {
    res.status(400).json({ message: error?.message });
  }
};
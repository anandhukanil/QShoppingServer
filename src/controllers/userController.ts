import { RequestHandler } from "express";
import ProductModel from "../models/product";
import UserModel from "../models/user";
import { IProduct } from "../types";

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
  const { id: userId, product, count } = req.body;

  try {
    const response = await UserModel.findById(userId);
    if (!response?.toJSON()) {
      res.status(404).send("User not found.");
      return;
    }

    const currentCart = response.toJSON()?.cartItems;
    const cartItems = currentCart.some((_product) => _product.item?.id === product?.id)
      ? currentCart
        .map(
          (_product) => _product.item?.id === product?.id
            ? { ..._product, count: _product.count + (count || 1) }
            : _product
        )
      : [...currentCart, { item: product, count: (count || 1) }];

    const result = await UserModel.findByIdAndUpdate(userId, { $set: { cartItems }}, { new: true });

    res.json(result?.toJSON());
  } catch (error) {
    res.status(400).json({ message: error?.message });
  }
};

export const removeFromCartController: RequestHandler = async (req, res) => {
  const { id: userId, product, count } = req.body;

  try {
    const response = await UserModel.findById(userId);
    if (!response?.toJSON()) {
      res.status(404).send("User not found.");
      return;
    }

    const currentCart = response.toJSON()?.cartItems;
    const cartItems = currentCart.map(
      (_product) => _product.item?.id === product?.id
        ? { ..._product, count: _product.count - (count || 1) }
        : _product
    ).filter((_product) => _product.count > 0);

    const result = await UserModel.findByIdAndUpdate(userId, { $set: { cartItems }}, { new: true });

    res.json(result?.toJSON());
  } catch (error) {
    res.status(400).json({ message: error?.message });
  }
};

export const checkoutOrderController: RequestHandler = async (req, res) => {
  const { id: userId, items }: {id: string, items: {item: IProduct; count: number;}[]} = req.body;

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

    for (const order of items) {
      await ProductModel.findOneAndUpdate(
        { id: order.item?.id },
        { $inc: { stock: -order.count } }
      );
    }

    res.json(response.toJSON());
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
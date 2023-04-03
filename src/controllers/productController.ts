import { RequestHandler } from "express";
import ProductModel from "../models/product";

export const getAllProductsController: RequestHandler = async (req, res) => {
  const { limit } = req.query;
  
  try {
    const data = await ProductModel.find().limit((limit && Number(limit)) as number);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
};

export const getProductController: RequestHandler = async (req, res) => {
  const { id: productId } = req.params;
  
  try {
    const data = await ProductModel.findOne({ id: productId });

    if (!data?.toJSON()) {
      res.sendStatus(404);
      return;
    }

    res.json(data.toJSON());
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
};

export const searchProductsController: RequestHandler = async (req, res) => {
  const { query } = req.query;
  
  try {
    const data = await ProductModel.find({$text: {$search: query as string}});

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
};
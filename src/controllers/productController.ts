import { RequestHandler } from "express";
import axios from "axios";

export const getAllProductsController: RequestHandler = async (req, res) => {
  const { limit } = req.query;
  
  try {
    const data = await axios.get("https://dummyjson.com/products", {
      params: { limit }
    });

    res.json(data.data?.products);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
};

export const getProductController: RequestHandler = async (req, res) => {
  const { id: productId } = req.params;
  
  try {
    const data = await axios.get(`https://dummyjson.com/products/${productId}`);

    res.json(data.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
};

export const searchProductsController: RequestHandler = async (req, res) => {
  const { query } = req.query;
  
  try {
    const data = await axios.get(`https://dummyjson.com/products/search?q=${query}`);

    res.json(data.data?.products);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
};
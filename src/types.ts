import { Request } from "express";

export interface IRequest extends Request {
  user?: string
}

export interface IProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface IAddress {
  addressLine1: string;
  city: string;
  state: string;
  pinCode: number;
}

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber?: string;
  age?: number;
  address?: IAddress;
}

export interface IUserData extends IUser {
  hash: string;
  cartItems: {item: IProduct; count: number;}[];
  wishlistItems: IProduct[];
  orders: { items: {item: IProduct; count: number;}[], ordered: string }[];
}

export interface IRefreshToken {
  token: string;
  validity: string;
}

export enum Models {
  User = "User",
  Address = "Address",
  RefreshToken = "RefreshToken",
  Product = "Product"
}
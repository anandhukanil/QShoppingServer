import { Request } from "express";

export interface IRequest extends Request {
  user?: string
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
}

export interface IRefreshToken {
  token: string;
  validity: string;
}

export enum Models {
  User = "User",
  Address = "Address",
  RefreshToken = "RefreshToken"
}
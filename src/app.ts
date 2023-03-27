import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";


dotenv.config();

const port = process.env.PORT;
const connectionString = process.env.MONGO_CONNECTION_STRING || "";

// DB Setup
mongoose.connect(connectionString);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});

const app: Express = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());


app.get("/", (req: Request, res: Response) => {
  res.send("Welcome!");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
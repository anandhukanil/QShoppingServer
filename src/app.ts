import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import router from "./routes";

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


app.use(router);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
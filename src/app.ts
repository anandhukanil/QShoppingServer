import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import router from "./routes";

dotenv.config();

const port = process.env.PORT;
const origin = process.env.CLIENT_ORIGIN;
const connectionString = process.env.MONGO_CONNECTION_STRING || "";

// DB Setup
mongoose.connect(connectionString);
const database = mongoose.connection;

database.on("error", (error) => {
  console.error(error);
});

database.once("connected", () => {
  // eslint-disable-next-line no-console
  console.log("Database Connected");
});

const app: Express = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin }));
app.use(express.json());


app.use(router);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
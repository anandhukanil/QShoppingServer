"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const routes_1 = __importDefault(require("./routes"));
dotenv_1.default.config();
const port = process.env.PORT;
const origin = process.env.CLIENT_ORIGIN;
const connectionString = process.env.MONGO_CONNECTION_STRING || "";
// DB Setup
mongoose_1.default.connect(connectionString);
const database = mongoose_1.default.connection;
database.on("error", (error) => {
    console.error(error);
});
database.once("connected", () => {
    // eslint-disable-next-line no-console
    console.log("Database Connected");
});
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({ origin }));
app.use(express_1.default.json());
app.use(routes_1.default);
app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

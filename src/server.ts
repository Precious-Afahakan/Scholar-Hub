import express from "express";
import "dotenv/config";
import scholarRouter from "./Scholar/Router";
import connectDB from "./config/db";
import { ErrorHandler } from "./middleware/errorHandler";

const port = process.env.PORT;

const app = express();
app.use(express.json());
connectDB();

app.use("/api", scholarRouter);

app.use(ErrorHandler);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});

import express from "express";
import "dotenv/config";
import scholarRouter from "./Scholar/routers/scholar.router";
import resultRouter from "./Scholar/routers/result.router";
import connectDB from "./config/db";
import { ErrorHandler } from "./middleware/errorHandler";

const port = process.env.PORT;

const app = express();
app.use(express.json());
connectDB();

app.use("/api/scholars", scholarRouter);
app.use("/api/results", resultRouter);

app.use(ErrorHandler);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});

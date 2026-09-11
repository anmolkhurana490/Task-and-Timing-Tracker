import express from "express";
import apiRouter from "./modules/index.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import cors from "cors";

import dotenv from 'dotenv';
dotenv.config({ quiet: true });

const app = express();
app.use(express.json());

app.use(cors({
  origin: process.env["FRONTEND_URL"] ?? "*",
}));

app.get("/", (_req, res) => {
  res.status(200).json({ message: "Welcome to the Task and Time Tracking App API" });
});

app.use("/api/v1", apiRouter);

app.use(errorHandler);

/** Starts the HTTP server using the configured port. */
const port = Number(process.env["PORT"] ?? 5000);

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import router from "./src/routes/ticket.js";
import userRouter from "./src/routes/user.js";
import "dotenv/config";

const app = express();

app.use(cors());

app.use(express.json());

mongoose
  .connect(process.env.MONGO_CONNECTION)
  .then(() => console.log("Connected to DB"))
  .catch((err) => {
    console.log("error:", err);
  });

app.use(router);
app.use(userRouter);

app.use((req, res) => {
  return res.status(404).json({ message: "Internal server error" });
});

app.listen(process.env.PORT, () => {
  console.log(`App runs on port ${process.env.PORT}`);
});

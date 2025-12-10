import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import quizRouter from "./routes/quizRoutes.js";
import resultRouter from "./routes/resultRoutes.js";

//import resultRouter from './routes/resultRoutes.js';
//import auth from "../middleware/auth";

const app = express();
const port = 4000;

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//DB
connectDB();

//ROUTES
app.use("/api/auth", userRouter);
app.use("/api/results", resultRouter);
app.use("/api/quizes", quizRouter);
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(port, () => {
  console.log(`Server Started on http:localhost:${port}`);
});

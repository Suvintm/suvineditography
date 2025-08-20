import express from "express";
import cors from "cors";
import "dotenv/config";
import userRouter from "./routes/userRoute.js";
import connectDB from "./config/mongodb.js";
import imageRouter from "./routes/imageRoute.js";
import projectRouter from "./routes/projectRoute.js";


const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json());
await connectDB();

app.use("/api/user", userRouter);
app.use("/api/image", imageRouter);
app.use("/api/projects", projectRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

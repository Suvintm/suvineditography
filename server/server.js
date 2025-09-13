// server.js (or app.js) - add stock route
import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";

// your existing routers
import userRouter from "./routes/userRoute.js";
import imageRouter from "./routes/imageRoute.js";
import projectRouter from "./routes/projectRoute.js";
import stockRouter from "./routes/stockRoute.js";
//admin
import adminStockRouter from "./routes/adminStockRoute.js";
import adminRouter from "./routes/adminRoute.js";
 

const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

await connectDB();

app.use("/api/user", userRouter);
app.use("/api/image", imageRouter);
app.use("/api/projects", projectRouter);
app.use("/api/stocks", stockRouter);
//// Admin routes
app.use("/api/admin", adminRouter);

// Admin stock routes
app.use("/api/admin/stocks", adminStockRouter);

app.get("/", (req, res) => res.send("Hello from SuvinEditography backend"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

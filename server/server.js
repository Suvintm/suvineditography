import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import "dotenv/config";
import connectDB from "./config/mongodb.js";

// Routers
import userRouter from "./routes/userRoute.js";
import imageRouter from "./routes/imageRoute.js";
import projectRouter from "./routes/projectRoute.js";
import stockRouter from "./routes/stockRoute.js";
import paymentRouter from "./routes/paymentRoute.js";
import adminRouter from "./routes/adminRoute.js";
import adminPackRoutes from "./routes/adminPackRoutes.js";
import adminStockRouter from "./routes/adminStockRoute.js";
import notificationRouter from "./routes/notificationRoutes.js";

const PORT = process.env.PORT || 4000;
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

// Attach io to app for access in controllers
app.set("io", io);

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

await connectDB();

// Routes
app.use("/api/user", userRouter);
app.use("/api/image", imageRouter);
app.use("/api/projects", projectRouter);
app.use("/api/stocks", stockRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/admin", adminRouter);
app.use("/api/admin/packs", adminPackRoutes);
app.use("/api/admin/stocks", adminStockRouter);
app.use("/api/notifications", notificationRouter);

app.get("/", (req, res) => res.send("Hello from SuvinEditography backend"));

// WebSocket connections
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // When a user logs in, join their room (userId)
  socket.on("register", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

// limit: fix lỗi ảnh dung lượng lớn
app.use(express.json({ limit: "50mb" }));

// Có cái này mới đọc được jwt từ cookies (lần sau nếu sử dụng gì liên quan đến cookie thì use)
app.use(cookieParser());

// Cấu hình cors gồm: origin, credentials
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const PORT = process.env.PORT;
// Lấy đường dẫn tuyệt đối của thư mục hiện tại
const __dirname = path.resolve();

// AUTH
app.use("/api/auth", authRoutes);

// Message
app.use("/api/message", messageRoutes);

// Đã giải thích trong note.md
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});

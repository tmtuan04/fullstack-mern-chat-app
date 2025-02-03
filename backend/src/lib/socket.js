import { Server } from "socket.io";  // Thư viện để hỗ trợ WebSocket communication giữa client và server
import http from "http"; // Module của Node.js để tạo ra một HTTP server
import express from "express";

const app = express();

// Khởi tạo HTTP server từ app của express
const server = http.createServer(app);

// Tạo một instance của Socket.io, gắn vào HTTP server
// cors: cho phép kết nối đến địa chỉ frontend cụ thể
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

// Helper function: Lấy socketId từ userId và trả về tương ứng
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// Lưu trữ thạng thái online của user, Object -> Lưu trữ được nhiều nhé
/* Ví dụ:
{
  '6777e25e4b9efe2f1c03afa9': 'bvWkbzflUROMQHNGAAAB',   
  '678ccce95bac79599e7d5b6c': 'GgITE_Yds2DTM-88AAAD'    
}
*/
const userSocketMap = {}; // { userId: socketId }

// Sự kiên được kích hoạt mỗi khi client kết nối thành công đến server thông qua WebSocket
// connection là sự kiện built-in do Socket.IO cung cấp
io.on("connection", (socket) => {
  // Mỗi client sẽ có một socket riêng biệt, mỗi kết nối (socket) sẽ có một id duy nhất => giúp server phân biệt giữa các client với nhau
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all connected clients -> Trả về danh sách người dùng online (userId) đến tất cả các client
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Đây là sự kiện được kích hoạt khi client ngắt kết nối khỏi server (ví dụ: đóng trình duyệt, mất kết nối mạng, v.v.).
  socket.on("disconnect", () => {
    console.log("A user disconneced", socket.id);
    delete userSocketMap[userId];
    // Gửi tất cả keys tức userId qua sự kiện getOnlineUsers
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server, io };

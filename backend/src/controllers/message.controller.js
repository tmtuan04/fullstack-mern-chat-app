import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        // $ne (not equal) là toán tử khác trong moongodb
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        // Trả về tất cả thông tin (trừ password) của mọi người dùng (trừ mình)
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const getMessages = async (req, res) => {
    try {
        // destructuring { id: userToChat } lấy giá trị của tham số id từ URL và gán vào biến userToChat
        // Biến id này đại diện cho người mà ta muốn nhắn tin
        const { id: userToChat } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            // Lọc một trong 2 điều kiện
            $or: [
                { senderId: myId, receiverId: userToChat },
                { senderId: userToChat, receiverId: myId }
            ]
        });
        // Ví dụ trả về của messages
        // { "senderId": "1", "receiverId": "2", "text": "Hi!" },
        // { "senderId": "2", "receiverId": "1", "text": "Hello!" }
        res.status(200).json(messages);
    } catch (error) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const sendMessage = async (req, res) => {
    try {
        // Xác định id người nhận và người gửi
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        // Lấy tin nhắn + ảnh
        const { text, image } = req.body;

        let imageUrl;
        // Nếu có ảnh thì upload lên cloudinary và lấy ra imageUrl để lưu vào database
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        // Sử dụng shorthand
        // const person = { name, age }; 
        // Tương đương với:
        // const person = { name: name, age: age };

        const newMessage = new Message({
            senderId, // shorthand, tương đương: senderId: senderId
            receiverId,
            text,
            image: imageUrl
        });
        // Save to db
        await newMessage.save();
        
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
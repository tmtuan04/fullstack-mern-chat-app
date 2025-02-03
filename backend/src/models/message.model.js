import mongoose from "mongoose";

// ({}, {})
const messageSchema = new mongoose.Schema({

    // Tức là: Mỗi thuộc tính senderId, receiverId đều là độc nhất và giờ ta muốn tạo ra điều đó
    // Thì phải dùng ObjectId
    // _id thì nó vẫn mặc định được thêm

    // ref: "User" - So, this tells Mongoose that senderId refers to a document in the User collection

        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: "true",
        },
        text: {
            type: String,
        },
        image: {
            type: String,
        }
    },
    { timestamps: true }
)

const Message = mongoose.model("Message", messageSchema);

export default Message;
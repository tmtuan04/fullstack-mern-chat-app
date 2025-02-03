import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    // Date không thể có kiểu chuỗi rỗng, phải để thành String
    dateOfBirth: {
      type: String,
      default: "",
    },
  },
  // Khi bạn sử dụng tùy chọn { timestamps: true } trong schema, nó sẽ tự động thêm hai trường createdAt và updatedAt vào tài liệu của bạn
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;

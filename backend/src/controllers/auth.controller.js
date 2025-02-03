import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "Email already exists" });
    // bcrypt.genSalt(số vòng muối)
    const salt = await bcrypt.genSalt(10);
    // hashPass = bcrypt.hash(plainText, salt);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // Generate JWT Token
      generateToken(newUser._id, res);
      // Save to DB
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
        dateOfBirth: newUser.dateOfBirth,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      // Không trả về email sai, v.v là vì vấn đề bảo mật, đoạn này khá hay
      return res.status(400).json({ message: "Invalid Credentials" })
    }
    
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      password: user.password,
      profilePic: user.profilePic,
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
  // maxAge: 0 means the cookie will expire immediately upon being set.
  // When the browser sees a cookie with maxAge: 0, it deletes the cookie.
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logout Successfull" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {

   /* Luồng sự kiện:

    - Kiểm tra dữ liệu nhận được từ FE
    - Upload ảnh lên Cloudinary để lưu trữ
    - Update lại và lấy URL ảnh từ Cloudinary để trả về cho FE
   */

  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile image is required" });
    }

    // Theo template thôi
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    
    // new: If set to true, returns the modified document rather than the original. Defaults to false.
    // Tham số thứ 2 và thứ 3 là object: https://www.geeksforgeeks.org/mongoose-findbyidandupdate-function/ 
    const updateUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url  }, { new: true });

    res.status(200).json(updateUser);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' })
  }
};

export const updateInfo = async (req, res) => {
  const data = req.body;
  const id = req.user._id;
  try {
    const updateUser = await User.findByIdAndUpdate(id, data, { new: true });
    res.status(200).json(updateUser);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export const checkAuth = async (req, res) => {
  try {
    // Lưu all thông tin trừ password
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

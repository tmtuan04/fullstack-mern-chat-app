import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const protectedRoute = async (req, res, next) => {
    try {
        // Get token from request
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No Token Provided" });
        }

        // jwt.verify() -> return: payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });
        }

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(400).json({ message: "User not Found" });
        }
        // user ở đây là all thông tin trừ password
        req.user = user;
        
        // Khá hay giờ mới hiểu ý nghĩa
        next();
    } catch (error) {
        console.log("Error in protecedRoute middleware: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
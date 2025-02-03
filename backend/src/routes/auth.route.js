import express from "express"
import { checkAuth, login, logout, signup, updateInfo, updateProfile } from "../controllers/auth.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup)

router.post("/login", login)

router.post("/logout", logout)

// Update Date of Birth
router.put("/update-date", protectedRoute, updateInfo);

// Update Profile Image
// Test trên POSTMAN: Raw { profilePic: "base64link" }
router.put("/update-profile", protectedRoute, updateProfile)

// Return req.user (not include password)
router.get("/check", protectedRoute, checkAuth);


export default router;
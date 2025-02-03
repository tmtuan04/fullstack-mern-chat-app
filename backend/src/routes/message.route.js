import express from "express"
import { protectedRoute } from "../middlewares/auth.middleware.js";
import { getUsersForSidebar } from "../controllers/message.controller.js";
import { getMessages } from "../controllers/message.controller.js";
import { sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectedRoute, getUsersForSidebar);

router.get("/:id", protectedRoute, getMessages);

router.post("/send/:id", protectedRoute, sendMessage);

export default router;
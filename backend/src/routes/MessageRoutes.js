import { Router } from "express";
import {
	message,
	deleteMessage,
	getAChat,
	chatList,
} from "../controllers/MessageControllers.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.post("/", authenticateToken, message);
router.get("/chat", authenticateToken, getAChat);
router.get("/chatList", authenticateToken, chatList);
router.delete("/:id", authenticateToken, deleteMessage);

export default router;

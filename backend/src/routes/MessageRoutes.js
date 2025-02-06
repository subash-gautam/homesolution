import { Router } from "express";
import {
	message,
	deleteMessage,
	getAChat,
} from "../controllers/MessageControllers.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.post("/", authenticateToken, message);
router.get("/chat", authenticateToken, getAChat);
router.delete("/:id", authenticateToken, deleteMessage);

export default router;

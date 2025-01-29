import { Router } from "express";
import {
	deleteMessage,
	getAChat,
	pMessage,
	uMessage,
} from "../controllers/MessageControllers.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.post("/user", authenticateToken, uMessage);
router.post("/provider", authenticateToken, pMessage);
router.get("/chat", authenticateToken, getAChat);
router.delete("/:id", authenticateToken, deleteMessage);

export default router;

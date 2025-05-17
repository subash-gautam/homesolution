import { Router } from "express";
import {
	deleteNotification,
	getNotifications,
	markReadNotification,
	saveNotification,
} from "../controllers/NotificationController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.post("/", saveNotification);
router.get("/", authenticateToken, getNotifications);
router.put("/:id", authenticateToken, markReadNotification);
router.delete("/:id", authenticateToken, deleteNotification);

export default router;

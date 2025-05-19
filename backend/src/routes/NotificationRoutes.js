import { Router } from "express";
import {
	deleteNotification,
	getNotifications,
	// getToken,
	markReadNotification,
	saveNotification,
	saveToken,
} from "../controllers/NotificationController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.post("/", saveNotification);
router.get("/", authenticateToken, getNotifications);
router.post("/pushToken", authenticateToken, saveToken);
// router.get("/pushToken", authenticateToken, getToken);
router.put("/:id", authenticateToken, markReadNotification);
router.delete("/:id", authenticateToken, deleteNotification);

export default router;

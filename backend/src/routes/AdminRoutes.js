import { Router } from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
	createAdmin,
	adminLogin,
	dashboardStats,
} from "../controllers/AdminControllers.js";
const router = Router();

router.post("/", createAdmin);
router.post("/login", adminLogin);
router.get("/dashboard", authenticateToken, dashboardStats);

export default router;

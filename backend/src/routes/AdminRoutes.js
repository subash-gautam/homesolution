import { Router } from "express";
import { authenticateToken } from "../middleware/auth.js";
import { createAdmin, adminLogin } from "../controllers/AdminControllers.js";
const router = Router();

router.post("/", createAdmin);
router.post("/login", adminLogin);

export default router;

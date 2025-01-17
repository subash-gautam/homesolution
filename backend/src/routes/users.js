import { Router } from "express";
import { createUser, getUsers, loginUser } from "../controllers/users.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/", authenticateToken, getUsers);

export default router;

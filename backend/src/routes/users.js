import { Router } from "express";
import {
	createUser,
	getUsers,
	loginUser,
	getUser,
	updateUser,
	deleteUser,
} from "../controllers/users.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/", authenticateToken, getUsers);
router.get("/:id", getUser);
router.put("/:id", authenticateToken, updateUser);
router.delete("/:id", authenticateToken, deleteUser);

export default router;

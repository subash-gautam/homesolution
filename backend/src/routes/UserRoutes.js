import { Router } from "express";
import {
	createUser,
	getUsers,
	loginUser,
	getUser,
	updateUser,
	deleteUser,
} from "../controllers/UserController.js";
import { authenticateToken } from "../middleware/auth.js";
import { upload } from "../middleware/fileOperation.js";

const router = Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/", authenticateToken, getUsers);
router.get("/:id", getUser);
router.put("/:id", authenticateToken, upload.single("profile"), updateUser);
router.delete("/:id", authenticateToken, deleteUser);

export default router;

import { Router } from "express";
import {
	createUser,
	getUsers,
	loginUser,
	getUser,
	updateUser,
	updateUserProfile,
	deleteUser,
} from "../controllers/UserController.js";
import { authenticateToken } from "../middleware/auth.js";
import { upload } from "../middleware/fileOperation.js";

const router = Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/", getUsers);
router.get("/:id", getUser);
router.put("/", authenticateToken, upload.single("userProfile"), updateUser);
router.put(
	"/profile",
	authenticateToken,
	upload.single("userProfile"),
	updateUserProfile,
);

router.delete("/", authenticateToken, deleteUser);

export default router;

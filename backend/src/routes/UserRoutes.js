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
import { upload } from "../middleware/fileUpload.js";

const router = Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/", authenticateToken, getUsers);
router.get("/:id", getUser);
router.put("/:id", authenticateToken, upload.single("file"), updateUser);
router.delete("/:id", authenticateToken, deleteUser);
router.post("/upload", authenticateToken, upload.single("file"), (req, res) => {
	res.status(200).json({
		message: "File uploaded successfully",
		file: req.file,
	});
});

export default router;

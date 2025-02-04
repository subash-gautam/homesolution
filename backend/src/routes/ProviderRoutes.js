import e, { Router } from "express";
import {
	createProvider,
	getProviderById,
	getProviders,
	providerLogin,
	updateProvider,
	deleteProvider,
	updateProfile,
	updateDocument,
} from "../controllers/ProviderControllers.js";
import { authenticateToken } from "../middleware/auth.js";
import { upload } from "../middleware/fileOperation.js";

const router = Router();

router.post("/register", createProvider);
router.post("/login", providerLogin);
router.get("/", getProviders);
router.get("/:id", getProviderById);
router.put(
	"/profile",
	authenticateToken,
	upload.single("ProviderProfile"),
	updateProfile,
);
router.put(
	"/document",
	authenticateToken,
	upload.single("ProviderDocument"),
	updateDocument,
);
router.put("/", authenticateToken, updateProvider);
router.delete("/", authenticateToken, deleteProvider);

export default router;

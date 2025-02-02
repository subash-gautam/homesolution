import e, { Router } from "express";
import {
  createProvider,
  getProviderById,
  getProviders,
  providerLogin,
  updateProvider,
  deleteProvider,
} from "../controllers/ProviderControllers.js";
import { authenticateToken } from "../middleware/auth.js";
import { upload } from "../middleware/fileOperation.js";

const router = Router();

router.post("/register", createProvider);
router.post("/login", providerLogin);
router.get("/", getProviders);
router.get("/:id", getProviderById);
router.put(
  "/",
  authenticateToken,
  upload.single("ProviderProfile"),
  updateProvider
);
router.delete("/", authenticateToken, deleteProvider);

export default router;

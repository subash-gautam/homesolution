import { Router } from "express";
import {
	categories,
	createSerivce,
	deleteService,
	getAService,
	getServices,
	updateService,
} from "../controllers/ServiceControllers.js";
import { authenticateToken } from "../middleware/auth.js";
import { upload } from "../middleware/fileOperation.js";

const router = Router();

router.post("/", authenticateToken, upload.single("serviceImg"), createSerivce);
router.get("/", getServices);
router.get("/categories", categories);
router.get("/:id", getAService);
router.put(
	"/:id",
	authenticateToken,
	upload.single("serviceImg"),
	updateService,
);
router.delete("/:id", authenticateToken, deleteService);

export default router;

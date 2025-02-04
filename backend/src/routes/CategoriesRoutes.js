import {
	createServiceCategory,
	getCategories,
	removeServiceCategory,
	updateServiceCategory,
} from "../controllers/ServiceCategoryControllers.js";

import { Router } from "express";
import { upload } from "../middleware/fileOperation.js";

const router = Router();

router.post("/", upload.single("CategoryImage"), createServiceCategory);
router.get("/", getCategories);
router.put("/:id", upload.single("CategoryImage"), updateServiceCategory);
router.delete("/:id", removeServiceCategory);

export default router;

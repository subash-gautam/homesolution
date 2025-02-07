import { Router } from "express";

import {
	addProviderService,
	providersOfAService,
	removeProviderService,
	servicesOfAProvider,
} from "../controllers/ProviderServiceControllers.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.put("/", authenticateToken, addProviderService);
router.delete("/", authenticateToken, removeProviderService);
router.get("/services/:id", servicesOfAProvider);
router.get("/providers/:id", providersOfAService);

export default router;

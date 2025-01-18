import { Router } from "express";
import UserRoutes from "./UserRoutes.js";
import ProviderRoutes from "./ProviderRoutes.js";

const router = Router();

router.use("/users", UserRoutes);
router.use("/providers", ProviderRoutes);

export default router;

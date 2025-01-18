import { Router } from "express";
import UserRoutes from "./UserRoutes.js";

const router = Router();

router.use("/users", UserRoutes);

export default router;

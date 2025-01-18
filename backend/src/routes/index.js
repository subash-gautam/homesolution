import { Router } from "express";
import UserRoutes from "./users.js";

const router = Router();

router.use("/users", UserRoutes);

export default router;

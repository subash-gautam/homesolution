import { Router } from "express";
import UserRoutes from "./UserRoutes.js";
import ProviderRoutes from "./ProviderRoutes.js";
import ServiceRoutes from "./ServiceRoutes.js";
import BookingRoutes from "./BookingRoutes.js";
import MessageRoutes from "./MessageRoutes.js";

const router = Router();

router.use("/users", UserRoutes);
router.use("/providers", ProviderRoutes);
router.use("/services", ServiceRoutes);
router.use("/bookings", BookingRoutes);
router.use("/messages", MessageRoutes);

export default router;

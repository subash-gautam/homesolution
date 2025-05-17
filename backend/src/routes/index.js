import { Router } from "express";
import UserRoutes from "./UserRoutes.js";
import ProviderRoutes from "./ProviderRoutes.js";
import ServiceRoutes from "./ServiceRoutes.js";
import BookingRoutes from "./BookingRoutes.js";
import MessageRoutes from "./MessageRoutes.js";
import CategoriesRoutes from "./CategoriesRoutes.js";
import AdminRoutes from "./AdminRoutes.js";
import ProviderServiceRoutes from "./ProviderServiceRoutes.js";
import NotificationRoutes from "./NotificationRoutes.js";

const router = Router();

router.get("/", (req, res) => {
	res.status(200).json({ message: "Server is awake !!" });
});

router.use("/users", UserRoutes);
router.use("/providers", ProviderRoutes);
router.use("/services", ServiceRoutes);
router.use("/bookings", BookingRoutes);
router.use("/messages", MessageRoutes);
router.use("/admin", AdminRoutes);
router.use("/categories", CategoriesRoutes);
router.use("/providerServices", ProviderServiceRoutes);
router.use("/notifications", NotificationRoutes);

export default router;

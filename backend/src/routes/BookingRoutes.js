import { Router } from "express";
import {
	createBooking,
	getBookings,
	updateBooking,
	deleteBooking,
} from "../controllers/BookingControllers.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.post("/:id", authenticateToken, createBooking);
router.get("/", getBookings);
router.put("/:id", authenticateToken, updateBooking);
router.delete("/:id", authenticateToken, deleteBooking);

export default router;

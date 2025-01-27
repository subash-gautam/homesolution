import prisma from "../config/db.config.js";

export const createBooking = async (req, res) => {
	const user_id = req.user.id;
	const service_id = parseInt(req.params.id);
	const { status } = req.body;

	const service = await prisma.service.findUnique({
		where: { id: service_id },
		include: { provider: true },
	});

	console.log(service);
	const provider_id = service.provider.id;

	try {
		const booking = await prisma.booking.create({
			data: {
				user_id,
				service_id,
				provider_id,
				status,
			},
		});
		res.status(200).json({ message: "Booking created", booking });
	} catch (error) {
		console.log(error);
		res.status(400).json({
			error: error.message,
		});
	}
};

export const getBookings = async (req, res) => {
	const { service_id, booking_id } = req.query;
	console.log(req.body);
	if (!service_id && !booking_id) {
		try {
			const bookings = await prisma.booking.findMany();
			return res.json({ bookings });
		} catch (error) {
			console.log(error);
			return res.status(500).json({ error: error.message });
		}
	}
	if (service_id) {
		try {
			const bookings = await prisma.booking.findMany({
				where: { service_id: parseInt(service_id) },
				include: { user: true },
			});
			return res.json(bookings);
		} catch (error) {
			console.log(error);
			return res.status(500).json({ error: error.message });
		}
	}
	if (booking_id) {
		try {
			const bookings = await prisma.booking.findMany({
				where: { id: parseInt(booking_id) },
				include: { user: true, service: true },
			});
			return res.json(bookings);
		} catch (error) {
			console.log(error);
			return res.status(500).json({ error: error.message });
		}
	}
};

export const updateBooking = async (req, res) => {
	const id = parseInt(req.params.id);
	const { status } = req.body;

	try {
		const booking = await prisma.booking.update({
			where: { id },
			data: { status },
		});
		return res.status(200).json({ message: "Booking updated", booking });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ error: error.message });
	}
};

export const deleteBooking = async (req, res) => {
	const id = parseInt(req.params.id);

	const booking = await prisma.booking.findUnique({
		where: { id },
	});

	if (!booking) {
		return res.status(404).json({ message: "Booking not found" });
	}

	try {
		const booking = await prisma.booking.delete({ where: { id } });
		return res.status(200).json({ message: "Booking deleted", booking });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ error: error.message });
	}
};

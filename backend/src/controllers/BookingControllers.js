import prisma from "../config/db.config.js";
import { getOnlineProviders } from "../sockets/onProviders.js";

export const createBooking = async (req, res) => {
	const userId = req.user.id;

	const {
		providerId,
		serviceId,
		scheduledDate,
		bookingStatus,
		paymentStatus,
		amount,
		address,
		city,
		lat,
		lon,
	} = req.body;

	if (!userId || !serviceId) {
		return res.status(400).json({
			error: "Missing required fields or unauthorized access..",
		});
	}

	if (providerId) {
		// const existingBooking = await prisma.booking.findMany({
		// 	where: {
		// 		userId: Number(userId),
		// 		serviceId: Number(serviceId),
		// 		providerId: Number(providerId),
		// 		bookingStatus: "pending",
		// 	},
		// });

		// if (existingBooking.length > 0) {
		// 	return res.status(400).json({
		// 		error: "You already have a pending booking for this service with this provider.",
		// 	});
		// }

		const service = await prisma.service.findUnique({
			where: { id: serviceId },
			include: { providers: true },
		});

		if (!service) {
			return res.status(404).json({ message: "Service not found" });
		}

		console.log(service);

		try {
			const booking = await prisma.booking.create({
				data: {
					userId: Number(userId),
					providerId: Number(providerId),
					serviceId: Number(serviceId),
					scheduledDate,
					bookingStatus,
					paymentStatus,
					amount: parseFloat(amount),
					address,
					city,
					lat,
					lon,
				},
			});
			res.status(200).json({
				message:
					"Booking created, and selected provider is notified about your booking...",
				booking,
			});
		} catch (error) {
			console.log(error);
			res.status(400).json({
				error: error.message,
			});
		}
	} else {
		const existingBooking = await prisma.booking.findMany({
			where: {
				userId: Number(userId),
				serviceId: Number(serviceId),
				scheduledDate,
				bookingStatus: "pending",
			},
		});

		if (existingBooking.length > 0) {
			return res.status(400).json({
				error: "You already have a pending booking for this service.",
			});
		}

		try {
			const booking = await prisma.booking.create({
				data: {
					userId: Number(userId),
					serviceId: Number(serviceId),
					bookingStatus,
					paymentStatus,
					address,
					city,
					lat,
					lon,
				},
			});

			return res.status(200).json({
				message:
					"Immediate booking created, and available nearby service providers are notified about your booking...",
				booking,
			});
		} catch (error) {
			console.log(error);
			return res.status(400).json({
				error: error.message,
			});
		}
	}
};

export const getBookings = async (req, res) => {
	const {
		userId,
		serviceId,
		providerId,
		bookingId,
		bookingStatus,
		minAmount,
		maxAmount,
		minRating,
		maxRating,
		bookingAfter,
		bookingBefore,
		amount,
		city,
		address,
		lat,
		lon,
	} = req.query;

	const filter = [];

	if (userId) filter.push({ userId: parseInt(userId) });
	if (serviceId) filter.push({ serviceId: parseInt(serviceId) });
	if (providerId) filter.push({ providerId: parseInt(providerId) });
	if (bookingId) filter.push({ id: parseInt(bookingId) });
	if (bookingStatus) filter.push({ bookingStatus: bookingStatus });
	if (minAmount) filter.push({ amount: { gte: parseFloat(minAmount) } });
	if (maxAmount) filter.push({ amount: { lte: parseFloat(maxAmount) } });
	if (minRating) filter.push({ rating: { gte: parseInt(minRating) } });
	if (maxRating) filter.push({ rating: { lte: parseInt(maxRating) } });
	if (bookingAfter)
		filter.push({ createdAt: { gte: new Date(bookingAfter) } });
	if (bookingBefore)
		filter.push({ createdAt: { lte: new Date(bookingBefore) } });
	if (amount) filter.push({ amount: parseFloat(amount) });
	if (city) filter.push({ city: city });
	if (address) filter.push({ address: address });
	if (lat) filter.push({ lat: parseFloat(lat) });
	if (lon) filter.push({ lon: parseFloat(lon) });

	try {
		const bookings = await prisma.booking.findMany({
			where: { AND: filter },
			orderBy: { bookedAt: "desc" },

			include: {
				user: {
					select: { name: true },
				},
				provider: {
					select: { name: true },
				},
				service: {
					select: {
						name: true,
						category: {
							select: { name: true },
						},
					},
				},
			},
		});

		// Format response to replace ids with names
		const formattedBookings = bookings.map((b) => ({
			id: b.id,
			user: b.user?.name || null,
			provider: b.provider?.name || null,
			service: b.service?.name || null,
			category: b.service?.category?.name || null,
			scheduledDate: b.scheduledDate,
			bookedAt: b.bookedAt,
			bookingStatus: b.bookingStatus,
			paymentStatus: b.paymentStatus,
			amount: b.amount,
			rating: b.rating,
			amount: b.amount,
			address: b.address,
			city: b.city,
			lat: b.lat,
			lon: b.lon,
			bookedAt: b.bookedAt,
		}));

		return res.json(formattedBookings);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: error.message });
	}
};

export const updateBooking = async (req, res) => {
	const id = parseInt(req.params.id);
	if (req.user.role == "user") {
		const {
			scheduledDate,
			bookingStatus,
			paymentStatus,
			amount,
			rating,
			address,
			city,
			lat,
			lon,
		} = req.body;

		try {
			const booking = await prisma.booking.update({
				where: { id },
				data: {
					scheduledDate,
					bookingStatus,
					paymentStatus,
					amount: parseFloat(amount),
					rating: parseInt(rating),
					address,
					city,
					lat: parseFloat(lat),
					lon: parseFloat(lon),
				},
			});
			return res
				.status(200)
				.json({ message: "Booking updated", booking });
		} catch (error) {
			console.log(error);
			return res.status(400).json({ error: error.message });
		}
	} else if (req.user.role == "provider") {
		const {
			bookingStatus,
			paymentStatus,
			amount,
			address,
			city,
			lat,
			lon,
		} = req.body;
		try {
			const booking = await prisma.booking.update({
				where: { id },
				data: {
					bookingStatus,
					paymentStatus,
					amount: parseFloat(amount),
					address,
					city,
					lat,
					lon,
				},
			});
			return res
				.status(200)
				.json({ message: "Booking updated", booking });
		} catch (error) {
			console.log(error);
			return res.status(400).json({ error: error.message });
		}
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

export const onlineProviders = async (req, res) => {
	const providers = getOnlineProviders();
};

import prisma from "../config/db.config.js";
import { getOnlineProviders } from "../sockets/onlineUsers.js";

export const createBooking = async (req, res) => {
	const userId = req.user.id;
	const io = req.app.get("socket");

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

		// Properly fetch service (dummy fallback added)
		const service = await prisma.service.findUnique({
			where: {
				id: Number(serviceId),
			},
			include: {
				category: true,
			},
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
					amount: amount ? parseFloat(amount) : null,
					address,
					city,
					lat,
					lon,
				},
				include: {
					user: true,
					provider: true,
					service: {
						include: {
							category: true,
						},
					},
				},
			});

			const formattedBooking = {
				id: booking.id,
				user: booking.user?.name || null,
				provider: booking.provider?.name || null,
				service: booking.service?.name || null,
				category: booking.service?.category?.name || null,
				scheduledDate: booking.scheduledDate,
				bookedAt: booking.bookedAt,
				bookingStatus: booking.bookingStatus,
				paymentStatus: booking.paymentStatus,
				amount: booking.amount,
				rating: booking.rating,
				address: booking.address,
				city: booking.city,
				lat: booking.lat,
				lon: booking.lon,
			};

			console.info("Booking : ", formattedBooking);

			const onlineProviders = await getOnlineProviders();
			console.log("Online Providers : ", onlineProviders);

			if (onlineProviders && onlineProviders.length > 0) {
				console.log("some providers are online");
				onlineProviders.forEach((providerInfo) => {
					if (
						providerId == providerInfo.providerId &&
						providerInfo.socketId
					) {
						io.to(providerInfo.socketId).emit(
							"new_booking",
							formattedBooking,
						);
						console.log(
							`Emitting 'new_booking' to provider socket: ${providerInfo.socketId}`,
						);
					}
				});
			} else {
				console.log("No online providers found for this booking.");
			}
			return res.status(200).json({
				message:
					"Booking created, and selected provider is notified about your booking...",
				booking,
			});
		} catch (error) {
			console.log(error);
			return res.status(400).json({
				error: error.message,
			});
		}
	} else {
		// const existingBooking = await prisma.booking.findMany({
		// 	where: {
		// 		userId: Number(userId),
		// 		serviceId: Number(serviceId),
		// 		scheduledDate,
		// 		bookingStatus: "pending",
		// 	},
		// });

		// if (existingBooking.length > 0) {
		// 	return res.status(400).json({
		// 		error: "You already have a pending booking for this service.",
		// 	});
		// }

		try {
			const booking = await prisma.booking.create({
				data: {
					userId: Number(userId),
					serviceId: Number(serviceId),
					scheduledDate,
					bookingStatus,
					paymentStatus,
					amount: amount ? parseFloat(amount) : null,
					address,
					city,
					lat,
					lon,
				},
				include: {
					user: true,
					provider: true,
					service: {
						include: {
							category: true,
						},
					},
				},
			});

			const formattedBooking = {
				id: booking.id,
				user: booking.user?.name || null,
				provider: booking.provider?.name || null,
				service: booking.service?.name || null,
				category: booking.service?.category?.name || null,
				scheduledDate: booking.scheduledDate,
				bookedAt: booking.bookedAt,
				bookingStatus: booking.bookingStatus,
				paymentStatus: booking.paymentStatus,
				amount: booking.amount,
				rating: booking.rating,
				address: booking.address,
				city: booking.city,
				lat: booking.lat,
				lon: booking.lon,
			};

			const onlineProviders = await getOnlineProviders();
			console.log("Online Providers : ", onlineProviders);

			if (onlineProviders && onlineProviders.length > 0) {
				console.log("some providers are online");
				onlineProviders.forEach((providerInfo) => {
					if (providerInfo.socketId) {
						io.to(providerInfo.socketId).emit(
							"new_booking",
							formattedBooking,
						);
						console.log(
							`Emitting 'new_booking' to provider socket: ${providerInfo.socketId}`,
						);
					}
				});
			} else {
				console.log("No online providers found for this booking.");
			}

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

	// 🛠️ Handle single or multiple bookingStatus
	if (bookingStatus) {
		const statuses = Array.isArray(bookingStatus)
			? bookingStatus
			: bookingStatus.split(",");
		filter.push({ bookingStatus: { in: statuses } });
	}

	if (minAmount) filter.push({ amount: { gte: parseFloat(minAmount) } });
	if (maxAmount) filter.push({ amount: { lte: parseFloat(maxAmount) } });
	if (minRating) filter.push({ rating: { gte: parseInt(minRating) } });
	if (maxRating) filter.push({ rating: { lte: parseInt(maxRating) } });
	if (bookingAfter)
		filter.push({ createdAt: { gte: new Date(bookingAfter) } });
	if (bookingBefore)
		filter.push({ createdAt: { lte: new Date(bookingBefore) } });
	if (amount) filter.push({ amount: parseFloat(amount) });
	if (city) filter.push({ city });
	if (address) filter.push({ address });
	if (lat) filter.push({ lat: parseFloat(lat) });
	if (lon) filter.push({ lon: parseFloat(lon) });

	try {
		const bookings = await prisma.booking.findMany({
			where: { AND: filter },
			orderBy: { bookedAt: "desc" },

			include: {
				user: { select: { name: true } },
				provider: { select: { name: true } },
				service: {
					select: {
						name: true,
						category: { select: { name: true } },
					},
				},
			},
		});

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
			address: b.address,
			city: b.city,
			lat: b.lat,
			lon: b.lon,
		}));

		return res.json(formattedBookings);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: error.message });
	}
};

export const updateBooking = async (req, res) => {
	const id = parseInt(req.params.id);
	let updateData = {};
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

		if (scheduledDate) updateData.scheduledDate = new Date(scheduledDate);
		if (bookingStatus) updateData.bookingStatus = bookingStatus;
		if (bookingStatus == "completed") updateData.paymentStatus = "paid";
		if (paymentStatus) updateData.paymentStatus = paymentStatus;
		if (amount) updateData.amount = parseFloat(amount);
		if (rating) updateData.rating = parseInt(rating);
		if (address) updateData.address = address;
		if (city) updateData.city = city;
		if (lat) updateData.lat = parseFloat(lat);
		if (lon) updateData.lon = parseFloat(lon);

		try {
			const booking = await prisma.booking.update({
				where: { id },
				data: updateData,
			});

			if (rating) {
				const providerId = booking.providerId;

				// Fetch all rated bookings for that provider
				const ratedBookings = await prisma.booking.findMany({
					where: {
						providerId: providerId,
						rating: { gt: 0 },
					},
					select: { rating: true }, // Only fetch rating field to optimize query
				});

				// Calculate the average rating
				const totalRatings = ratedBookings.length;
				const ratingSum = ratedBookings.reduce(
					(sum, booking) => sum + booking.rating,
					0,
				);
				const averageRating =
					totalRatings > 0 ? ratingSum / totalRatings : 0;
				console.log("averageRating : ", averageRating);
				// Update the provider’s averageRating in DB
				await prisma.provider.update({
					where: { id: providerId },
					data: {
						averageRating,
					},
				});
			}

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

		if (bookingStatus) updateData.bookingStatus = bookingStatus;
		if (bookingStatus == "completed") updateData.paymentStatus = "paid";
		if (paymentStatus) updateData.paymentStatus = paymentStatus;
		if (amount) updateData.amount = parseFloat(amount);
		if (address) updateData.address = address;
		if (city) updateData.city = city;
		if (lat) updateData.lat = parseFloat(lat);
		if (lon) updateData.lon = parseFloat(lon);

		try {
			const booking = await prisma.booking.update({
				where: { id },
				data: updateData,
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

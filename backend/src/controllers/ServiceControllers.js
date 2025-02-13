import prisma from "../config/db.config.js";
import { deleteFile } from "../middleware/fileOperation.js";

// Helper function to validate service existence
const getServiceById = async (id) => {
	return await prisma.service.findUnique({ where: { id } });
};

// Create a service
export const createService = async (req, res) => {
	if (req.user.role !== "admin") {
		if (req.file.filename) deleteFile(req.file.filename);
		return res.status(401).json({ error: "Unauthorized access" });
	}

	const { categoryId, name, description, minimumCharge, avgRatePerHr } =
		req.body;
	const service_image = req.file ? req.file.filename : null;

	if (!categoryId || !name || !description || !minimumCharge) {
		if (!categoryId) {
			return res.status(400).json({ error: "Category ID is required" });
		}
		if (!name) {
			return res.status(400).json({ error: "Service name is required" });
		}
		if (!description) {
			return res
				.status(400)
				.json({ error: "Service description is required" });
		}
		if (!minimumCharge) {
			return res
				.status(400)
				.json({ error: "Minimum charge is required" });
		}
	}

	try {
		const service = await prisma.service.create({
			data: {
				categoryId,
				name,
				description,
				minimumCharge: parseFloat(minimumCharge),
				avgRatePerHr: parseFloat(avgRatePerHr) || 0,
				service_image,
			},
		});

		res.status(201).json({
			message: "Service created successfully",
			service,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
};

// Fetch all services
export const getServices = async (req, res) => {
	const {
		categoryId,
		providerId,
		serviceId,
		minMinimumCharge,
		maxMinimumCharge,
		minAvgRatePerHr,
		maxAvgRatePerHr,
	} = req.query;
	const filters = [];

	if (categoryId) filters.push({ categoryId: parseInt(categoryId) });
	if (providerId) filters.push({ providerId: parseInt(providerId) });
	if (serviceId) filters.push({ id: parseInt(serviceId) });
	if (minMinimumCharge)
		filters.push({ minimumCharge: { gte: parseFloat(minMinimumCharge) } });
	if (maxMinimumCharge)
		filters.push({ minimumCharge: { lte: parseFloat(maxMinimumCharge) } });
	if (minAvgRatePerHr)
		filters.push({ avgRatePerHr: { gte: parseFloat(minAvgRatePerHr) } });
	if (maxAvgRatePerHr)
		filters.push({ avgRatePerHr: { lte: parseFloat(maxAvgRatePerHr) } });

	try {
		const services = await prisma.service.findMany({
			where: { AND: filters },
			include: {
				category: {
					select: {
						name: true,
					},
				},
				// providers: true,
				// bookings: true,
			},
		});
		res.status(200).json(services);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
};

// Fetch a single service by ID
export const getAService = async (req, res) => {
	const id = parseInt(req.params.id);
	try {
		const service = await prisma.service.findUnique({
			where: { id },
			include: {
				category: true,
				providers: true,
				bookings: true,
			},
		});

		if (!service)
			return res.status(404).json({ error: "Service not found" });
		res.status(200).json(service);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
};

// Update a service
export const updateService = async (req, res) => {
	if (req.user.role !== "admin") {
		if (req.file.filename) deleteFile(req.file.filename);
		return res.status(401).json({ error: "Unauthorized access" });
	}
	const id = Number(req.params.id);
	const providerId = req.user.id;
	const { name, description, minimumCharge, avgRatePerHr } = req.body;
	const service_image = req.file ? req.file.filename : null;

	try {
		const service = await getServiceById(id);
		if (!service)
			return res.status(404).json({ error: "Service not found" });

		// Remove old image if new one is uploaded
		if (service_image && service.service_image) {
			deleteFile(service.service_image);
		}

		const updatedService = await prisma.service.update({
			where: { id },
			data: {
				name,
				description,
				minimumCharge:
					parseFloat(minimumCharge) || service.minimumCharge,
				avgRatePerHr: parseFloat(avgRatePerHr) || service.avgRatePerHr,
				service_image,
			},
		});

		res.status(200).json({
			message: "Service updated successfully",
			updatedService,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
};

// Delete a service
export const deleteService = async (req, res) => {
	if (req.user.role !== "admin") {
		return res.status(401).json({ error: "Unauthorized access" });
	}

	const id = Number(req.params.id);
	const providerId = req.user.id;

	try {
		const service = await getServiceById(id);
		if (!service)
			return res.status(404).json({ error: "Service not found" });
		if (providerId !== service.providerId) {
			return res.status(403).json({ error: "Unauthorized access" });
		}

		if (service.service_image) {
			deleteFile(service.service_image);
		}

		await prisma.service.delete({ where: { id } });
		res.status(200).json({ message: "Service deleted successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
};

// Get top 4 popular services based on bookings
export const popularServices = async (req, res) => {
	try {
		const topServices = await prisma.booking.groupBy({
			by: ["serviceId"],
			_count: { id: true },
			orderBy: { _count: { id: "desc" } },
			take: 4,
		});

		const serviceDetails = await prisma.service.findMany({
			where: { id: { in: topServices.map((s) => s.serviceId) } },
			include: { providers: true },
		});

		res.status(200).json(serviceDetails);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Something went wrong" });
	}
};

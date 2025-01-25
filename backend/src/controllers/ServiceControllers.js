import prisma from "../config/db.config.js";
import { deleteFile } from "../middleware/fileOperation.js";

// Create a service
export const createSerivce = async (req, res) => {
	const provider_id = req.user.id;
	const { name, description, mincharge, type } = req.body;

	const service_image = req.file ? req.file.filename : null;

	if (!name || !mincharge) {
		if (!name) {
			return res.status(400).json({ error: "Name is required" });
		}
		if (!mincharge) {
			return res
				.status(400)
				.json({ error: "Minimum charge is required" });
		}
	}

	try {
		const service = await prisma.service.create({
			data: {
				provider_id,
				name,
				description,
				mincharge,
				type,
				service_image,
			},
		});

		res.status(201).json({
			message: "Service created successfully",
			service,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
};

export const getServices = async (req, res) => {
	try {
		const services = await prisma.service.findMany({
			include: {
				provider: true,
				bookings: true,
			},
		});
		res.status(200).json(services);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const getAService = async (req, res) => {
	const id = parseInt(req.params.id);
	try {
		const service = await prisma.service.findUnique({
			where: {
				id,
			},
			include: {
				provider: true,
				bookings: true,
			},
		});
		res.status(200).json(service);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
};

export const updateService = async (req, res) => {
	const id = Number(req.params.id);
	const provider_id = req.user.id;
	const { name, description, type } = req.body;
	let { mincharge } = req.body;
	const service_image = req.file ? req.file.filename : null;

	if (mincharge) {
		mincharge = parseFloat(mincharge);
	}
	const service = await prisma.service.findUnique({
		where: { id },
		select: { provider_id: true },
	});

	if (!service) {
		return res.status(404).json({ message: "Service not found" });
	}

	const serviceOwner = service.provider_id;

	console.log(provider_id, serviceOwner);
	if (provider_id !== serviceOwner) {
		return res.status(403).json({ message: "Unauthorized access" });
	}

	if (!name && !description && !mincharge && !type && !service_image) {
		return res
			.status(400)
			.json({ error: "No fields are subjected to update..." });
	}

	if (service_image) {
		const service = await prisma.service.findUnique({
			where: {
				id,
			},
		});
		if (service.service_image) {
			deleteFile(service.service_image);
		}
	}

	try {
		const service = await prisma.service.update({
			where: {
				id: Number(id),
			},
			data: {
				name,
				description,
				mincharge,
				type,
				service_image,
			},
		});
		res.status(200).json({
			service,
			message: "Service updated successfully",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
};

export const deleteService = async (req, res) => {
	const id = Number(req.params.id);
	const provider_id = req.user.id;

	const service = await prisma.service.findUnique({
		where: { id },
	});
	if (!service) {
		return res.status(404).json({ message: "Service not found" });
	}

	const serviceOwner = service.provider_id;

	if (provider_id !== serviceOwner) {
		return res.status(403).json({ message: "Unauthorized access" });
	}

	if (service.service_image) {
		deleteFile(service.service_image);
	}

	try {
		await prisma.service.delete({
			where: {
				id: Number(id),
			},
		});
		res.status(200).json({ message: "Service deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const categories = async (req, res) => {
	try {
		const categories = await prisma.service.findMany({
			select: {
				type: true,
			},
			distinct: ["type"], // Get unique values
		});

		// Convert array of objects to an array of strings
		const categoryList = categories.map((item) => item.type);

		res.status(200).json({ categories: categoryList });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
};

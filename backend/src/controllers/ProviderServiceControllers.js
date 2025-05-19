import prisma from "../config/db.config.js";
import { getOnlineProviders } from "../sockets/onlineUsers.js";

export const addProviderService = async (req, res) => {
	const providerId = req.user.id;

	console.log("providerId : ", providerId);

	const { serviceId } = req.body;

	// Ensure serviceId is an array
	if (!Array.isArray(serviceId) || serviceId.length === 0) {
		return res
			.status(400)
			.json({ error: "ServiceId must be a non-empty array" });
	}

	try {
		// Check if provider exists
		const providerExists = await prisma.provider.findUnique({
			where: { id: Number(providerId) },
		});

		if (!providerExists) {
			return res.status(404).json({ error: "Provider not found" });
		}

		// Check existing services
		const existingProviderServices = await prisma.providerService.findMany({
			where: {
				providerId: Number(providerId),
				serviceId: { in: serviceId.map(Number) },
			},
		});

		// Extract already added serviceIds
		const existingServiceIds = existingProviderServices.map(
			(ps) => ps.serviceId,
		);
		const newServiceIds = serviceId
			.map(Number)
			.filter((id) => !existingServiceIds.includes(id));

		// If all services already exist, return an error
		if (newServiceIds.length === 0) {
			return res
				.status(400)
				.json({ error: "All services are already added to provider" });
		}

		// Bulk insert new services
		const providerServices = await prisma.providerService.createMany({
			data: newServiceIds.map((id) => ({
				providerId: Number(providerId),
				serviceId: id,
			})),
			skipDuplicates: true,
		});

		return res.status(201).json({
			message: "Services added successfully",
			addedServices: newServiceIds,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error.message });
	}
};

export const removeProviderService = async (req, res) => {
	const providerId = req.user.id;
	const { serviceId } = req.body;
	try {
		const providerService = await prisma.providerService.delete({
			where: {
				providerId_serviceId: {
					providerId: Number(providerId),
					serviceId: Number(serviceId),
				},
			},
		});
		return res.status(200).json({
			message: "Removed from service provider for this service.",
			providerService,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: error.message });
	}
};

export const providersOfAService = async (req, res) => {
	const serviceId = req.params.id;
	try {
		const busyProviders = await prisma.booking.findMany({
			where: {
				bookingStatus: "confirmed",
				providerId: { not: null },
			},
			select: {
				providerId: true,
			},
			distinct: ["providerId"],
		});

		// Extract busy provider IDs
		const busyProviderIds = busyProviders.map((b) => b.providerId);
		console.log("busy : ", busyProviderIds);

		// Step 2: Get providers of the service who are verified and NOT busy
		const providers = await prisma.providerService.findMany({
			where: {
				serviceId: Number(serviceId),
				provider: {
					verificationStatus: "verified",
					id: {
						notIn: busyProviderIds,
					},
				},
			},
			include: {
				provider: true,
			},
		});

		console.log("providers : ", providers);
		// Step 3: Attach online status
		const onlineProviders = getOnlineProviders();
		console.log("Online Providers ", onlineProviders);

		providers.forEach((provider) => {
			provider.provider.isOnline = onlineProviders.includes(
				provider.provider.id,
			);
		});

		return res.status(200).json(providers);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: error.message });
	}
};

export const servicesOfAProvider = async (req, res) => {
	const providerId = req.params.id;
	try {
		const services = await prisma.providerService.findMany({
			where: {
				providerId: Number(providerId),
			},
			include: {
				service: true,
			},
		});
		return res.status(200).json(services);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: error.message });
	}
};

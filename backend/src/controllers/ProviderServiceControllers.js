import prisma from "../config/db.config.js";

export const addProviderService = async (req, res) => {
	const providerId = req.user.id;
	const { serviceId } = req.body;

	const existingProviderService = await prisma.providerService.findMany({
		where: {
			providerId: Number(providerId),
			serviceId: Number(serviceId),
		},
	});

	if (existingProviderService.length > 0) {
		return res
			.status(400)
			.json({ error: "Service already added to provider" });
	}

	try {
		const providerService = await prisma.providerService.create({
			data: {
				providerId,
				serviceId,
			},
		});
		return res.status(201).json(providerService);
	} catch (error) {
		console.log(error);
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
	const serveiceId = req.params.id;
	try {
		const providers = await prisma.providerService.findMany({
			where: {
				serviceId: Number(serveiceId),
			},
			include: {
				provider: true,
			},
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

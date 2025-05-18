import prisma from "../config/db.config.js";
import {} from "../sockets/handlers/messages.js";

export const message = async (req, res) => {
	if (req.user.role == "user") {
		const userId = req.user.id;
		const { providerId, message } = req.body;
		try {
			const newMessage = await prisma.message.create({
				data: {
					userId,
					providerId,
					message,
					sender: "user",
				},
			});
			return res.status(201).json(newMessage);
		} catch (error) {
			console.log(error);
			return res.status(500).json({ error: "Failed to send message" });
		}
	} else if (req.user.role == "provider") {
		const providerId = req.user.id;
		const { userId, message } = req.body;

		try {
			const newMessage = await prisma.message.create({
				data: {
					userId,
					providerId,
					message,
					sender: "provider",
				},
			});
			return res.status(201).json(newMessage);
		} catch (error) {
			console.log(error);
			return res.status(500).json({ error: "Failed to send message" });
		}
	} else return res.status(401).json({ error: "Unauthorized user !!" });
};

export const getAChat = async (req, res) => {
	const userId = Number(req.query.userId);
	const providerId = Number(req.query.providerId);

	if (
		!req.user ||
		!req.user.role ||
		(req.user.id !== userId && req.user.id !== providerId)
	) {
		return res.status(401).json({ error: "Unauthorized Access !!" });
	}

	try {
		const messages = await prisma.message.findMany({
			where: {
				AND: { userId, providerId },
			},
			orderBy: {
				SentAt: "asc",
			},
		});
		return res.status(200).json(messages);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: "Failed to fetch messages" });
	}
};

export const deleteMessage = async (req, res) => {
	const id = parseInt(req.params.id);

	const message = await prisma.message.findUnique({
		where: { id },
	});

	if (message.userId !== req.user.id || message.providerId !== req.user.id) {
		return res.status(401).json({ error: "Unauthorized Access !!" });
	}

	try {
		const message = await prisma.message.delete({
			where: { id },
		});
		return res
			.status(200)
			.json({ message, message: "Message deleted successfully" });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: "Failed to delete message" });
	}
};

export const chatList = async (req, res) => {
	if (!req.user || !req.user.id || !req.user.role) {
		return res.status(401).json({ error: "Invalid user" });
	}

	const id = req.user.id;

	try {
		if (req.user.role === "user") {
			// Step 1: Get unique provider IDs the user has chatted with
			const providerMessages = await prisma.message.findMany({
				where: { userId: id },
				select: { providerId: true },
				distinct: ["providerId"],
			});

			const providerIds = providerMessages.map((msg) => msg.providerId);

			// Step 2: Fetch provider info
			const providers = await prisma.provider.findMany({
				where: { id: { in: providerIds } },
				select: {
					id: true,
					name: true,
					profile: true,
				},
			});

			// Format the result
			const result = providers.map((p) => ({
				providerId: p.id,
				name: p.name,
				profile: p.profile,
			}));

			return res.status(200).json(result);
		}

		if (req.user.role === "provider") {
			// Step 1: Get unique user IDs the provider has chatted with
			const userMessages = await prisma.message.findMany({
				where: { providerId: id },
				select: { userId: true },
				distinct: ["userId"],
			});

			const userIds = userMessages.map((msg) => msg.userId);

			// Step 2: Fetch user info
			const users = await prisma.user.findMany({
				where: { id: { in: userIds } },
				select: {
					id: true,
					name: true,
					profile: true,
				},
			});

			// Format the result
			const result = users.map((u) => ({
				userId: u.id,
				name: u.name,
				profile: u.profile,
			}));

			return res.status(200).json(result);
		}

		return res.status(401).json({ error: "Unauthorized user !!" });
	} catch (error) {
		console.error("Error fetching chat list:", error);
		return res.status(500).json({ error: "Failed to fetch messages" });
	}
};

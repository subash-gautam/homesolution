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
	const { userId, providerId } = req.body;

	if (!req.user.role || req.user.id !== userId || req.user.id !== providerId)
		return res.status(401).json({ error: "Unauthorized Access !!" });

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

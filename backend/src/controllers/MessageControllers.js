import prisma from "../config/db.config.js";

export const uMessage = async (req, res) => {
	const user_id = req.user.id;
	const { provider_id, message } = req.body;

	try {
		const newMessage = await prisma.message.create({
			data: {
				user_id,
				provider_id,
				message,
				sender: "user",
			},
		});
		return res.status(201).json(newMessage);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: "Failed to send message" });
	}
};

export const pMessage = async (req, res) => {
	const provider_id = req.user.id;
	const { user_id, message } = req.body;

	try {
		const newMessage = await prisma.message.create({
			data: {
				user_id,
				provider_id,
				message,
				sender: "provider",
			},
		});
		return res.status(201).json(newMessage);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: "Failed to send message" });
	}
};

export const getAChat = async (req, res) => {
	const { user_id, provider_id } = req.body;
	try {
		const messages = await prisma.message.findMany({
			where: {
				OR: [
					{
						AND: { user_id, provider_id },
						sender: "user",
					},
					{
						AND: { user_id: provider_id, provider_id },
						sender: "provider",
					},
				],
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

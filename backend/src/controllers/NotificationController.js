import prisma from "../config/db.config.js";

export const saveToken = async (req, res) => {
	const { role, id: userId } = req.user;
	const { token } = req.body;

	if (role !== "user" && role !== "provider") {
		return res.status(403).json({ error: "Unauthorized role" });
	}

	const deviceExists = await prisma.pushToken.findFirst({
		where: {
			token,
		},
	});
	if (deviceExists) {
		await prisma.pushToken.delete({
			where: {
				token,
			},
		});
	}

	try {
		// First check if a token already exists for the same userId and role
		const existingToken = await prisma.pushToken.findFirst({
			where: {
				userId,
				role,
			},
		});

		let result;
		if (existingToken) {
			// Update the existing token
			result = await prisma.pushToken.update({
				where: { id: existingToken.id },
				data: { token },
			});
		} else {
			// Create a new token
			result = await prisma.pushToken.create({
				data: {
					userId,
					token,
					role,
				},
			});
		}

		return res.status(201).json(result);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error.message });
	}
};

export const getToken = async (userId, role) => {
	try {
		const token = await prisma.pushToken.findFirst({
			where: { userId, role },
		});
		// console.log("token: ", token);
		return token;
	} catch (error) {
		console.log(error);
	}
};

console.log(getToken(1, "user"));

// Helper function to create a notification
export const createNotification = (userId, providerId, title, body) => {
	return prisma.notification.create({
		data: {
			userId,
			providerId,
			title,
			body,
		},
	});
};

// Route handler to save a new notification
export const saveNotification = async (req, res) => {
	const { userId, providerId, title, body } = req.body;
	try {
		const notification = await createNotification(
			userId,
			providerId,
			title,
			body,
		);
		return res.status(200).json(notification);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: error.message });
	}
};

// Route handler to get notifications (optionally filtered by userId or providerId)
export const getNotifications = async (req, res) => {
	const { userId, providerId } = req.query;

	const where = {};
	if (userId) where.userId = parseInt(userId);
	if (providerId) where.providerId = parseInt(providerId);

	try {
		const notifications = await prisma.notification.findMany({ where });
		return res.status(200).json(notifications);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: error.message });
	}
};

// Route handler to mark a notification as read
export const markReadNotification = async (req, res) => {
	const id = parseInt(req.params.id);
	if (isNaN(id))
		return res.status(400).json({ error: "Invalid notification ID" });

	try {
		const notification = await prisma.notification.update({
			where: { id },
			data: { read: true },
		});
		return res.status(200).json(notification);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: error.message });
	}
};

// Route handler to delete a notification
export const deleteNotification = async (req, res) => {
	const id = parseInt(req.params.id);
	if (isNaN(id))
		return res.status(400).json({ error: "Invalid notification ID" });

	try {
		const notification = await prisma.notification.delete({
			where: { id },
		});
		return res.status(200).json(notification);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: error.message });
	}
};

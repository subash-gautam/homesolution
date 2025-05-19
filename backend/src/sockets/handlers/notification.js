// Saving expo tokens for pushing notifications.
import prisma from "../../config/db.config.js";
import { Expo } from "expo-server-sdk";

const expo = new Expo();

export const savePushToken = async ({ userId, token }) => {
	console.log("Saving push token:", token);

	try {
		// Upsert (create or update existing)
		await prisma.pushToken.upsert({
			where: { token },
			update: { userId },
			create: {
				userId,
				token,
			},
		});
	} catch (err) {
		console.error("Failed to save push token:", err);
	}
};

// Send push notification
export const sendNotification = async ({ userId, role, title, body }) => {
	const tokens = await prisma.pushToken.findMany({
		where: { AND: { userId, role } },
		select: { token: true },
	});

	const messages = tokens
		.filter(({ token }) => Expo.isExpoPushToken(token))
		.map(({ token }) => ({
			to: token,
			sound: "default",
			title,
			body,
			data: { id: userId, role },
		}));

	try {
		const chunks = expo.chunkPushNotifications(messages);
		for (const chunk of chunks) {
			await expo.sendPushNotificationsAsync(chunk);
		}
	} catch (err) {
		console.error("Push send error:", err);
	}
};

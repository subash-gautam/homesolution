// Saving expo tokens for pushing notifications.
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
export const sendNotification = async ({ userId, title, body }) => {
	const tokens = await prisma.pushToken.findMany({
		where: { userId },
		select: { token: true },
	});

	const messages = tokens
		.filter(({ token }) => Expo.isExpoPushToken(token))
		.map(({ token }) => ({
			to: token,
			sound: "default",
			title,
			body,
			data: { userId },
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

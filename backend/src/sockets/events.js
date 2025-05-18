// src/sockets/events.js
import { onDisconnect } from "./handlers/general.js";
import { savePushToken, sendNotification } from "./handlers/notification.js";
import { getOnlineProviders } from "./onlineUsers.js";
import { handleAuthentication } from "./handlers/authentication.js";

const connectedSockets = new Set();

export const setupSocketEvents = (io) => {
	io.on("connection", (socket) => {
		socket.on("authenticate", async (token) => {
			await handleAuthentication(socket, token, io);
		});

		socket.on("private_message", (message) => {
			io.to(message.receiverId).emit("private_message", message);
		});

		// In your socket setup file (e.g., socket.js)
		socket.on("get_online_Providers", async (serviceId) => {
			const onlineProviders = getOnlineProviders();
			try {
				// Get providers associated with this service
				const providers = await prisma.providerService.findMany({
					where: {
						serviceId: Number(serviceId),
					},
					include: {
						provider: true,
					},
				});

				// Extract provider IDs from the service's providers
				const providerIds = providers.map((p) => p.provider.id);

				// Filter online providers to only those in this service
				const filteredOnlineProviders = onlineProviders.filter((op) =>
					providerIds.includes(op.providerId),
				);

				console.log(
					"Filtered online providers:",
					filteredOnlineProviders,
				);

				// Send both service providers and filtered online status
				socket.emit("online_Providers", {
					providers,
					onlineProviders: filteredOnlineProviders,
				});
			} catch (error) {
				console.error("Error fetching providers:", error);
				socket.emit("error", { message: "Error fetching providers" });
			}
		});

		socket.on("new_chat", (newUser) => {
			io.emit("new_chat", newUser);
		});

		socket.on("disconnect", () => onDisconnect(socket, io));

		socket.on("savePushToken", (token) => {
			if (socket.user) {
				savePushToken(socket.user.id, token);
			} else {
				console.warn(
					"Attempt to save push token without authentication",
				);
			}
		});

		// Set up the sendNotification event emitter
		socket.emit("sendNotification", (data) => {
			if (socket.user) {
				sendNotification(data);
			} else {
				console.warn(
					"Attempt to send notification without authentication",
				);
			}
		});
	});
};

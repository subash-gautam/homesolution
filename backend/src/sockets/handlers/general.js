import { setOnlineUsers, setOnlineProviders } from "../onlineUsers.js";
import { Server } from "socket.io";

/**
 * Handles disconnection of a socket
 * @param {Socket} socket - The socket instance
 * @param {Server} io - The Socket.IO server instance
 */
export const onDisconnect = (socket, io) => {
	try {
		if (!socket.user) {
			console.warn("⚠️ Unauthenticated socket disconnected:", socket.id);
			return;
		}

		const { id, role } = socket.user;
		console.log(`🔌 ${role} disconnected:`, id, socket.id);

		if (role === "user") {
			// Update online users list
			let onlineUsers = [];
			try {
				onlineUsers = Array.from(io.of("/").sockets.values())
					.filter((s) => s.user?.role === "user" && s.user?.id)
					.map((s) => ({
						userId: s.user.id,
						socketId: s.id,
					}));

				setOnlineUsers(onlineUsers);
			} catch (err) {
				console.error("❌ Failed to update online users:", err);
			}

			// Notify providers
			try {
				socket.to("provider").emit("user_status_update", {
					userId: id,
					status: "offline",
				});
			} catch (err) {
				console.error(
					"❌ Failed to notify providers of user offline:",
					err,
				);
			}
		} else if (role === "provider") {
			// Update online providers list
			let onlineProviders = [];
			try {
				onlineProviders = Array.from(io.of("/").sockets.values())
					.filter((s) => s.user?.role === "provider" && s.user?.id)
					.map((s) => ({
						providerId: s.user.id,
						socketId: s.id,
					}));

				setOnlineProviders(onlineProviders);
			} catch (err) {
				console.error("❌ Failed to update online providers:", err);
			}

			// Notify users
			try {
				io.to("user").emit("provider_status_update", {
					providerId: id,
					status: "offline",
				});
			} catch (err) {
				console.error(
					"❌ Failed to notify users of provider offline:",
					err,
				);
			}
		} else {
			console.warn("⚠️ Unknown role disconnected:", role);
		}
	} catch (error) {
		console.error("🔥 Error in onDisconnect handler:", error);
	}
};

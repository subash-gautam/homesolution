import { setOnlineUsers, setOnlineProviders } from "../onlineUsers.js";
export const onDisconnect = (socket) => {
	if (socket.user) {
		console.log(
			"A user disconnected:",
			socket.user.id,
			socket.user.role,
			socket.id,
		);

		// Notify others that this user is offline
		if (socket.user.role === "user") {
			// Update online users list
			const onlineUsers = Array.from(io.of("/").sockets.values())
				.filter((s) => s.user && s.user.id && s.user.role === "user")
				.map((s) => ({
					userId: s.user.id,
					socketId: s.id,
				}));
			setOnlineUsers(onlineUsers);

			socket.to("provider").emit("user_status_update", {
				userId: socket.user.id,
				status: "offline",
			});
		} else if (socket.user.role === "provider") {
			// Update online providers list
			const onlineProviders = Array.from(io.of("/").sockets.values())
				.filter(
					(s) => s.user && s.user.id && s.user.role === "provider",
				)
				.map((s) => ({
					providerId: s.user.id,
					socketId: s.id,
				}));
			setOnlineProviders(onlineProviders);

			io.to("user").emit("provider_status_update", {
				providerId: socket.user.id,
				status: "offline",
			});
		}
	} else {
		console.log("An unauthenticated socket disconnected:", socket.id);
	}
};

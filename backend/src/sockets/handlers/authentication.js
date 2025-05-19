// src/sockets/handlers/authentication.js
import { authenticateSocket } from "../../middleware/auth.js";
import {
	getOnlineUsers,
	getOnlineProviders,
	setOnlineProviders,
	setOnlineUsers,
} from "../onlineUsers.js";

export const handleAuthentication = async (socket, token, io) => {
	try {
		const user = await authenticateSocket(token);
		socket.user = user;
		console.log(
			"User authenticated :: ID: ",
			socket.user.id,
			" Role : ",
			socket.user.role,
		);
		socket.join(socket.user.id);

		// Also join a room based on role for role-specific broadcasts
		if (socket.user.role) {
			socket.join(socket.user.role);
		}

		// Update online users list only with authenticated sockets
		if (socket.user.role === "user") {
			const onlineUsers = Array.from(io.of("/").sockets.values())
				.filter((s) => s.user && s.user.id && s.user.role === "user")
				.map((s) => ({
					userId: s.user.id,
					socketId: s.id,
				}));
			setOnlineUsers(onlineUsers);
			console.log("Online Users: ", getOnlineUsers());
		}

		// Update online providers list only with authenticated sockets
		if (socket.user.role === "provider") {
			const onlineProviders = Array.from(io.of("/").sockets.values())
				.filter(
					(s) => s.user && s.user.id && s.user.role === "provider",
				)
				.map((s) => ({
					providerId: s.user.id,
					socketId: s.id,
				}));
			setOnlineProviders(onlineProviders);
			console.log("Online Providers: ", getOnlineProviders());
		}

		// Notify others that this user is online
		if (socket.user.role === "user") {
			io.to("provider").emit("user_status_update", {
				userId: socket.user.id,
				status: "online",
			});
		} else if (socket.user.role === "provider") {
			io.to("user").emit("provider_status_update", {
				providerId: socket.user.id,
				status: "online",
			});
		}
	} catch (error) {
		console.error("Authentication error:", error);
		socket.emit("auth_error", { message: "Authentication failed" });
	}
};

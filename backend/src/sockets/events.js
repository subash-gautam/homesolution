import { socketAuthentication } from "../middleware/auth.js";
import { savePushToken } from "./handlers/notification.js";
import { sendNotification } from "./handlers/notification.js";
import { setOnlineProviders } from "./onProviders.js";
import { Expo } from "expo-server-sdk";
const expo = new Expo();

const connectedSockets = new Set();

export const setupSocketEvents = (io) => {
	io.use(socketAuthentication);

	io.on("connection", (socket) => {
		if (socket.handshake.auth.token)
			console.log(
				"A user connected with token:",
				socket.handshake.auth.token,
			);
		else console.log("A user connected without token");

		// if (!socket.user || !socket.user.id) {
		// 	// console.error("User data missing after authentication middleware");
		// 	socket.disconnect(true);
		// 	return;
		// }

		socket.join(socket.user.id);

		const onlineUsers = Array.from(io.of("/").sockets.values()).map(
			(s) => ({
				userId: s.user.id,
				socketId: s.id,
			}),
		);

		io.emit("new_notification", {
			userId: socket.user.id,
		});

		// saving online providers
		setOnlineProviders(onlineUsers);

		// io.to(socket.user.id).emit("user_status", onlineUsers);

		console.log("onlineUsers:", onlineUsers);
		io.emit("user_status", onlineUsers);

		socket.on("private_message", (message) => {
			io.to(message.receiverId).emit("private_message", message);
		});

		socket.on("new_chat", (newUser) => {
			io.emit("new_chat", newUser);
		});

		socket.on("disconnect", () => {
			console.log("A user disconnected:", socket.user.id);

			const onlineUsers = Array.from(io.of("/").sockets.values()).map(
				(s) => ({
					userId: s.user.id,
					socketId: s.id,
				}),
			);

			setOnlineProviders(onlineUsers);

			io.emit("user_status", onlineUsers);
		});

		socket.on("savePushToken", savePushToken);
		socket.on("sendNotification", sendNotification);
	});
};

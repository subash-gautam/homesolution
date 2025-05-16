import { authenticateSocket } from "../middleware/auth.js";
import { savePushToken } from "./handlers/notification.js";
import { sendNotification } from "./handlers/notification.js";
import {
	getOnlineUsers,
	getOnlineProviders,
	setOnlineProviders,
	setOnlineUsers,
} from "./onlineUsers.js";
import { Expo } from "expo-server-sdk";
const expo = new Expo();

const connectedSockets = new Set();

export const setupSocketEvents = (io) => {
	io.on("connection", (socket) => {
		socket.on("authenticate", async (token) => {
			const user = await authenticateSocket(token);
			socket.user = user;
			console.log(
				"User authenticated :: ID: ",
				socket.user.id,
				" Role : ",
				socket.user.role,
			);
			socket.join(socket.user.id, socket.user.role);

			if (socket.user.role == "user") {
				const onlineUsers = Array.from(io.of("/").sockets.values()).map(
					(s) => ({
						userId: s.user.id,
						socketId: s.id,
					}),
				);
				setOnlineUsers(onlineUsers);
				console.log("Online Users: ", getOnlineUsers());
			}

			if (socket.user.role == "provider") {
				const onlineProviders = Array.from(
					io.of("/").sockets.values(),
				).map((s) => ({
					userId: s.user.id,
					socketId: s.id,
				}));
				setOnlineProviders(onlineProviders);
				console.log("Online Providers: ", getOnlineProviders());
			}
		});

		socket.on("private_message", (message) => {
			io.to(message.receiverId).emit("private_message", message);
		});

		socket.on("new_chat", (newUser) => {
			io.emit("new_chat", newUser);
		});

		socket.on("disconnect", () => {
			console.log("A user disconnected:", socket?.user?.id);

			// setOnlineProviders(onlineUsers);

			// io.emit("user_status", onlineUsers);
		});

		socket.on("savePushToken", savePushToken);
		socket.emit("sendNotification", sendNotification);
	});
};

// PREVIOUS CODE NOW COMMENTED FOR BACKUP

// socket.join(socket.user.id);

// const onlineUsers = Array.from(io.of("/").sockets.values()).map(
// 	(s) => ({
// 		userId: s.user.id,
// 		socketId: s.id,
// 	}),
// );

// io.emit("new_notification", {
// 	userId: socket.user.id,
// });

// saving online providers
// setOnlineProviders(onlineUsers);

// io.to(socket.user.id).emit("user_status", onlineUsers);

// console.log("onlineUsers:", onlineUsers);
// io.emit("user_status", onlineUsers);

// const onlineUsers = Array.from(io.of("/").sockets.values()).map(
// 	(s) => ({
// 		userId: s.user.id,
// 		socketId: s.id,
// 	}),
// );

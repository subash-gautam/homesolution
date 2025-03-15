import { authenticateSocket } from "../middleware/auth.js";
import { handleMessage } from "./handlers.js";
import { setOnlineProviders } from "./onProviders.js";

const connectedSockets = new Set();

export const setupSocketEvents = (io) => {
	io.use(async (socket, next) => {
		console.log("Authentication middleware started");
		try {
			const token = socket.handshake.auth.token;
			console.log("Token received:", token);
			const decoded = await authenticateSocket(token);
			socket.user = decoded;
			console.log("Decoded user:", socket.user);
			next();
		} catch (err) {
			console.error("Authentication error:", err);
			next(new Error("Invalid token"));
		}
	});

	io.on("connection", (socket) => {
		console.log(
			"A user connected with token:",
			socket.handshake.auth.token,
		);

		if (!socket.user || !socket.user.id) {
			console.error("User data missing after authentication middleware");
			socket.disconnect(true);
			return;
		}

		socket.join(socket.user.id);

		const onlineUsers = Array.from(io.of("/").sockets.values()).map(
			(s) => ({
				userId: s.user.id,
				socketId: s.id,
			}),
		);

		// io.emit("new_notification", {
		// 	userId: socket.user.id,
		// });

		// saving online providers
		setOnlineProviders(onlineUsers);

		io.to(socket.user.id).emit("user_status", onlineUsers);

		console.log("onlineUsers:", onlineUsers);
		io.emit("user_status", onlineUsers);

		socket.on("test1", (data) => {
			console.log("test data : ", data);
		});

		socket.emit("test2", "Testing 2 from server");

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
	});
};

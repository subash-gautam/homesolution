import { authenticateToken } from "../middleware/auth.js";
import { handleMessage } from "./handlers.js"; // Import handler functions

export const setupSocketEvents = (io) => {
	io.on("connection", (socket) => {
		const authentication = authenticateToken(socket.handshake);
		if (!authentication) {
			socket.disconnect();
			return;
		}

		const { userId } = req.user.id;
		const { role } = req.user.role;

		socket.customId = `${role}-${userId}`;

		console.log(`🟢 User connected: ${socket.customId}`);

		socket.on("message", (data) => {
			console.log(`📩 Message from ${socket.customId}:`, data);
			io.emit("message", { userId: socket.customId, text: data });
		});

		socket.on("disconnect", () => {
			console.log(`🔴 User disconnected: ${socket.customId}`);
		});
	});
};

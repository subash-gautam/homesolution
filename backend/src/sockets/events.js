import { authenticateSocket } from "../middleware/auth.js";
import { handleMessage } from "./handlers.js";

const connectedSockets = new Set();

export const setupSocketEvents = (io) => {
	io.on("connection", async (socket) => {
		const clientId = socket.handshake.query.clientId;

		if (connectedSockets.has(clientId)) {
			console.log(`Duplicate connection attempt from ${clientId}`);
			socket.disconnect();
			return;
		}

		console.log("New connection attempt...");

		try {
			const user = await authenticateSocket(socket);
			socket.customId = user ? `${user.role}-${user.id}` : socket.id;
			connectedSockets.add(clientId);

			console.log(`🟢 User connected: ${socket.customId}`);

			socket.on("message", (data) => handleMessage(io, socket, data));

			socket.on("disconnect", () => {
				console.log(`🔴 User disconnected: ${socket.customId}`);
				connectedSockets.delete(clientId);
			});
		} catch (error) {
			console.error("Socket connection error:", error);
			socket.disconnect();
		}
	});
};

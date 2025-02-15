import { Server } from "socket.io";
import { setupSocketEvents } from "./events.js";

export const initializeSocket = (server) => {
	const io = new Server(server, {
		cors: {
			origin: "http://localhost:5173",
			methods: ["GET", "POST"],
			credentials: true,
		},
	});

	setupSocketEvents(io);
	console.log("✅ Socket.IO initialized");
	return io;
};

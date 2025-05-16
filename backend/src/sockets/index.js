import { Server } from "socket.io";
import { setupSocketEvents } from "./events.js";

export const initializeSocket = (server, app) => {
	const io = new Server(server, {
		cors: {
			origin: "*",
			methods: ["*"],
			credentials: true,
		},
	});
	app.set("socket", io);
	setupSocketEvents(io);

	console.log("✅ Socket.IO initialized");
	return io;
};

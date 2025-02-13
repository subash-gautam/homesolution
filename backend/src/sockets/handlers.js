export const handleMessage = (io, socket, data) => {
	console.log("📩 Message received:", data);
	io.emit("message", data); // Broadcast to all clients
};

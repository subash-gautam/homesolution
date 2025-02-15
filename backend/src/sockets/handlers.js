export const handleMessage = (io, socket, data) => {
	try {
		console.log("📩 Message received from", socket.customId, ":", data);
		io.emit("message", {
			userId: socket.customId,
			text: data,
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		console.error("Error handling message:", error);
		socket.emit("error", "Failed to process message");
	}
};

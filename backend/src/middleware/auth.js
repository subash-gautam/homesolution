import jwt from "jsonwebtoken";

export const generateToken = (id, role) => {
	return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export const authenticateToken = async (req, res, next) => {
	const token = req.header("Authorization")?.split(" ")[1];
	if (!token) {
		return res
			.status(401)
			.json({ error: "Access denied, no token provided" });
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (error) {
		res.status(400).json({ error: "Session expired !!" });
	}
};

// Function for Socket.IO (Extracts token from handshake headers)
export const authenticateSocket = async (socket) => {
	try {
		const token = socket.handshake.auth.token;

		if (!token) {
			throw new Error("No token provided");
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		return {
			id: decoded.id,
			role: decoded.role,
		};
	} catch (error) {
		console.error("Socket authentication error:", error.message);
		return null;
	}
};

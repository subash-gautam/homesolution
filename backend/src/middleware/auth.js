import jwt from "jsonwebtoken";

export const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export const authenticateToken = (req, res, next) => {
	const token = req.header("Authorization")?.split(" ")[1];
	if (!token) {
		return res
			.status(401)
			.json({ error: "Access denied, no token provided" });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		console.log(decoded, "and ", req.user);
		next();
	} catch (error) {
		res.status(400).json({ error: "Invalid token" });
	}
};

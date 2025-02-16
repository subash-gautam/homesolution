import prisma from "../config/db.config.js";
import { hashPassword, comparePassword } from "../utils/passwordUtils.js";
import { generateToken } from "../middleware/auth.js";

const validateCredentials = (username, password) => {
	if (!username || !password) {
		throw new Error("Username and password are required");
	}
};

export const createAdmin = async (req, res) => {
	const { username, password } = req.body;

	try {
		validateCredentials(username, password);

		const existingAdmin = await prisma.admin.findFirst();

		if (existingAdmin) {
			return res.status(400).json({
				error: "Admin already exists, This is single admin system",
			});
		}

		const hashedPassword = await hashPassword(password);

		const admin = await prisma.admin.create({
			data: {
				username,
				password: hashedPassword,
			},
		});

		res.status(200).json(admin);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const adminLogin = async (req, res) => {
	const { username, password } = req.body;

	try {
		validateCredentials(username, password);

		const admin = await prisma.admin.findFirst({
			where: { username },
		});

		if (!admin) {
			return res.status(401).json({ error: "Admin not found" });
		}

		const validPassword = await comparePassword(password, admin.password);

		if (!validPassword) {
			return res.status(401).json({ error: "Invalid password" });
		}

		const token = generateToken(admin.id, "admin");

		res.status(200).json({
			message: "Admin logged in successfully",
			token,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const dashboardStats = async (req, res) => {
	try {
		const totalUsers = await prisma.user.count();
		const totalProviders = await prisma.provider.count();
		const totalBookings = await prisma.booking.count();
		const totalRevenue = await prisma.booking.aggregate({
			_sum: {
				amount: true,
			},
		});
		const pendingVerifications = await prisma.provider.count({
			where: {
				NOT: {
					verificationStatus: "verified",
				},
			},
		});
		const recentBookings = await prisma.booking.findMany({
			take: 4,
			orderBy: {
				bookedAt: "desc",
			},
		});

		res.status(200).json({
			totalUsers,
			totalProviders,
			totalBookings,
			totalRevenue: totalRevenue._sum.amount,
			recentBookings,
			pendingVerifications,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const reviewDocument = async (req, res) => {
	const { documentId, comment, status } = req.body;
	if (!documentId || !comment || !status) {
		return res
			.status(400)
			.json({ error: "documentId, comment and status are required" });
	}

	try {
		const lastReview = Date.now();

		const document = await prisma.document.update({
			where: {
				id: documentId,
			},
			data: {
				comment,
				status,
				lastReview: new Date(),
			},
		});

		res.status(200).json(document);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
};

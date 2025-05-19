import prisma from "../config/db.config.js";
import { generateToken } from "../middleware/auth.js";
import { comparePassword, hashPassword } from "../utils/passwordUtils.js";
import { deleteFile } from "../middleware/fileOperation.js";

export const createUser = async (req, res) => {
	const { name, phone, password } = req.body;

	if (!name || !phone || !password) {
		if (!name) {
			return res.status(400).json({ error: "Name is required" });
		}
		if (!phone) {
			return res.status(400).json({ error: "Phone is required" });
		}
		if (!password) {
			return res.status(400).json({ error: "Password is required" });
		}
	}
	if (password.length < 3) {
		return res
			.status(400)
			.json({ error: "Password should be at least 3 characters" });
	}

	if (phone) {
		const existingPhone = await prisma.user.findFirst({
			where: {
				phone,
			},
		});
		if (existingPhone) {
			return res
				.status(400)
				.json({ error: "Phone number already registered ..." });
		}
	}

	try {
		const hashedPassword = await hashPassword(password);
		const user = await prisma.user.create({
			data: {
				name,
				phone,
				password: hashedPassword,
			},
		});
		const token = generateToken(user.id, "user");

		res.status(201).json({
			user,
			token,
			message: "User created successfully",
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const getUsers = async (req, res) => {
	try {
		const users = await prisma.user.findMany({
			include: {
				_count: {
					select: {
						bookings: true,
					},
				},
			},
		});
		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const loginUser = async (req, res) => {
	const { phone, password } = req.body;

	if (!phone || !password) {
		if (!phone) {
			return res.status(400).json({ error: "Phone is required" });
		}
		if (!password) {
			return res.status(400).json({ error: "Password is required" });
		}
	}

	const user = await prisma.user.findFirst({
		where: {
			phone,
		},
	});

	if (!user) {
		return res.status(400).json({
			error: "User associated with this phone number not found",
		});
	}

	const validPassword = await comparePassword(password, user.password);

	if (!validPassword) {
		return res.status(400).json({ error: "Invalid password" });
	}

	const token = generateToken(user.id, "user");

	res.status(200).json({ message: "Login successful", user, token });
};

export const getUser = async (req, res) => {
	const id = req.params.id;

	try {
		const user = await prisma.user.findUnique({
			where: {
				id: Number(id),
			},
			include: {
				bookings: true,
			},
		});
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
		return res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const updateUser = async (req, res) => {
	const id = req.user.id;
	const existingUser = await prisma.user.findUnique({
		where: {
			id: Number(id),
		},
	});

	if (!existingUser) {
		return res.status(404).json({ error: "User not found" });
	}

	const { name, phone, lat, lon } = req.body;
	const profile = req.file?.filename;

	if (!name && !phone && !lat && !lon && !profile) {
		return res
			.status(400)
			.json({ error: "No fields are subjected to update..." });
	}

	console.log("profile");
	if (profile) {
		console.log("id", id);
		const user = await prisma.user.findUnique({
			where: {
				id: Number(id),
			},
		});
		console.log(user);
		if (user.profile) {
			deleteFile(user.profile);
		}
	}

	try {
		const user = await prisma.user.update({
			where: {
				id: Number(id),
			},
			data: {
				name,
				phone,
				lat: parseFloat(lat),
				lon: parseFloat(lon),
				profile,
			},
		});
		res.status(200).json({ user, message: "User updated successfully" });
	} catch (error) {
		if (profile) deleteFile(profile);
		console.error(error); // Logs the full error object, including stack trace
		res.status(500).json({ error: error.message });
	}
};

export const updateUserProfile = async (req, res) => {
	try {
		const id = req.user.id;
		const profile = req.file?.filename;
		console.log(profile, req.file);

		if (!profile) {
			return res.status(400).json({ error: "Image is required..." });
		}

		console.log("profile");

		const existingUser = await prisma.user.findUnique({
			where: {
				id, // Use id directly (assuming it's a UUID string; if it's a number, ensure req.user.id is a number)
			},
		});

		if (existingUser?.profile) {
			try {
				deleteFile(existingUser.profile);
			} catch (fileError) {
				console.error(
					"Error deleting previous profile picture:",
					fileError,
				);
			}
		}

		const updatedUser = await prisma.user.update({
			where: {
				id,
			},
			data: {
				profile,
			},
		});

		res.status(200).json({
			user: updatedUser,
			message: "Profile Picture updated successfully",
		});
	} catch (error) {
		console.error("Error updating profile:", error);
		res.status(500).json({ error: error.message });
	}
};

export const deleteUser = async (req, res) => {
	const id = req.user.id;

	const user = await prisma.user.findUnique({
		where: {
			id: Number(id),
		},
	});
	if (!user) {
		return res.status(400).json({ error: "User not found" });
	}

	if (user.profile) {
		deleteFile(user.profile);
	}

	try {
		await prisma.user.delete({
			where: {
				id: Number(id),
			},
		});
		res.status(200).json({ message: "User deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const resetPassword = async (req, res) => {
	const { email } = req.body;
	const user = await prisma.user.findUnique({
		where: {
			email,
		},
	});
	if (!user) {
		return res
			.status(404)
			.json({ error: "User not found with this email." });
	}
	const token = generateToken(user.id, "reset");
	const resetLink = `http://localhost:3000/reset/${token}`;
	console.log(resetLink);
	try {
		await sendEmail(email, "Password Reset Link", resetLink);
		res.status(200).json({
			message: "Password reset link sent successfully",
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const setUserAddress = async (req, res) => {
	const id = req.user.id;
	const { lat, lon } = req.body;
	try {
		const user = await prisma.user.findUnique({
			where: {
				id: Number(id),
			},
		});
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
		await prisma.user.update({
			where: {
				id: Number(id),
			},
			data: {
				lat: parseFloat(lat),
				lon: parseFloat(lon),
			},
		});
		res.status(200).json({ message: "Address updated successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const updatePassword = async (req, res) => {
	const { password, newPassword } = req.body;
	const id = req.user.id;
	const user = await prisma.user.findUnique({
		where: {
			id: Number(id),
		},
	});

	if (!user) {
		return res.status(404).json({ error: "User not found" });
	}
	const validPassword = await comparePassword(password, user.password);
	if (!validPassword) {
		return res.status(400).json({ error: "Invalid password" });
	}
	const hashedPassword = await hashPassword(newPassword);
	try {
		await prisma.user.update({
			where: {
				id: Number(id),
			},
			data: {
				password: hashedPassword,
			},
		});
		res.status(200).json({ message: "Password updated successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

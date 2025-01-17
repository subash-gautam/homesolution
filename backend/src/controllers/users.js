import prisma from "../config/db.config.js";
import { generateToken } from "../middleware/auth.js";
import { comparePassword, hashPassword } from "../utils/passwordUtils.js";

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
	if (password.length < 6) {
		return res
			.status(400)
			.json({ error: "Password should be at least 6 characters" });
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
				.json({ error: "Phone number already exists" });
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
		const token = generateToken(user.id);

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
		const users = await prisma.user.findMany();
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

	const token = await generateToken(user.id);

	res.status(200).json({ message: "Login successful", token });
};

export const getUser = async (req, res) => {
	const id = req.params.id;

	try {
		const user = await prisma.user.findUnique({
			where: {
				id: Number(id),
			},
		});
		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const updateUser = async (req, res) => {
	const id = req.params.id;
	const { name, phone, password, lat, lon, profile } = req.body;

	if (!name && !phone && !password && !lat && !lon && !profile) {
		return res
			.status(400)
			.json({ error: "No fields are subjected to update..." });
	}

	// Some work to do with profile image...

	const hashedPassword = await hashPassword(password);

	try {
		const user = await prisma.user.update({
			where: {
				id: Number(id),
			},
			data: {
				name,
				phone,
				password: hashedPassword,
				lat,
				lon,
				profile,
			},
		});
		res.status(200).json({ user, message: "User updated successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const deleteUser = async (req, res) => {
	const id = req.params.id;

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

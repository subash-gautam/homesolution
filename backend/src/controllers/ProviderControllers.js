import prisma from "../config/db.config.js";
import { hashPassword, comparePassword } from "../utils/passwordUtils.js";
import { generateToken } from "../middleware/auth.js";
import { deleteFile } from "../middleware/fileOperation.js";

export const createProvider = async (req, res) => {
	const { name, phone, password, address, city } = req.body;

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

	const hashedPassword = await hashPassword(password);
	try {
		const provider = await prisma.Provider.create({
			data: {
				name,
				phone,
				password: hashedPassword,
				address,
				city,
			},
		});
		const token = generateToken(provider.id);
		res.json({ message: "Signup Successful", provider, token });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error creating provider" });
	}
};

export const providerLogin = async (req, res) => {
	const { phone, password } = req.body;

	if (!phone || !password) {
		if (!phone) {
			return res.status(400).json({ error: "Phone is required" });
		}
		if (!password) {
			return res.status(400).json({ error: "Password is required" });
		}
	}

	const provider = await prisma.provider.findFirst({
		where: {
			phone,
		},
	});

	if (!provider) {
		return res.status(400).json({ error: "Invalid phone number" });
	}

	const isMatch = await comparePassword(password, provider.password);

	if (!isMatch) {
		return res.status(400).json({ error: "Invalid password" });
	}

	const token = generateToken(provider.id);
	res.json({ message: "Login Succssful !! ", provider, token });
};

export const getProviders = async (req, res) => {
	try {
		const providers = await prisma.provider.findMany();
		res.json(providers);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const getProviderById = async (req, res) => {
	const { id } = req.params;
	try {
		const provider = await prisma.provider.findUnique({
			where: {
				id: parseInt(id),
			},
		});
		res.json(provider);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const updateProvider = async (req, res) => {
	const id = req.user.id;
	const { name, phone, address, city, lat, lon } = req.body;
	const profile = req.file.filename;

	if (!name && !phone && !address && !city && !lat && !lon && !profile) {
		return res
			.status(400)
			.json({ error: "Nothing is subjected to change !!" });
	}
	try {
		const provider = await prisma.provider.findUnique({
			where: {
				id: parseInt(id),
			},
		});

		if (!provider) {
			return res.status(400).json({ error: "Provider not found" });
		}
		if (profile && provider.profile) {
			deleteFile(provider.profile);
		}

		const updatedProvider = await prisma.provider.update({
			where: {
				id: parseInt(id),
			},
			data: {
				name,
				phone,
				address,
				city,
				lat: parseFloat(lat),
				lon: parseFloat(lon),
				profile,
			},
		});
		res.json({
			message: "Provider account updated successfully",
			updatedProvider,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const deleteProvider = async (req, res) => {
	const id = req.user.id;

	const provider = await prisma.provider.findUnique({
		where: {
			id: parseInt(id),
		},
	});

	if (!provider) {
		return res.status(400).json({ error: "Provider not found" });
	}

	if (provider.profile) {
		deleteFile(provider.profile);
	}

	try {
		await prisma.provider.delete({
			where: {
				id: parseInt(id),
			},
		});
		res.json({ message: "Provider account deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

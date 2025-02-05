import prisma from "../config/db.config.js";
import { hashPassword, comparePassword } from "../utils/passwordUtils.js";
import { generateToken } from "../middleware/auth.js";
import { deleteFile } from "../middleware/fileOperation.js";

export const createProvider = async (req, res) => {
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

	const hashedPassword = await hashPassword(password);

	const existingPhone = await prisma.provider.findFirst({
		where: {
			phone,
		},
	});

	if (existingPhone) {
		return res.status(400).json({ error: "Phone number already exists" });
	}

	try {
		const provider = await prisma.Provider.create({
			data: {
				name,
				phone,
				password: hashedPassword,
			},
		});
		const token = generateToken(provider.id, "provider");
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
		include: {
			_count: {
				select: {
					bookings: {
						where: {
							bookingStatus: "completed",
						},
					},
				},
			},
		},
	});

	if (!provider) {
		return res.status(400).json({ error: "Invalid phone number" });
	}

	const isMatch = await comparePassword(password, provider.password);

	if (!isMatch) {
		return res.status(400).json({ error: "Invalid password" });
	}

	const token = generateToken(provider.id, "provider");
	res.json({ message: "Login Succssful !! ", provider, token });
};

export const getProviders = async (req, res) => {
	// if (req.user.role !== "admin")
	// return res.status(401).json({ error: "Unauthorized access" });
	try {
		const providers = await prisma.provider.findMany({
			include: {
				_count: {
					select: {
						services: true,
						bookings: true,
					},
				},
			},
		});
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
			include: {
				services: true,
				bookings: true,
			},
		});
		res.json(provider);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
};

export const updateProfile = async (req, res) => {
	const id = req.user.id;
	const profile = req.file.filename;

	if (!profile) {
		return res
			.status(400)
			.json({ error: "No profile image has been uploaded..." });
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

		if (provider.profile) {
			deleteFile(provider.profile);
		}

		const updatedProvider = await prisma.provider.update({
			where: {
				id: parseInt(id),
			},
			data: {
				profile,
			},
		});

		res.json({
			message: "Profile Picture updated successfully",
			updatedProvider,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
};

export const updateDocument = async (req, res) => {
	const id = req.user.id;

	const document = req.file.filename;

	if (!document) {
		return res
			.status(400)
			.json({ error: "No document image has been uploaded..." });
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

		if (provider.document) {
			deleteFile(provider.document);
		}

		const updatedProvider = await prisma.provider.update({
			where: {
				id: parseInt(id),
			},
			data: {
				document,
			},
		});

		res.json({
			message: "Document updated successfully",
			updatedProvider,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
};

export const updateProvider = async (req, res) => {
	const id = req.user.id; // Ensure id is correctly formatted (UUID or integer)
	const {
		name,
		phone,
		email,
		password,
		ratePerHr,
		address,
		city,
		lat,
		lon,
		bio,
	} = req.body;

	if (
		!name &&
		!phone &&
		!email &&
		!password &&
		!ratePerHr &&
		!address &&
		!city &&
		!lat &&
		!lon &&
		!bio
	) {
		return res
			.status(400)
			.json({ error: "Nothing is subjected to change !!" });
	}

	try {
		// Find the provider by ID
		const provider = await prisma.provider.findUnique({
			where: { id },
		});

		if (!provider) {
			return res.status(400).json({ error: "Provider not found" });
		}

		// Check for uniqueness of phone and email
		if (phone) {
			const existingProviderWithPhone = await prisma.provider.findFirst({
				where: {
					phone: phone,
					NOT: { id }, // Exclude current provider
				},
			});

			if (existingProviderWithPhone) {
				return res.status(400).json({
					error: "Phone number is already in use by another provider.",
				});
			}
		}

		if (email) {
			const existingProviderWithEmail = await prisma.provider.findFirst({
				where: {
					email: email,
					NOT: { id }, // Exclude current provider
				},
			});

			if (existingProviderWithEmail) {
				return res.status(400).json({
					error: "Email is already in use by another provider.",
				});
			}
		}

		// Update the provider with new data
		const updatedProvider = await prisma.provider.update({
			where: { id },
			data: {
				name: name || provider.name,
				phone: phone || provider.phone,
				email: email || provider.email,
				ratePerHr: parseFloat(ratePerHr) || provider.ratePerHr,
				address: address || provider.address,
				city: city || provider.city,
				lat:
					lat !== undefined && lat !== ""
						? parseFloat(lat)
						: provider.lat,
				lon:
					lon !== undefined && lon !== ""
						? parseFloat(lon)
						: provider.lon,
				bio: bio || provider.bio,
			},
		});

		// Return the updated provider
		res.json({
			message: "Provider account updated successfully",
			updatedProvider,
		});
	} catch (error) {
		console.error("Update provider error:", error);
		res.status(500).json({ error: "Internal server error" });
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
	if (provider.document) {
		deleteFile(provider.document);
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

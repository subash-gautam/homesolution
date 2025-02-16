import prisma from "../config/db.config.js";
import { hashPassword, comparePassword } from "../utils/passwordUtils.js";
import { generateToken } from "../middleware/auth.js";
import { deleteFile } from "../middleware/fileOperation.js";
import { sendEmail } from "../middleware/mailer.js";

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
		const provider = await prisma.provider.create({
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
	const {
		name,
		phone,
		email,
		city,
		address,
		minRate,
		maxRate,
		varificationStatus,
	} = req.query;

	const filter = [];

	if (name) filter.push({ name: { contains: name } });
	if (phone) filter.push({ phone: phone });
	if (email) filter.push({ email: email });
	if (city) filter.push({ city: city });
	if (address) filter.push({ address: address });
	if (minRate) filter.push({ ratePerHr: { gte: parseFloat(minRate) } });
	if (maxRate) filter.push({ ratePerHr: { lte: parseFloat(maxRate) } });
	if (varificationStatus)
		filter.push({ varificationStatus: varificationStatus });

	try {
		const providers = await prisma.provider.findMany({
			where: { AND: filter },
			include: {
				document: true,
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
	const id = req.params.id;
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

		if (provider.documentId) {
			const document = await prisma.document.findUnique({
				where: {
					id: provider.documentId,
				},
			});

			deleteFile(document.name);
			await prisma.document.delete({
				where: { id: provider.documentId },
			});
		}

		const newDocument = await prisma.document.create({
			data: {
				providerId: parseInt(id),
				name: document,
			},
		});

		const documentId = newDocument.id;

		const updatedProvider = await prisma.provider.update({
			where: {
				id: parseInt(id),
			},
			data: {
				documentId,
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
		if (provider.documentId) {
			const document = await prisma.document.findUnique({
				where: {
					id: provider.documentId,
				},
			});

			deleteFile(document.name);
			await prisma.document.delete({
				where: { id: provider.documentId },
			});
		}

		await prisma.provider.delete({
			where: {
				id: parseInt(id),
			},
		});
		res.json({ message: "Provider account deleted successfully" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
};

export const getDocuments = async (req, res) => {
	const role = req.user.role;
	console.log(role, req.user.id);

	if (role !== "admin" && role !== "provider")
		return res.status(401).json({ error: "Unauthorized access..." });

	const { id, providerId, status, uploadedAt, lastReview, comment } =
		req.query;

	const filter = [];

	if (id) filter.push({ id: parseInt(id) });
	if (providerId) filter.push({ providerId: parseInt(providerId) });
	if (status) filter.push({ status: status });
	if (uploadedAt) filter.push({ uploadedAt: new Date(uploadedAt) });
	if (lastReview) filter.push({ lastReview: new Date(lastReview) });
	if (comment) filter.push({ comment: comment });

	try {
		const documents = await prisma.document.findMany({
			where: { AND: filter },
		});

		res.json(documents);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
};

export const verifyProvider = async (req, res) => {
	if (req.user.role !== "admin")
		return res.status(401).json({ error: "Unauthorized access..." });

	const { providerId, status } = req.body;

	if (!providerId || !status) {
		if (!providerId) {
			return res.status(400).json({ error: "Provider ID is required" });
		}
		if (!status) {
			return res
				.status(400)
				.json({ error: "Status is required to change verification.." });
		}
	}

	try {
		const provider = await prisma.provider.findUnique({
			where: {
				id: parseInt(providerId),
			},
		});

		if (!provider) {
			return res.status(404).json({ error: "Provider not found" });
		}

		const updatedProvider = await prisma.provider.update({
			where: {
				id: parseInt(providerId),
			},
			data: {
				verificationStatus: status,
			},
		});

		const mail = await sendEmail(
			provider.email,
			"Verification Status",
			`Your verification status has been changed to ${status}`,
		);
		console.log("Mail sent..", mail);

		res.json({
			message: "Provider verification status updated successfully",
			updatedProvider,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
};

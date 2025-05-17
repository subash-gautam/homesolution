import prisma from "../config/db.config.js";
import { deleteFile } from "../middleware/fileOperation.js";

//  Create a service category
export const createServiceCategory = async (req, res) => {
	try {
		const { name } = req.body;
		const image = req.file ? req.file.filename : null;
		console.log(image);
		if (!name || !image) {
      return res.status(400).json({
        error: !name
          ? "Category name is required"
          : "Category image is required",
      });
    }//sends multiple responses, and thus crashing the server
		// if (!name || !image) {
		// 	if (!name) {
		// 		res.status(400).json({ error: "Category name is required" });
		// 	}
		// 	if (!image) {
		// 		res.status(400).json({
		// 			error: "Category image must have a image of it",
		// 		});
		// 	}
		// }

		const category = await prisma.category.findMany({
			where: {
				name: {
					equals: name,
					mode: "insensitive",
				},
			},
		});

		if (category.length > 0) {
			console.log(category);
			deleteFile(image);
			return res.status(400).json({ error: "Category already exists" });
		}

		const newCategory = await prisma.category.create({
			data: {
				name,
				image,
			},
		});
		res.status(201).json(newCategory);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
};

// Get service categoruies
export const getCategories = async (req, res) => {
	try {
		const categories = await prisma.category.findMany({
			orderBy: {
				services: {
					_count: "desc",
				},
			},
		});
		res.status(200).json(categories);
	} catch (error) {
		console.error("Database error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Update a service category
export const updateServiceCategory = async (req, res) => {
	try {
		const { id } = req.params;
		const { name } = req.body;
		const image = req.file ? req.file.filename : null;

		// Check if at least one field is provided for update
		if (!name && !image) {
			return res.status(400).json({
				error: "No fields are provided for update...",
			});
		}

		// Check if the category exists
		const existingCategory = await prisma.category.findUnique({
			where: { id: Number(id) },
		});

		if (!existingCategory) {
			deleteFile(image);
			return res.status(404).json({ error: "Category not found" });
		}

		const existingName = await prisma.category.findMany({
			where: {
				name: name,
				NOT: {
					id: Number(id), // Exclude the current category by its ID
				},
			},
		});

		if (existingName.length > 0) {
			deleteFile(image);
			return res.status(400).json({ error: "Category already exists" });
		}

		if (!existingCategory) {
			return res.status(404).json({ error: "Category not found" });
		}

		// Delete the old image if a new image is provided
		if (image && existingCategory.image) {
			deleteFile(existingCategory.image);
		}

		// Prepare the data for update
		const updateData = {};
		if (name) updateData.name = name;
		if (image) updateData.image = image;

		// Update the category
		const category = await prisma.category.update({
			where: { id: Number(id) },
			data: updateData,
		});

		res.status(200).json(category);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: error.message });
	}
};

// remove a service category
export const removeServiceCategory = async (req, res) => {
	try {
		const { id } = req.params;
		const existingCategory = await prisma.category.findUnique({
			where: { id: Number(id) },
		});
		if (!existingCategory) {
			return res.status(404).json({ error: "Category not found" });
		}
		if (existingCategory.image) {
			console.log("file deleted");
			deleteFile(existingCategory.image);
		}
		const deletedCategory = await prisma.category.delete({
			where: { id: Number(id) },
		});
		res.status(200).json(deletedCategory);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
};

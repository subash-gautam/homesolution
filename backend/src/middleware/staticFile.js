import path from "path";
import { fileURLToPath } from "url";
import express from "express";

// Get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to configure static file serving
const configureStatic = (app) => {
  const uploadsPath = path.join(__dirname, "../../uploads");
  app.use("/uploads", express.static(uploadsPath));
};

export default configureStatic;

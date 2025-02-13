import express from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";

import { initializeSocket } from "./src/socket/index.js";

const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(express.json());

import routes from "./src/routes/index.js";
import configureStatic from "./src/middleware/staticFile.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

// Use static file-serving middleware for the folder uploads
configureStatic(app);
initializeSocket(server);

app.get("/", (req, res) => {
	res.status(200).json({ message: "Server is awake !!" });
});

// Handling the routes
app.use("/api", routes);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

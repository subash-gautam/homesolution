import express from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import { initializeSocket } from "./src/sockets/index.js";

const app = express();
const server = http.createServer(app);

dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "*",
  credentials: true
}));

app.use(express.json());

import routes from "./src/routes/index.js";
import configureStatic from "./src/middleware/staticFile.js";

configureStatic(app);
initializeSocket(server);
app.use("/api", routes);

server.listen(PORT, () => {
	console.log(`🚀 Server running on port ${PORT}`);
});

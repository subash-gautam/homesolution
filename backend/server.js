import express from "express";
import dotenv from "dotenv";
import routes from "./src/routes/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
	res.status(200).json({ message: "Server is awake !!" });
});

// Handling the routes
app.use("/api", routes);

app.listen(PORT, () => {
	console.log(`Server is running on PORT ${PORT}`);
});

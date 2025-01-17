import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
	res.status(200).json({ message: "Server is awake !!" });
});

app.listen(PORT, () => {
	console.log(`Server is running on PORT ${PORT}`);
});

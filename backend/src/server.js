// import express, { Request, Response } from "express";
// import dotenv from "dotenv";
const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
	res.status(200).json({ message: "Server is awake !!" });
});

// Users
// app.use("/users", require("./routes/users")); // Assuming users.ts exists

app.listen(PORT, () => {
	console.log(`Server is running on PORT ${PORT}`);
});

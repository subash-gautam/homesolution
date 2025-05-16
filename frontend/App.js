// App.js
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./src/components/AuthContext";
import { ThemeProvider } from "./src/context/ThemeContext"; // Import ThemeProvider
import StackNavigator from "./src/screens/navigator/StackNavigator";

import { socket } from "./src/utils/api";

const App = () => {
	useEffect(() => {
		// Log the socket object
		console.log("Socket object:", socket);

		// Called when connected
		const onConnect = () => {
			console.log("✅ Socket connected!");

			// Emit test1 only after connection is established
			socket.emit("test1", "Testing 1 from client");

			// Optional: watch for protocol upgrade
			socket.io.engine.on("upgrade", (transport) => {
				console.log("Socket upgraded to:", transport.name);
			});
		};

		// Called when disconnected
		const onDisconnect = () => {
			console.log("❌ Socket disconnected.");
		};

		// Attach listeners
		socket.on("connect", onConnect);
		socket.on("disconnect", onDisconnect);

		// Listen for test2 event from server
		socket.on("test2", (data) => {
			console.log("📩 Received test2 data from server:", data);
		});

		// Clean up on unmount
		return () => {
			socket.off("connect", onConnect);
			socket.off("disconnect", onDisconnect);
			socket.off("test2");
		};
	}, []);

	return (
		<ThemeProvider>
			<AuthProvider>
				<NavigationContainer>
					<StackNavigator />
				</NavigationContainer>
			</AuthProvider>
		</ThemeProvider>
	);
};

export default App;

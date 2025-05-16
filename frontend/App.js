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

		// Clean up on unmount
		return () => {
			socket.off("connect", onConnect);
			socket.off("disconnect", onDisconnect);
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

// App.js
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./src/components/AuthContext";
import { ThemeProvider } from "./src/context/ThemeContext"; // Import ThemeProvider
import StackNavigator from "./src/screens/navigator/StackNavigator";
import Notifications, {
	registerForPushNotificationsAsync,
	setupNotificationListeners,
	registerPushToken,
} from "./src/utils/Notifications1";

import { socket } from "./src/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const App = () => {
	const [expoPushToken, setExpoPushToken] = useState("");
	const token = AsyncStorage.getItem("userToken");

	useEffect(() => {
		const initNotifications = async () => {
			const pushToken = await registerForPushNotificationsAsync();
			if (pushToken) {
				setExpoPushToken(pushToken);
				console.log("Push token registered:", pushToken);
				console.info("Notification wala useEffect running.....");
				registerPushToken(token, pushToken);
			}
		};

		initNotifications();
		const { notificationListener, responseListener } =
			setupNotificationListeners();

		return () => {
			Notifications.removeNotificationSubscription(notificationListener);
			Notifications.removeNotificationSubscription(responseListener);
		};
	}, [AsyncStorage.getItem("userToken")]);

	useEffect(() => {
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

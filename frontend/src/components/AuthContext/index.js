import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { socket } from "../../utils/api";
import {
	registerForPushNotificationsAsync,
	registerPushToken,
} from "../../utils/Notifications1"; // Adjust path if needed

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [userToken, setUserToken] = useState(null);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	// Load token and user on app start
	useEffect(() => {
		const loadAuthData = async () => {
			try {
				const storedToken = await AsyncStorage.getItem("userToken");
				const storedUser = await AsyncStorage.getItem("userData");

				if (storedToken) {
					setUserToken(storedToken);
					// Optional: validate token here with server
				}

				if (storedUser) {
					try {
						setUser(JSON.parse(storedUser));
					} catch (err) {
						console.error("Invalid stored userData:", err);
						await AsyncStorage.removeItem("userData");
					}
				}
			} catch (error) {
				console.error("Error loading auth data:", error);
			} finally {
				setLoading(false);
			}
		};

		loadAuthData();
	}, []);

	const handlePushTokenRegistration = async (jwtToken) => {
		try {
			const pushToken = await registerForPushNotificationsAsync();
			if (pushToken) {
				await registerPushToken(jwtToken, pushToken);
				console.log("📲 Push token registered:", pushToken);
			}
		} catch (err) {
			console.error("❌ Error registering push token:", err.message);
		}
	};

	const login = async (userData, token) => {
		try {
			await AsyncStorage.multiSet([
				["userToken", token],
				["userData", JSON.stringify(userData)],
			]);

			setUserToken(token);
			setUser(userData);

			// Connect socket
			if (!socket.connected) socket.connect();

			// Register push token
			await handlePushTokenRegistration(token);
		} catch (error) {
			console.error("Error during login:", error);
		}
	};

	const logout = async () => {
		try {
			await AsyncStorage.multiRemove(["userToken", "userData"]);
			socket.disconnect();
			setUserToken(null);
			setUser(null);
		} catch (error) {
			console.error("Error during logout:", error);
		}
	};

	return (
		<AuthContext.Provider
			value={{ userToken, user, loading, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);

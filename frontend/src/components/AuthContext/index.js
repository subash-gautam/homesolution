import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { socket } from "../../utils/api";
import {
	registerForPushNotificationsAsync,
	registerPushToken,
} from "../../utils/Notifications1"; // make sure path is correct

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [userToken, setUserToken] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadToken = async () => {
			try {
				const storedToken = await AsyncStorage.getItem("userToken");
				if (storedToken) {
					setUserToken(storedToken);
					// 👇 DO NOT register push token here; wait for login
				}
			} catch (error) {
				console.error("Error loading user token:", error);
			} finally {
				setLoading(false);
			}
		};
		loadToken();
	}, []);

	const handlePushTokenRegistration = async (jwtToken) => {
		try {
			const pushToken = await registerForPushNotificationsAsync();
			console.log("JWT Token : ", jwtToken, "Push Token : ", pushToken);
			if (pushToken) {
				await registerPushToken(jwtToken, pushToken);
				console.log("📲 Push token registered:", pushToken);
			}
		} catch (err) {
			console.error("❌ Error registering push token:", err.message);
		}
	};

	const login = async (token) => {
		try {
			console.log("Token : ", token);
			await AsyncStorage.setItem("userToken", token);

			setUserToken(token);
			await handlePushTokenRegistration(token); // ✅ Only after login
		} catch (error) {
			console.error("Error during login:", error);
		}
	};

	const logout = async () => {
		await AsyncStorage.removeItem("userToken");
		socket.disconnect();
		setUserToken(null);
	};

	return (
		<AuthContext.Provider value={{ userToken, loading, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import backend from "./api";
import Constants from "expo-constants";

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: false,
	}),
});

export async function registerPushToken(token, pushToken) {
	try {
		console.log("before fetch");
		const res = await fetch(
			`${backend.backendUrl}/api/notifications/pushToken`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`, // ✅ Correct placement
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ token: pushToken }), // ✅ Must be a JSON string
			},
		);
		console.log("after fetch");

		if (!res.ok) {
			const errText = await res.text();
			throw new Error(`Server responded with ${res.status}: ${errText}`);
		}

		const data = await res.json();
		console.log("✅ Push token registration successful:", data);
	} catch (err) {
		console.error("❌ Failed to register push token:", err.message, err);
	}
}

export async function registerForPushNotificationsAsync() {
	if (Device.isDevice) {
		const { status: existingStatus } =
			await Notifications.getPermissionsAsync();

		let finalStatus = existingStatus;

		if (existingStatus !== "granted") {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}

		if (finalStatus !== "granted") {
			alert("Failed to get push token for push notification!");
			return null;
		}
		const token = (
			await Notifications.getExpoPushTokenAsync({
				projectId: Constants.expoConfig.extra.eas.projectId,
			})
		).data;

		return token;
	} else {
		alert("Must use physical device for Push Notifications");
		return null;
	}
}

export function setupNotificationListeners() {
	const notificationListener = Notifications.addNotificationReceivedListener(
		(notification) => {
			console.log("Notification received:", notification);
		},
	);

	const responseListener =
		Notifications.addNotificationResponseReceivedListener((response) => {
			console.log("Notification response:", response);
		});

	return { notificationListener, responseListener };
}

export default Notifications;

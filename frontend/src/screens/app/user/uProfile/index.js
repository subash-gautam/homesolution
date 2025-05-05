import React, { useState, useEffect, useContext } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	RefreshControl,
	Alert,
	ActivityIndicator,
	Image,
	Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../../components/AuthContext";
import { ThemeContext } from "../../../../context/ThemeContext";
import backend from "../../../../utils/api";

const Uprofile = () => {
	const { user, loading, logout, updateUserProfile } = useAuth();
	const { theme, setTheme } = useContext(ThemeContext);
	const navigation = useNavigation();
	const [refreshing, setRefreshing] = useState(false);
	const [userName, setUserName] = useState(user?.name || "User");
	const [showThemeModal, setShowThemeModal] = useState(false);
	const [profileUri, setProfileUri] = useState(user?.photoURL || null);

	const colors = {
		background:
			theme === "dark"
				? "#1a1a1a"
				: theme === "light"
				? "#fff"
				: "#f5f5f5",
		text: theme === "dark" ? "#e0e0e0" : "#333",
		card: theme === "dark" ? "#2d2d2d" : "#fff",
		primary: "#6B46C1",
		border: theme === "dark" ? "#444" : "#ccc",
		overlay: "rgba(0, 0, 0, 0.5)",
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const token = await AsyncStorage.getItem("userToken");
				if (user) {
					user.token = token;
				}
			} catch (error) {
				console.error("Error fetching token:", error);
			}
		};
		fetchData();
	}, []);

	console.log("User Data:", user);
	setProfileUri(`${backend.backendUrl}/uploads/${user.profile}`);
	const handleImageUpload = async () => {
		const permissionResult =
			await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (!permissionResult.granted) {
			Alert.alert(
				"Permission required",
				"Please allow access to your photos!",
			);
			return;
		}

		const pickerResult = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.5,
		});

		if (pickerResult.canceled) return;

		const asset = pickerResult.assets[0];
		const uri = asset.uri;
		const filename = uri.split("/").pop() || "profile.jpg";
		const match = /\.(\w+)$/.exec(filename);
		const type = match ? `image/${match[1]}` : `image`;

		const formData = new FormData();
		formData.append("userProfile", {
			uri,
			name: filename,
			type,
		});

		try {
			const response = await fetch(
				`${backend.backendUrl}/api/users/profile`,
				{
					method: "PUT",
					body: formData,
					headers: {
						Authorization: `Bearer ${user.token}`,
						"Content-Type": "multipart/form-data",
					},
				},
			);

			const data = await response.json();
			console.log("Upload Response:", data);

			if (response.ok) {
				if (updateUserProfile) {
					updateUserProfile({
						photoURL: `${backend.backendUrl}/uploads/${data.user.profile}`,
					});
				}
				setProfileUri(
					`${backend.backendUrl}/uploads/${data.user.profile}`,
				);
				Alert.alert("Success", "Profile image uploaded successfully!");
			} else {
				Alert.alert(
					"Upload Failed",
					data.message || "Failed to upload image",
				);
			}
		} catch (error) {
			console.error("Upload error:", error);
			Alert.alert("Error", "An error occurred while uploading the image");
		}
	};

	const handleMenuPress = (menuItem) => {
		if (menuItem === "LogOut") {
			Alert.alert("Log Out", "Are you sure you want to log out?", [
				{ text: "Cancel", style: "cancel" },
				{
					text: "Log Out",
					onPress: () => {
						logout();
						navigation.navigate("UserSignIn");
					},
				},
			]);
		} else if (menuItem === "Appearance") {
			setShowThemeModal(true);
		} else {
			const navigationMap = {
				"Personal Data": "PersonalData",
				Settings: "Settings",
				Dashboard: "Dashboard",
				"Billing Details": "Billing",
				"Privacy Policy": "PrivacyPolicy",
				"Help & Support": "Support",
				"Terms & Condition": "Terms",
				"About App": "About",
				"My Reviews": "Reviews",
			};
			navigation.navigate(navigationMap[menuItem]);
		}
	};

	const handleThemeSelect = async (selectedTheme) => {
		try {
			await AsyncStorage.setItem("appTheme", selectedTheme);
			setTheme(selectedTheme);
		} catch (error) {
			console.error("Error saving theme:", error);
		} finally {
			setShowThemeModal(false);
		}
	};

	if (loading) {
		return (
			<View
				style={[
					styles.loadingContainer,
					{ backgroundColor: colors.background },
				]}>
				<ActivityIndicator size="large" color={colors.primary} />
			</View>
		);
	}

	console.log("profile URL: ", profileUri, "User: ", user);

	return (
		<View
			style={[styles.container, { backgroundColor: colors.background }]}>
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={() => setRefreshing(true)}
						tintColor={colors.primary}
					/>
				}>
				{/* Header */}
				<View style={[styles.header, { backgroundColor: colors.card }]}>
					<TouchableOpacity
						style={styles.backButton}
						onPress={() => navigation.goBack()}>
						<Ionicons
							name="arrow-back"
							size={24}
							color={colors.primary}
						/>
					</TouchableOpacity>
					<Text style={[styles.headerText, { color: colors.text }]}>
						My Profile
					</Text>
				</View>

				{/* Profile Card */}
				<View
					style={[
						styles.profileCard,
						{ backgroundColor: colors.card },
					]}>
					<TouchableOpacity onPress={handleImageUpload}>
						<Image
							source={
								profileUri
									? { uri: profileUri }
									: require("../../../../assets/profile.png")
							}
							style={styles.profileImage}
						/>
					</TouchableOpacity>
					<Text style={[styles.userName, { color: colors.text }]}>
						{userName}
					</Text>
				</View>

				{/* Menu Options */}
				<View style={styles.menu}>
					{[
						{ icon: "document-text", text: "Personal Data" },
						{ icon: "settings", text: "Settings" },
						{ icon: "grid", text: "Dashboard" },
						{ icon: "card", text: "Billing Details" },
						{ icon: "document-lock", text: "Privacy Policy" },
						{ icon: "help-circle", text: "Help & Support" },
						{ icon: "document-text", text: "Terms & Condition" },
						{ icon: "information-circle", text: "About App" },
						{ icon: "star", text: "My Reviews" },
						{ icon: "color-palette", text: "Appearance" },
						{ icon: "log-out", text: "LogOut" },
					].map((item, index) => (
						<TouchableOpacity
							key={index}
							style={[
								styles.menuButton,
								{ borderBottomColor: colors.border },
							]}
							onPress={() => handleMenuPress(item.text)}>
							<Ionicons
								name={item.icon}
								size={22}
								color={colors.primary}
							/>
							<Text
								style={[
									styles.menuText,
									{ color: colors.text },
								]}>
								{item.text}
							</Text>
						</TouchableOpacity>
					))}
				</View>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollContent: {
		paddingBottom: 40,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		padding: 16,
	},
	backButton: {
		marginRight: 10,
	},
	headerText: {
		fontSize: 20,
		fontWeight: "bold",
	},
	profileCard: {
		alignItems: "center",
		paddingVertical: 20,
	},
	profileImage: {
		width: 100,
		height: 100,
		borderRadius: 50,
		marginBottom: 10,
	},
	userName: {
		fontSize: 18,
		fontWeight: "bold",
	},
	menu: {
		marginTop: 20,
	},
	menuButton: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderBottomWidth: 1,
	},
	menuText: {
		marginLeft: 12,
		fontSize: 16,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});

export default Uprofile;

import React, { useState, useEffect } from "react";
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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import backend from "../../../../utils/api";
import { SafeAreaView } from "react-native-safe-area-context";
import { socket } from "../../../../utils/api";

const Pprofile = () => {
	const [refreshing, setRefreshing] = useState(false);
	const [user, setUser] = useState({
		name: "Provider",
		image: require("../../../../assets/profile.png"),
		rating: 0,
		jobsCompleted: 0,
		reviews: 0,
	});
	const [loading, setLoading] = useState(true);
	const navigation = useNavigation();

	const fetchProviderData = async () => {
		try {
			const token = await AsyncStorage.getItem("providerToken");
			if (!token) {
				throw new Error("No token found");
			}

			// Fetch provider data from backend
			const response = await fetch(
				`${backend.backendUrl}/api/providers/profile`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				},
			);

			if (!response.ok) {
				throw new Error("Failed to fetch provider data");
			}

			const parsedData = await response.json();
			console.log("ParsedData: ", parsedData);

			// Build full profile image URL directly from backend
			const profileImage = parsedData.profile
				? { uri: `${backend.backendUrl}/uploads/${parsedData.profile}` }
				: require("../../../../assets/profile.png");

			// Set provider state
			setUser({
				name: parsedData.name || "Provider",
				image: profileImage,
				rating: parsedData.rating || 0,
				jobsCompleted: parsedData.jobsCompleted || 0,
				reviews: parsedData.reviews || 0,
			});
		} catch (error) {
			console.error("Error fetching provider data:", error);
			Alert.alert("Error", "Failed to load profile data");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchProviderData();
	}, []);

	const onRefresh = async () => {
		setRefreshing(true);
		await fetchProviderData();
		setRefreshing(false);
	};

	const handleImageUpload = async (imageUri) => {
		try {
			const token = await AsyncStorage.getItem("providerToken");
			const filename = imageUri.split("/").pop() || "profile.jpg";
			const match = /\.(\w+)$/.exec(filename);
			const type = match ? `image/${match[1]}` : "image/jpeg";

			const formData = new FormData();
			formData.append("ProviderProfile", {
				uri: imageUri,
				name: filename,
				type,
			});

			const response = await fetch(
				`${backend.backendUrl}/api/providers/profile`,
				{
					method: "PUT",
					body: formData,
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "multipart/form-data",
					},
				},
			);

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(errorText || "Upload failed");
			}

			const data = await response.json();
			const newImageUrl = `${backend.backendUrl}/uploads/${data.updatedProvider.profile}`;

			// Update providerData in AsyncStorage
			const providerData = await AsyncStorage.getItem("providerData");
			if (providerData) {
				const parsedData = JSON.parse(providerData);
				parsedData.profile = data.updatedProvider.profile;
				await AsyncStorage.setItem(
					"providerData",
					JSON.stringify(parsedData),
				);
			}

			// Update saved profile image
			const currentProviderId = JSON.parse(
				await AsyncStorage.getItem("providerData"),
			).id;
			const imageData = {
				providerId: currentProviderId,
				imageUrl: newImageUrl,
				timestamp: new Date().toISOString(),
			};
			await AsyncStorage.setItem(
				"savedProviderProfile",
				JSON.stringify(imageData),
			);

			// Update UI
			setUser((prev) => ({ ...prev, image: { uri: newImageUrl } }));
			Alert.alert("Success", "Profile image uploaded successfully!");
		} catch (error) {
			console.error("Upload error:", error);
			Alert.alert("Error", "Failed to upload image: " + error.message);
		}
	};

	const pickImage = async () => {
		const permissionResult =
			await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (!permissionResult.granted) {
			Alert.alert(
				"Permission Required",
				"Need camera roll access to upload images",
			);
			return;
		}

		const pickerResult = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.5,
		});

		if (!pickerResult.canceled && pickerResult.assets?.[0]?.uri) {
			await handleImageUpload(pickerResult.assets[0].uri);
		}
	};

	const handleLogout = async () => {
		Alert.alert("Log Out", "Are you sure you want to log out?", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Log Out",
				onPress: async () => {
					await AsyncStorage.multiRemove([
						"providerToken",
						"providerData",
					]);
					socket.disconnect();
					navigation.replace("Splash");
				},
			},
		]);
	};

	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#4299E1" />
			</View>
		);
	}

	const menuOptions = [
		{
			icon: "document-text",
			text: "Personal Data",
			screen: "PersonalData",
		},
		{ icon: "settings", text: "Settings", screen: "Settings" },
		{ icon: "grid", text: "Dashboard", screen: "Dashboard" },
		{ icon: "card", text: "Billing Details", screen: "Billing" },
		{
			icon: "document-lock",
			text: "Privacy Policy",
			screen: "PrivacyPolicy",
		},
		{ icon: "help-circle", text: "Help & Support", screen: "HelpSupport" },
		{ icon: "document-text", text: "Terms & Conditions", screen: "Terms" },
		{ icon: "information-circle", text: "About App", screen: "About" },
		{ icon: "star", text: "My Reviews", screen: "Reviews" },
		{ icon: "log-out", text: "Log Out", action: handleLogout },
	];

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						colors={["#4299E1"]}
					/>
				}>
				<View style={styles.header}>
					<TouchableOpacity
						style={styles.backButton}
						onPress={() => navigation.goBack()}>
						<Ionicons name="arrow-back" size={24} color="white" />
					</TouchableOpacity>
					<Text style={styles.headerText}>My Profile</Text>
				</View>

				<View style={styles.profileCard}>
					<TouchableOpacity
						onPress={pickImage}
						style={styles.imageContainer}>
						<Image
							source={user.image}
							style={styles.profileImage}
						/>
						<View style={styles.editIcon}>
							<Ionicons name="camera" size={20} color="white" />
						</View>
					</TouchableOpacity>
					<Text style={styles.nameText}>{user.name}</Text>

					<View style={styles.statsContainer}>
						<View style={styles.statItem}>
							<Text style={styles.statValue}>{user.rating}</Text>
							<Text style={styles.statLabel}>Rating</Text>
						</View>
						<View style={styles.statItem}>
							<Text style={styles.statValue}>
								{user.jobsCompleted}
							</Text>
							<Text style={styles.statLabel}>Jobs</Text>
						</View>
						<View style={styles.statItem}>
							<Text style={styles.statValue}>{user.reviews}</Text>
							<Text style={styles.statLabel}>Reviews</Text>
						</View>
					</View>
				</View>

				<View style={styles.menuContainer}>
					{menuOptions.map((item, index) => (
						<TouchableOpacity
							key={index}
							style={styles.menuItem}
							onPress={() =>
								item.action
									? item.action()
									: navigation.navigate(item.screen)
							}>
							<Ionicons
								name={item.icon}
								size={22}
								color="#4299E1"
							/>
							<Text style={styles.menuText}>{item.text}</Text>
							<Ionicons
								name="chevron-forward"
								size={20}
								color="#CBD5E0"
							/>
						</TouchableOpacity>
					))}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F7FAFC",
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "white",
	},
	scrollContent: {
		paddingBottom: 70,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#4299E1",
		paddingVertical: 20,
		paddingHorizontal: 15,
	},
	backButton: {
		padding: 8,
	},
	headerText: {
		flex: 1,
		textAlign: "center",
		fontSize: 20,
		fontWeight: "600",
		color: "white",
		marginRight: 30,
	},
	profileCard: {
		backgroundColor: "white",
		borderRadius: 12,
		margin: 20,
		padding: 20,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 6,
		elevation: 3,
	},
	imageContainer: {
		position: "relative",
		marginBottom: 15,
	},
	profileImage: {
		width: 120,
		height: 120,
		borderRadius: 60,
	},
	editIcon: {
		position: "absolute",
		bottom: 5,
		right: 5,
		backgroundColor: "#4299E1",
		borderRadius: 15,
		padding: 5,
	},
	nameText: {
		fontSize: 22,
		fontWeight: "600",
		color: "#2D3748",
		marginBottom: 15,
	},
	statsContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		width: "100%",
		marginVertical: 10,
	},
	statItem: {
		alignItems: "center",
	},
	statValue: {
		fontSize: 18,
		fontWeight: "600",
		color: "#4299E1",
	},
	statLabel: {
		fontSize: 14,
		color: "#718096",
	},
	menuContainer: {
		paddingHorizontal: 15,
	},
	menuItem: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "white",
		borderRadius: 8,
		padding: 16,
		marginBottom: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 2,
	},
	menuText: {
		flex: 1,
		fontSize: 16,
		color: "#2D3748",
		marginLeft: 15,
	},
});

export default Pprofile;

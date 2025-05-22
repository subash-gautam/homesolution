import React, { useState, useRef, useEffect } from "react";
import {
	View,
	Text,
	Modal,
	Animated,
	StyleSheet,
	Alert,
	BackHandler,
	SafeAreaView,
	StatusBar,
	Platform,
	ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";
import Button from "../../components/Button.js/Index"; // Assuming correct path
import { colors } from "../../utils/colors";
import backend from "../../utils/api";

// 🔹 Extract numeric value from a price string (e.g., "Rs. 300 onwards" or "300")
const extractNumber = (priceString) => {
	if (priceString === null || priceString === undefined) return 0;
	const match = priceString.toString().match(/\d+/); // .toString() handles if priceString is already a number
	return match ? parseInt(match[0], 10) : 0;
};

// 🔹 Format numeric amount for UI display
const formatPriceForDisplay = (amount) => {
	return `Rs. ${amount} onwards`;
};

const OrderConfirmationScreen = ({ route, navigation }) => {
	const { service = {}, bookingDetails = {} } = route.params || {};
	const [isConfirmed, setIsConfirmed] = useState(false);
	const [bookingId, setBookingId] = useState(null);
	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const [showCancelledModal, setShowCancelledModal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const fadeAnim = useRef(new Animated.Value(0)).current;
	const scaleAnim = useRef(new Animated.Value(0.5)).current;

	useEffect(() => {
		const backAction = () => {
			if (isLoading || showSuccessModal || showCancelledModal) {
				return true; // Prevent back navigation if loading or modal is shown
			}
			return false; // Default behavior (allow back)
		};

		const backHandler = BackHandler.addEventListener(
			"hardwareBackPress",
			backAction,
		);
		return () => backHandler.remove();
	}, [isLoading, showSuccessModal, showCancelledModal]);

	useEffect(() => {
		if (showSuccessModal || showCancelledModal) {
			Animated.parallel([
				Animated.timing(fadeAnim, {
					toValue: 1,
					duration: 300,
					useNativeDriver: true,
				}),
				Animated.spring(scaleAnim, {
					toValue: 1,
					friction: 5,
					useNativeDriver: true,
				}),
			]).start();
		} else {
			fadeAnim.setValue(0);
			scaleAnim.setValue(0.5);
		}
	}, [showSuccessModal, showCancelledModal, fadeAnim, scaleAnim]);

	const handleConfirm = async () => {
		setIsLoading(true);
		try {
			const [userDataString, userToken] = await Promise.all([
				AsyncStorage.getItem("userData"),
				AsyncStorage.getItem("userToken"),
			]);

			if (!userDataString || !userToken) {
				Alert.alert(
					"Authentication Error",
					"User not logged in. Please log in and try again.",
				);
				navigation.navigate("Login"); // Or appropriate login screen
				setIsLoading(false);
				return;
			}

			const user = JSON.parse(userDataString);

			if (!service?.id || !bookingDetails?.dateTime) {
				Alert.alert(
					"Booking Error",
					"Missing required booking information. Please try again.",
				);
				setIsLoading(false);
				return;
			}

			const priceToParse = service.price || service.minimumCharge || "0";
			const amountToSend = extractNumber(priceToParse);

			const bookingPayload = {
				userId: user.id,
				serviceId: service.id,
				scheduledDate: new Date(bookingDetails.dateTime).toISOString(),
				bookedAt: new Date().toISOString(),
				bookingStatus: "pending",
				paymentStatus: "unpaid",
				address: bookingDetails.address || "",
				city: bookingDetails.city || "",
				lat: bookingDetails.lat || null,
				lon: bookingDetails.lon || null,
				amount: amountToSend,
				...(service?.provider?.id && {
					providerId: service.provider.id,
				}), // optional
			};

			console.log(
				"Sending booking payload :",
				JSON.stringify(bookingPayload, null, 2),
			);

			const response = await fetch(`${backend.backendUrl}/api/bookings`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${userToken}`,
				},
				body: JSON.stringify(bookingPayload),
			});

			const responseText = await response.text();
			let data;
			try {
				data = JSON.parse(responseText);
			} catch (e) {
				console.error(
					"Failed to parse booking response JSON:",
					responseText,
				);
				throw new Error(
					`Server returned non-JSON response (Status: ${
						response.status
					}): ${responseText.substring(0, 100)}`,
				);
			}

			if (!response.ok) {
				console.error("Booking API Error:", data);
				throw new Error(
					data.message ||
						`Failed to create booking. Server responded with status ${response.status}.`,
				);
			}

			if (!data.booking || !data.booking.id) {
				console.error(
					"Booking successful but ID missing in response:",
					data,
				);
				throw new Error(
					"Booking created, but encountered an issue retrieving booking ID.",
				);
			}
			setBookingId(data.booking.id);
			const product = "suwi";
			setIsConfirmed(true);
			navigation.navigate("Payment", { product: "item" });
			// setShowSuccessModal(true);
		} catch (error) {
			console.error("Booking failed:", error);
			Alert.alert(
				"Booking Error",
				error.message ||
					"An unexpected error occurred while creating your booking. Please try again.",
			);
			// setShowCancelledModal(true); // Optionally show if desired for errors
		} finally {
			setIsLoading(false);
		}
	};

	const handleModalClose = (success = true) => {
		if (success) {
			setShowSuccessModal(false);
		} else {
			setShowCancelledModal(false);
		}
		navigation.navigate("UserTabs", { screen: "history" });
	};

	const serviceName =
		service?.subCategory?.name || service?.name || "Selected Service";
	const serviceTitle = service?.title || "Service";
	const serviceDescription = service?.description;
	const priceString =
		service.price || service.minimumCharge || service.amount;
	const numericPriceForDisplay =
		priceString !== undefined ? extractNumber(priceString) : null;

	return (
		<SafeAreaView style={styles.safeArea}>
			<StatusBar
				backgroundColor={colors.background || "#ffffff"}
				barStyle="dark-content"
			/>
			<ScrollView contentContainerStyle={styles.scrollContent}>
				<View style={styles.detailsContainer}>
					<Text style={styles.headerTitle}>Confirm Your Booking</Text>

					<Text style={styles.sectionTitle}>Service Details</Text>
					<Text style={styles.detailTextHighlight}>
						{serviceTitle}
					</Text>
					{serviceDescription && (
						<Text style={styles.detailText}>
							{serviceDescription}
						</Text>
					)}
					{numericPriceForDisplay !== null ? (
						<Text style={styles.priceText}>
							amount:{" "}
							{formatPriceForDisplay(numericPriceForDisplay)}
						</Text>
					) : (
						<Text style={styles.priceText}>
							Price: Not specified
						</Text>
					)}

					<Text style={styles.sectionTitle}>Booking Details</Text>
					<Text style={styles.detailText}>
						Date:{" "}
						{bookingDetails?.dateTime
							? new Date(
									bookingDetails.dateTime,
							  ).toLocaleDateString(undefined, {
									year: "numeric",
									month: "long",
									day: "numeric",
							  })
							: "Not specified"}
					</Text>
					<Text style={styles.detailText}>
						Time:{" "}
						{bookingDetails?.dateTime
							? new Date(
									bookingDetails.dateTime,
							  ).toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit",
									hour12: true,
							  })
							: "Not specified"}
					</Text>
					<Text style={styles.detailText}>
						Address: {bookingDetails?.address || "Not specified"}
						{bookingDetails?.city ? `, ${bookingDetails.city}` : ""}
					</Text>

					<Text style={styles.sectionTitle}>Provider</Text>
					<Text style={styles.detailText}>
						{service?.provider?.name &&
						service.provider.name !== "Select Provider"
							? service.provider.name
							: "Not specified"}
					</Text>
				</View>
			</ScrollView>

			<View style={styles.footer}>
				<Button
					title={isLoading ? "Processing..." : "Proceed to Payment"}
					onPress={handleConfirm}
					style={styles.confirmButton}
					disabled={isLoading}
					isLoading={isLoading}
				/>
			</View>

			<Modal
				visible={showSuccessModal}
				onRequestClose={() => handleModalClose(true)}
				animationType="none"
				transparent={true}>
				<View style={styles.modalOverlay}>
					<Animated.View
						style={[
							styles.modalContent,
							{
								opacity: fadeAnim,
								transform: [{ scale: scaleAnim }],
							},
						]}>
						<LottieView
							source={require("../../assets/success.json")}
							autoPlay
							loop={false}
							style={styles.animation}
						/>
						<Text style={styles.successText}>
							Booking Submitted!
						</Text>
						{bookingId && (
							<Text style={styles.bookingIdText}>
								Booking ID: {bookingId}
							</Text>
						)}
						<Text style={styles.successSubText}>
							Your request for {serviceName} has been sent.
						</Text>
						<Button
							title="View Bookings"
							onPress={() => handleModalClose(true)}
							style={styles.modalButton}
						/>
					</Animated.View>
				</View>
			</Modal>

			<Modal
				visible={showCancelledModal}
				onRequestClose={() => handleModalClose(false)}
				animationType="none"
				transparent={true}>
				<View style={styles.modalOverlay}>
					<Animated.View
						style={[
							styles.modalContent,
							{
								opacity: fadeAnim,
								transform: [{ scale: scaleAnim }],
							},
						]}>
						<LottieView
							source={require("../../assets/error.json")}
							autoPlay
							loop={false}
							style={styles.animation}
						/>
						<Text style={styles.cancelledText}>Booking Failed</Text>
						<Text style={styles.cancelledSubText}>
							We couldn't process your booking. Please try again
							later.
						</Text>
						<Button
							title="Return Home"
							onPress={() => handleModalClose(false)}
							style={styles.modalButtonCancel}
						/>
					</Animated.View>
				</View>
			</Modal>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safeArea: { flex: 1, backgroundColor: colors.background || "#ffffff" },
	scrollContent: { padding: 20, paddingBottom: 80 },
	headerTitle: {
		fontSize: 24,
		fontWeight: "bold",
		color: colors.textDark || "#333",
		textAlign: "center",
		marginBottom: 20,
	},
	detailsContainer: {
		backgroundColor: colors.cardBackground || "#f9f9f9",
		borderRadius: 12,
		padding: 20,
		marginBottom: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: colors.primary,
		marginTop: 16,
		marginBottom: 10,
		paddingBottom: 6,
		borderBottomWidth: 1,
		borderBottomColor: colors.borderLight || "#eeeeee",
	},
	detailText: {
		fontSize: 16,
		color: colors.text || "#555555",
		marginBottom: 8,
		lineHeight: 22,
	},
	detailTextHighlight: {
		fontSize: 18,
		fontWeight: "bold",
		color: colors.textDark || "#333",
		marginBottom: 5,
	},
	priceText: {
		fontSize: 17,
		fontWeight: "bold",
		color: colors.accent || colors.primary,
		marginBottom: 12,
	},
	footer: {
		padding: 20,
		borderTopWidth: 1,
		borderTopColor: colors.borderLight || "#f0f0f0",
		backgroundColor: colors.background || "#ffffff",
	},
	confirmButton: {
		backgroundColor: colors.primary,
		paddingVertical: 15,
		height: undefined,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.6)",
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 20,
	},
	modalContent: {
		width: "100%",
		maxWidth: 380,
		backgroundColor: "#fff",
		borderRadius: 20,
		padding: 25,
		paddingTop: 30,
		alignItems: "center",
		elevation: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 6,
	},
	animation: {
		width: 120,
		height: 120,
		marginBottom: 10,
	},
	successText: {
		fontSize: 22,
		fontWeight: "bold",
		color: colors.success || "#4CAF50",
		marginTop: 15,
		textAlign: "center",
	},
	cancelledText: {
		fontSize: 22,
		fontWeight: "bold",
		color: colors.error || "#F44336",
		marginTop: 15,
		textAlign: "center",
	},
	bookingIdText: {
		fontSize: 16,
		color: colors.textLight || "#757575",
		marginVertical: 10,
		fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
		textAlign: "center",
	},
	successSubText: {
		fontSize: 15,
		color: colors.text || "#555555",
		textAlign: "center",
		marginBottom: 25,
		lineHeight: 22,
	},
	cancelledSubText: {
		fontSize: 15,
		color: colors.text || "#555555",
		textAlign: "center",
		marginVertical: 20,
		lineHeight: 22,
	},
	modalButton: {
		backgroundColor: colors.primary,
		width: "100%",
		marginTop: 15,
		paddingVertical: 14,
		borderRadius: 10,
	},
	modalButtonCancel: {
		backgroundColor: colors.secondary || "#757575",
		width: "100%",
		marginTop: 10,
		paddingVertical: 14,
		borderRadius: 10,
	},
});

export default OrderConfirmationScreen;

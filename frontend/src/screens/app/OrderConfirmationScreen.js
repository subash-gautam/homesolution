// OrderConfirmationScreen.js
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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import LottieView from "lottie-react-native";
import Button from "../../components/Button.js/Index";
import { colors } from "../../utils/colors";
import backend from "../../utils/api";
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const OrderConfirmationScreen = ({ route, navigation }) => {
  const { service = {}, bookingDetails = {} } = route.params || {};
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCancelledModal, setShowCancelledModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userPushToken, setUserPushToken] = useState("");

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) setUserPushToken(token);
    });

    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received:", notification);
      }
    );

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (isLoading || showSuccessModal || showCancelledModal) {
          return true;
        }
        return false;
      }
    );
    return () => backHandler.remove();
  }, [isLoading, showSuccessModal, showCancelledModal]);

  useEffect(() => {
    if (showSuccessModal || showCancelledModal) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.5);
    }
  }, [showSuccessModal, showCancelledModal]);

  useEffect(() => {
    if (showSuccessModal && service?.provider?.pushToken) {
      const timer = setTimeout(() => {
        sendPushNotification(
          userPushToken,
          "Booking Accepted",
          `Your booking for ${serviceName} has been accepted by ${service.provider.name}.`
        );
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal]);

  const handleConfirm = async () => {
    setIsLoading(true);

    try {
      // Get both user data and token from AsyncStorage
      const [userDataString, userToken] = await Promise.all([
        AsyncStorage.getItem("userData"),
        AsyncStorage.getItem("userToken"),
      ]);

      if (!userDataString || !userToken) {
        throw new Error("User not logged in");
      }

      const user = JSON.parse(userDataString);

      if (!service?.provider?.id || !service?.id || !bookingDetails?.dateTime) {
        throw new Error("Missing required booking information");
      }

      const bookingPayload = {
        userId: user.id,
        providerId: service.provider.id,
        serviceId: service.id,
        scheduledDate: new Date(bookingDetails.dateTime).toISOString(),
        bookedAt: new Date().toISOString(),
        bookingStatus: "pending",
        paymentStatus: "unpaid",
        amount: service.price || 0,
      };

      const response = await fetch(`${backend.backendUrl}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(bookingPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create booking");
      }

      setBookingId(data.booking.id);

      if (service?.provider?.pushToken) {
        await sendPushNotification(
          service.provider.pushToken,
          "New Booking Request",
          `A new booking for ${serviceName} has been requested.`
        );
      }

      setIsConfirmed(true);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Booking failed:", error);
      Alert.alert("Error", error.message || "Failed to create booking");
      setShowCancelledModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const sendPushNotification = async (token, title, body) => {
    const message = {
      to: token,
      sound: "default",
      title: title,
      body: body,
      data: { data: "goes here" },
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  };

  const handleModalClose = (success = true) => {
    if (success) {
      setShowSuccessModal(false);
    } else {
      setShowCancelledModal(false);
    }
    navigation.navigate("UserTabs");
  };

  const serviceName = service?.subCategory?.name || service?.name || "Service";

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <View style={styles.container}>
        <Text style={styles.title}>Confirm Your Booking</Text>
        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>Service Details</Text>
          <Text style={styles.detailText}>{service.title}</Text>
          {service?.description && (
            <Text style={styles.detailText}>{service.description}</Text>
          )}
          {service?.price && (
            <Text style={styles.priceText}>Price: {service.price}</Text>
          )}
          <Text style={styles.sectionTitle}>Booking Details</Text>
          <Text style={styles.detailText}>
            Date:{" "}
            {bookingDetails?.dateTime
              ? new Date(bookingDetails.dateTime).toLocaleDateString()
              : "Not specified"}
          </Text>
          <Text style={styles.detailText}>
            Time:{" "}
            {bookingDetails?.dateTime
              ? new Date(bookingDetails.dateTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Not specified"}
          </Text>
          <Text style={styles.detailText}>
            Address: {bookingDetails?.address || "Address not specified"}
          </Text>
          <Text style={styles.sectionTitle}>Provider</Text>
          <Text style={styles.detailText}>
            {service?.provider?.name || "Provider not specified"}
          </Text>
        </View>
        <Button
          title={isLoading ? "Processing..." : "Confirm Booking"}
          onPress={handleConfirm}
          style={styles.confirmButton}
          disabled={isLoading}
        />

        <Modal
          visible={showSuccessModal}
          onRequestClose={() => handleModalClose(true)}
          animationType="none"
          transparent={true}
        >
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[
                styles.modalContent,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <LottieView
                source={require("../../assets/success.json")}
                autoPlay
                loop={false}
                style={styles.animation}
              />
              <Text style={styles.successText}>Booking Successful!</Text>
              <Text style={styles.bookingIdText}>ID: {bookingId}</Text>
              <Text style={styles.successSubText}>
                Your booking has been processed successfully.
              </Text>
              <Button
                title="Return Home"
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
          transparent={true}
        >
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[
                styles.modalContent,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <LottieView
                source={require("../../assets/error.json")}
                autoPlay
                loop={false}
                style={styles.animation}
              />
              <Text style={styles.cancelledText}>Booking Failed!</Text>
              <Text style={styles.cancelledSubText}>
                {bookingId ? `Booking ID: ${bookingId} - ` : ""}
                We couldn't process your booking. Please try again later.
              </Text>
              <Button
                title="Return Home"
                onPress={() => handleModalClose(false)}
                style={styles.modalButtonCancel}
              />
            </Animated.View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const registerForPushNotificationsAsync = async () => {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notifications!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: colors.text,
    textAlign: "center",
  },
  detailsContainer: {
    marginBottom: 30,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.primary,
    marginTop: 15,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
    paddingBottom: 5,
  },
  detailText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
    paddingLeft: 5,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 8,
    paddingLeft: 5,
  },
  confirmButton: {
    marginTop: 20,
    backgroundColor: colors.primary,
    height: 50,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 30,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  animation: {
    width: 150,
    height: 150,
  },
  successText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.success,
    marginTop: 20,
    textAlign: "center",
  },
  cancelledText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.error || "#FF3B30",
    marginTop: 20,
    textAlign: "center",
  },
  bookingIdText: {
    fontSize: 18,
    color: colors.primary,
    marginVertical: 15,
    fontFamily: "monospace",
  },
  successSubText: {
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
    marginBottom: 25,
  },
  cancelledSubText: {
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
    marginVertical: 20,
  },
  modalButton: {
    backgroundColor: colors.secondary,
    width: "100%",
    marginTop: 10,
    paddingVertical: 15,
    borderRadius: 8,
  },
  modalButtonCancel: {
    backgroundColor: colors.error || "#FF3B30",
    width: "100%",
    marginTop: 10,
    paddingVertical: 15,
    borderRadius: 8,
  },
});

export default OrderConfirmationScreen;

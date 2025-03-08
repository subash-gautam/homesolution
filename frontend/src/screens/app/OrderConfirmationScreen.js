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
} from "react-native";
import LottieView from "lottie-react-native";
import Button from "../../components/Button.js/Index";
import { colors } from "../../utils/colors";

const generateBookingId = () => {
  return `BK-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .substr(2, 4)
    .toUpperCase()}`;
};

const OrderConfirmationScreen = ({ route, navigation }) => {
  const { service = {}, bookingDetails = {} } = route.params || {};
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCancelledModal, setShowCancelledModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Set up back button handling
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (isLoading || showSuccessModal || showCancelledModal) {
          return true; // Prevent going back during processing or when modals are shown
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
      // Reset animations when modals are closed
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.5);
    }
  }, [showSuccessModal, showCancelledModal]);

  const simulateBookingProcess = () => {
    // Simulate network request with potential for failure
    return new Promise((resolve, reject) => {
      const shouldSucceed = Math.random() > 0.3; // 70% success rate for testing

      setTimeout(() => {
        if (shouldSucceed) {
          resolve();
        } else {
          reject(new Error("Network error occurred"));
        }
      }, 2000); // Simulate network delay
    });
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    const newBookingId = generateBookingId();
    setBookingId(newBookingId);

    try {
      await simulateBookingProcess();
      setIsConfirmed(true);
      setIsLoading(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Booking failed:", error);
      setIsLoading(false);
      setShowCancelledModal(true);
    }
  };

  const handleModalClose = (success = true) => {
    if (success) {
      setShowSuccessModal(false);
    } else {
      setShowCancelledModal(false);
    }
    navigation.navigate("Home");
  };

  // Get the service name (subcategory name)
  const serviceName =
    service?.subCategory?.name || service?.name || "Service not specified";

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <View style={styles.container}>
        <Text style={styles.title}>Confirm Your Booking</Text>

        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>Service Details</Text>
          <Text style={styles.detailText}>{serviceName}</Text>
          {service?.description && (
            <Text style={styles.detailText}>{service.description}</Text>
          )}
          {service?.price && (
            <Text style={styles.priceText}>Price: ${service.price}</Text>
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

        {/* Success Modal */}
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

        {/* Cancelled Modal */}
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
                We couldn't process your booking due to a network issue. Please
                try again later.
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
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Darker overlay to hide previous screen
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

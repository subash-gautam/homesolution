import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  Easing,
  Modal,
  TouchableOpacity,
} from "react-native";
import Button from "../../../../components/Button.js/Index";
import { colors } from "../../../../utils/colors";
import LottieView from "lottie-react-native"; // For animations
import styles from "./styles";
const PaymentScreen = ({ route, navigation }) => {
  const { service, bookingDetails } = route.params;
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const paymentMethods = [
    { id: "credit", name: "Credit Card" },
    { id: "khalti", name: "Khalti" },
    { id: "cash", name: "Cash on Delivery" },
  ];

  const handlePaymentConfirmation = () => {
    setShowSuccessModal(true);

    // Start the animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // After the animation completes, navigate back to the home screen after 2 seconds
      setTimeout(() => {
        setShowSuccessModal(false); // Close the modal
        navigation.navigate("UserTabs");
      }, 2000);
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!showConfirmation ? (
        <>
          <Text style={styles.title}>Select Payment Method</Text>

          {paymentMethods.map((method) => (
            <Button
              key={method.id}
              title={method.name}
              onPress={() => {
                setSelectedMethod(method);
                setShowConfirmation(true);
              }}
              style={[
                styles.methodButton,
                method.id === "khalti" && styles.khaltiButton,
              ]}
            />
          ))}
        </>
      ) : (
        <>
          <Text style={styles.title}>Payment Confirmation</Text>

          {/* Service Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Service Details</Text>
            <Text style={styles.detailText}>{service.title}</Text>
            <Text style={styles.detailText}>{service.price}</Text>
          </View>

          {/* Booking Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Booking Details</Text>
            <Text style={styles.detailText}>
              Date: {new Date(bookingDetails.dateTime).toDateString()}
            </Text>
            <Text style={styles.detailText}>
              Time: {new Date(bookingDetails.dateTime).toLocaleTimeString()}
            </Text>
            <Text style={styles.detailText}>
              Address: {bookingDetails.address}
            </Text>
            <Text style={styles.detailText}>
              Description: {bookingDetails.description}
            </Text>
          </View>

          {/* Payment Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Information</Text>
            <Text style={styles.detailText}>Method: {selectedMethod.name}</Text>
            <Text style={styles.totalText}>Total: {service.price}</Text>
          </View>

          <Button
            title="Confirm Payment"
            onPress={handlePaymentConfirmation}
            style={styles.confirmButton}
          />
        </>
      )}

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        onRequestClose={() => setShowSuccessModal(false)}
        transparent={false}
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
            {/* Lottie Animation */}
            <LottieView
              source={require("../../../../assets/success.json")}
              autoPlay
              loop={false}
              style={styles.animation}
            />
            <Text style={styles.successText}>Payment Successful!</Text>
            <Text style={styles.successSubText}>
              Your payment has been processed successfully.
            </Text>
          </Animated.View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default PaymentScreen;

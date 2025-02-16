import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";

const ForgotPasswordScreen = ({ navigation }) => {
  const [contact, setContact] = useState(""); // Can be phone or email
  const [isLoading, setIsLoading] = useState(false); // Loading state for OTP sending

  // Handle submit function
  const handleSubmit = () => {
    if (!contact) {
      Alert.alert("Error", "Please enter your phone number or email address.");
      return;
    }
    // Validate if the input is a phone number or email
    const isPhone = /^\d+$/.test(contact); // Simple check for digits only
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact); // Basic email validation
    if (!isPhone && !isEmail) {
      Alert.alert(
        "Error",
        "Please enter a valid phone number or email address."
      );
      return;
    }
    // Simulate OTP sending
    setIsLoading(true); // Show loading indicator
    setTimeout(() => {
      setIsLoading(false); // Hide loading indicator
      Alert.alert(
        "OTP Sent",
        `An OTP has been sent to your ${
          isPhone ? "phone number" : "email address"
        }.`
      );
      navigation.navigate("OTPVerification", { contact, isPhone }); // Navigate to OTP Verification screen
    }, 2000); // Simulate a 2-second delay for OTP sending
  };

  return (
    <View style={styles.container}>
      {/* Header Image */}
      <Image
        source={require("../assets/ForgotPassword.png")} // Update the path to your image
        style={styles.image}
      />

      {/* Title */}
      <Text style={styles.title}>Forgot Password</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Please Enter Your Phone Number or Email Address
      </Text>
      <Text style={styles.subtitle}>We will Send OTP to this Contact</Text>

      {/* Input Field */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Your Phone Number or Email"
          value={contact}
          onChangeText={setContact}
          keyboardType={contact.includes("@") ? "email-address" : "phone-pad"} // Dynamically switch keyboard
        />
      </View>

      {/* Send OTP Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={isLoading} // Disable button while loading
      >
        {isLoading ? (
          <ActivityIndicator color="white" /> // Show loading indicator
        ) : (
          <Text style={styles.buttonText}>Send OTP</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff", // Light background for a clean look
  },
  image: {
    width: "80%", // Adjust size for better proportions
    height: 200, // Fixed height for consistency
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333", // Dark text for contrast
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: "#f9f9f9", // Slightly off-white background for inputs
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#FF5722",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // For Android shadow effect
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default ForgotPasswordScreen;

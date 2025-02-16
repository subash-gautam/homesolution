import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";

const OTPVerificationScreen = ({ route, navigation }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // Array to hold OTP digits
  const { contact, isPhone } = route.params; // Get the contact and method from the previous screen
  const [otpTimer, setOtpTimer] = useState(60); // Timer for entering OTP (60 seconds)
  const [isOtpExpired, setIsOtpExpired] = useState(false); // Track if OTP has expired

  // Create refs for each input field
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  // Handle OTP input change
  const handleInputChange = (index, value) => {
    if (value.length > 1) return; // Prevent entering more than one character
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to the next input field if the current one is filled
    if (value && index < otp.length - 1) {
      inputRefs[index + 1].current.focus();
    }
  };

  // Handle backspace to move focus to the previous input field
  const handleKeyPress = (index, e) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  // Verify OTP
  const handleVerify = () => {
    const otpString = otp.join(""); // Combine OTP digits into a single string
    if (!otpString || otpString.length !== 6) {
      Alert.alert("Error", "Please enter a valid 6-digit OTP.");
      return;
    }
    // Simulate OTP verification
    Alert.alert("Success", "OTP verified successfully.");
    navigation.navigate("ResetPassword", { contact }); // Navigate to Reset Password screen
  };

  // Countdown timer for entering OTP
  useEffect(() => {
    if (otpTimer > 0 && !isOtpExpired) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer); // Cleanup the timer
    } else {
      setIsOtpExpired(true); // Mark OTP as expired when the timer reaches zero
    }
  }, [otpTimer, isOtpExpired]);

  // Re-send OTP
  const handleResendOTP = () => {
    // Simulate sending a new OTP
    Alert.alert(
      "OTP Sent",
      "A new OTP has been sent to your " +
        (isPhone ? "phone number" : "email address") +
        "."
    );
    setOtpTimer(60); // Reset the timer to 60 seconds
    setIsOtpExpired(false); // Reset the expiration state
  };

  return (
    <View style={styles.container}>
      {/* Image View */}
      <Image
        source={require("../assets/Otp.png")} // Update the path to your image
        style={styles.image}
      />
      <Text style={styles.title}>Verify OTP</Text>
      <Text style={styles.subtitle}>
        A 6-digit OTP has been sent to your{" "}
        {isPhone ? "phone number" : "email address"}:
      </Text>
      <Text style={styles.contact}>{contact}</Text>

      {/* OTP Input Fields */}
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.otpInput}
            value={digit}
            onChangeText={(text) => handleInputChange(index, text)}
            onKeyPress={(e) => handleKeyPress(index, e)}
            keyboardType="numeric"
            maxLength={1}
            ref={inputRefs[index]}
            autoFocus={index === 0} // Auto-focus the first input field
            editable={!isOtpExpired} // Disable input fields if OTP has expired
          />
        ))}
      </View>

      {/* Timer Display */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>
          {isOtpExpired ? "OTP Expired" : `Enter OTP in ${otpTimer}s`}
        </Text>
      </View>

      {/* Don't receive code? and Re-send OTP Button */}
      <View style={styles.resendContainer}>
        <Text style={styles.dontReceiveText}>Don't receive code?</Text>
        <TouchableOpacity
          style={styles.resendButton}
          onPress={handleResendOTP}
          disabled={!isOtpExpired} // Enable re-send only after OTP expires
        >
          <Text style={styles.resendButtonText}>Re-send OTP</Text>
        </TouchableOpacity>
      </View>

      {/* Verify Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleVerify}
        disabled={isOtpExpired} // Disable verify button if OTP has expired
      >
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  image: {
    width: "100%", // Adjust the size as needed
    height: 200, // Adjust the height as needed
    resizeMode: "contain", // Ensure the image fits within the dimensions
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    marginBottom: 10,
    textAlign: "center",
  },
  contact: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    width: 40,
    height: 40,
    textAlign: "center",
    fontSize: 18,
  },
  timerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  timerText: {
    fontSize: 16,
    color: "red",
    fontWeight: "bold",
  },
  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  dontReceiveText: {
    fontSize: 14,
    color: "gray",
    marginRight: 5,
  },
  resendButton: {},
  resendButtonText: {
    color: "blue",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#FF5722",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default OTPVerificationScreen;

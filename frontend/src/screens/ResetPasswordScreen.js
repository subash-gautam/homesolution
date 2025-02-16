import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import icons from Expo Vector Icons

const ResetPasswordScreen = ({ navigation, route }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false); // Toggle visibility for new password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle visibility for confirm password
  const { emailOrPhone } = route.params;

  // Handle password reset logic
  const handleReset = () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    // Simulate password reset (replace with actual API call)
    Alert.alert("Success", "Your password has been reset successfully.");
    navigation.navigate("Login"); // Redirect to login screen
  };

  return (
    <View style={styles.container}>
      {/* Header Image */}
      <Image
        source={require("../assets/ResetPassword.png")} // Replace with your image path
        style={styles.image}
      />

      {/* Title */}
      <Text style={styles.title}>Reset Password</Text>

      {/* New Password Input */}
      <View style={styles.inputContainer}>
        <Ionicons
          name="lock-closed"
          size={20}
          color="#666"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={!showNewPassword} // Toggle visibility
        />
        <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
          <Ionicons
            name={showNewPassword ? "eye-off" : "eye"}
            size={20}
            color="#666"
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Confirm Password Input */}
      <View style={styles.inputContainer}>
        <Ionicons
          name="lock-closed"
          size={20}
          color="#666"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword} // Toggle visibility
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          <Ionicons
            name={showConfirmPassword ? "eye-off" : "eye"}
            size={20}
            color="#666"
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Reset Password Button */}
      <TouchableOpacity style={styles.button} onPress={handleReset}>
        <Text style={styles.buttonText}>Reset Password</Text>
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
    width: 400,
    height: 200,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#333", // Dark text for contrast
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "#f9f9f9", // Slightly off-white background for inputs
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#333",
  },
  eyeIcon: {
    marginLeft: 10,
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

export default ResetPasswordScreen;

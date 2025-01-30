import React, { useState } from "react";
import { View, Alert } from "react-native";
import AuthHeader from "../../../components/AuthHeader";
import Input from "../../../components/Input";
import Button from "../../../components/Button.js/Index";
import Footer from "../../../components/Footer";
import styles from "./styles";
import axios from "axios"; // Import axios
import backend from "../../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage"; // For storing tokens

const UserSignIn = ({ navigation }) => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const handleSignIn = async () => {
    // Validate inputs
    if (!phone || !password) {
      Alert.alert("Error", "Please enter both phone and password.");
      return;
    }

    setIsLoading(true); // Start loading

    try {
      console.log("Attempting login with:", { phone, password }); // Debugging log

      const response = await axios.post(
        `${backend.backendUrl}/users/login`,
        { phone, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000, // Add timeout
        }
      );

      console.log("Login response:", response.data); // Debugging log

      if (response.status >= 200 && response.status < 300) {
        const { token, user } = response.data; // Extract token and user data

        // Store the token and user data in AsyncStorage
        await AsyncStorage.multiSet([
          ["userToken", token],
          ["userData", JSON.stringify(user)],
        ]);

        console.log("Token and user data stored successfully"); // Debugging log

        Alert.alert("Success", "Login successful!");
        navigation.navigate("UserTabs"); // Navigate to the main app screen
      } else {
        Alert.alert("Error", "Unexpected response from the server.");
      }
    } catch (error) {
      console.error("Sign-in error:", error); // Debugging log

      if (error.response) {
        // Server responded with an error
        console.log("Error response data:", error.response.data); // Debugging log
        Alert.alert(
          "Error",
          error.response.data.message || "Sign-in failed. Please try again."
        );
      } else if (error.request) {
        // No response from the server
        console.log("Error request:", error.request); // Debugging log
        Alert.alert(
          "Error",
          "No response from the server. Please check your internet connection."
        );
      } else {
        // Other errors
        Alert.alert("Error", "An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <View style={styles.container}>
      <AuthHeader
        title="User Sign In"
        onBackPress={() => navigation.goBack()}
      />
      <Input
        iconName="phone"
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        autoCapitalize="none"
        keyboardType="phone-pad" // Ensure numeric keyboard
      />
      <Input
        iconName="lock"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button
        title={isLoading ? "Signing In..." : "Sign In"} // Show loading state
        onPress={handleSignIn}
        disabled={isLoading} // Disable button while loading
      />
      <Footer
        text="Don't have an account?"
        linkText="Sign Up"
        onLinkPress={() => navigation.navigate("UserSignUp")}
      />
    </View>
  );
};

export default UserSignIn;

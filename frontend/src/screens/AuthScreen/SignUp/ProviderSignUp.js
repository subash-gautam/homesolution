import React, { useState } from "react";
import { View, Alert } from "react-native";
import AuthHeader from "../../../components/AuthHeader";
import Input from "../../../components/Input";
import Button from "../../../components/Button.js/Index";
import Footer from "../../../components/Footer";
import styles from "./styles";
import axios from "axios"; // Import axios
import backend from "../../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

const ProviderSignUp = ({ navigation }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state

  // Function to store token and provider data in AsyncStorage
  const storeData = async (token, providerData) => {
    try {
      await AsyncStorage.setItem("providerToken", token);
      await AsyncStorage.setItem("providerData", JSON.stringify(providerData));
      console.log("Token and provider data stored successfully");
    } catch (error) {
      console.error("Failed to save token or provider data:", error);
    }
  };

  // Function to retrieve token from AsyncStorage
  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem("providerToken");
      if (token !== null) {
        console.log("Retrieved token:", token);
        return token;
      } else {
        console.log("No token found");
        return null;
      }
    } catch (error) {
      console.error("Failed to retrieve token:", error);
      return null;
    }
  };

  const handleSignUp = async () => {
    if (!name || !phone || !password || !confirmPassword) {
      Alert.alert("Missing Fields", "Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match.");
      return;
    }

    setLoading(true); // Start loading
    const providerData = { name, phone, password };
    try {
      const response = await axios.post(
        `${backend.backendUrl}/providers/register`,
        providerData,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("API Response:", response.data); // Debugging

      if (response.status === 200 || response.status === 201) {
        const token = response.data.token; // Assuming the token is returned in response.data.token
        if (token) {
          // Store token and provider data in AsyncStorage
          await storeData(token, { name, phone });

          const successMessage =
            response.data.message || "Registration successful!";
          Alert.alert("Success", successMessage);

          // Navigate to Sign In screen
          navigation.navigate("ProviderSignIn");
        } else {
          Alert.alert("Error", "No token received from server.");
        }
      } else {
        Alert.alert("Error", "Unexpected response from server.");
      }
    } catch (error) {
      console.error("Sign-up error:", error);
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        const errorMessage =
          error.response.data?.message ||
          `Server error (${error.response.status}). Please try again.`;
        Alert.alert("Error", errorMessage);
      } else if (error.request) {
        // The request was made but no response was received
        Alert.alert("Error", "No response from the server. Please try again.");
      } else {
        // Something else went wrong
        Alert.alert("Error", "An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AuthHeader
        title="Provider Sign Up"
        onBackPress={() => navigation.goBack()}
      />
      <Input
        iconName="person"
        placeholder="Name"
        value={name}
        onChangeText={setName}
        keyboardType="default"
      />
      <Input
        iconName="phone"
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        autoCapitalize="none"
      />
      <Input
        iconName="lock"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Input
        iconName="lock"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <Button
        title={loading ? "Signing Up..." : "Sign Up"}
        onPress={handleSignUp}
        disabled={loading}
      />
      <Footer
        text="Already have an account?"
        linkText="Sign In"
        onLinkPress={() => navigation.navigate("ProviderSignIn")}
      />
    </View>
  );
};

export default ProviderSignUp;

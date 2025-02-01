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

const ProviderSignIn = ({ navigation }) => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

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

  const handleSignIn = async () => {
    if (!phone || !password) {
      Alert.alert("Missing Fields", "Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post(
        `${backend.backendUrl}/providers/login`, // Replace with your backend URL
        { phone, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const token = response.data.token; // Assuming the token is returned in response.data.token
        if (token) {
          // Store token and provider data in AsyncStorage
          await storeData(token, { phone });

          // Navigate to the ProviderTabs screen
          navigation.navigate("ProviderTabs");
        } else {
          Alert.alert("Error", "No token received from server.");
        }
      } else {
        Alert.alert("Error", "Unexpected response from server.");
      }
    } catch (error) {
      if (error.response) {
        Alert.alert("Error", error.response.data.message || "Sign-in failed.");
      } else if (error.request) {
        Alert.alert("Error", "No response from the server. Please try again.");
      } else {
        Alert.alert("Error", "An unexpected error occurred. Please try again.");
      }
      console.error("Sign-in error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <AuthHeader
        title="Provider Sign In"
        onBackPress={() => navigation.goBack()}
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
      <Button title="Sign In" onPress={handleSignIn} />
      <Footer
        text="Don't have an account?"
        linkText="Sign Up"
        onLinkPress={() => navigation.navigate("ProviderSignUp")}
      />
    </View>
  );
};

export default ProviderSignIn;

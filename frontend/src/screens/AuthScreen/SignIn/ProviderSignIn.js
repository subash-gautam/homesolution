import React, { useState } from "react";
import {
  View,
  Alert,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons from expo
import Input from "../../../components/Input";
import Button from "../../../components/Button.js/Index";
import Footer from "../../../components/Footer";
import axios from "axios";
import backend from "../../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

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

  // Handle sign-in logic
  const handleSignIn = async () => {
    if (!phone || !password) {
      Alert.alert("Missing Fields", "Please fill in all fields.");
      return;
    }

    try {
      // Send login request to the backend
      const response = await axios.post(
        `${backend.backendUrl}/providers/login`,
        { phone, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Check if the response status is successful
      if (response.status === 200) {
        const { token, provider } = response.data;

        // Ensure a token is received
        if (token) {
          await storeData(token, provider);

          // Navigate based on isFirstTime flag
          if (provider.isFirstTime) {
            navigation.navigate("ProviderTabs"); // First-time login
          } else {
            navigation.navigate("ProviderTabs"); // Regular login
          }
        } else {
          Alert.alert("Error", "No token received from server.");
        }
      } else {
        Alert.alert("Error", "Unexpected response from server.");
      }
    } catch (error) {
      // Handle different types of errors
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
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Provider Sign In</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Image View */}
        <View style={styles.imageView}>
          <Image
            source={require("../../../assets/Login.png")} // Replace with your image path
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* Phone Input */}
        <Input
          iconName="phone"
          placeholder="Phone"
          value={phone}
          onChangeText={setPhone}
          autoCapitalize="none"
        />

        {/* Password Input */}
        <Input
          iconName="lock"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Sign-In Button */}
        <Button title="Sign In" onPress={handleSignIn} />

        {/* Footer */}
        <View style={styles.footerContainer}>
          <Footer
            text="Don't have an account?"
            linkText="Sign Up"
            onLinkPress={() => navigation.navigate("ProviderSignUp")}
          />

          <Footer
            text="Forgot Password?"
            linkText="Reset Password"
            onLinkPress={() => navigation.navigate("ForgotPassword")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  backButton: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 16,
    justifyContent: "center", // Center content vertically
  },
  imageView: {
    alignItems: "center",
    marginBottom: 24,
  },
  image: {
    width: 400,
    height: 200,
  },
  footerContainer: {
    alignItems: "center", // Center the footer container
    //marginTop: 0, // Adjust this value to control the space above the footer
  },
});

export default ProviderSignIn;

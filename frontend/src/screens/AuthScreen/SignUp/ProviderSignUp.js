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
import { SafeAreaView } from "react-native-safe-area-context";

const ProviderSignUp = ({ navigation }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle sign-up logic
  const handleSignUp = () => {
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

    axios
      .post(`${backend.backendUrl}/providers/register`, providerData, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log("API Response:", response.data);
        if (response.status === 200 || response.status === 201) {
          const token = response.data.token; // Assuming the token is returned in response.data.token
          if (token) {
            console.log("Token received:", token);
            const successMessage =
              response.data.message || "Registration successful!";
            Alert.alert("Success", successMessage);
            navigation.navigate("ProviderInformation", { name, phone });
          } else {
            Alert.alert("Error", "No token received from server.");
          }
        } else {
          Alert.alert("Error", "Unexpected response from server.");
        }
      })
      .catch((error) => {
        console.error("Sign-up error:", error);
        if (error.response) {
          const errorMessage =
            error.response.data?.message ||
            `Server error (${error.response.status}). Please try again.`;
          Alert.alert("Error", errorMessage);
        } else if (error.request) {
          Alert.alert(
            "Error",
            "No response from the server. Please try again."
          );
        } else {
          Alert.alert(
            "Error",
            "An unexpected error occurred. Please try again."
          );
        }
      })
      .finally(() => setLoading(false)); // Stop loading
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
        <Text style={styles.headerTitle}>Provider Sign Up</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Image View */}
        <View style={styles.imageView}>
          <Image
            source={require("../../../assets/Signup.png")} // Replace with your image path
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* Name Input */}
        <Input
          iconName="person"
          placeholder="Name"
          value={name}
          onChangeText={setName}
          keyboardType="default"
        />

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

        {/* Confirm Password Input */}
        <Input
          iconName="lock"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        {/* Sign-Up Button */}
        <Button
          title={loading ? "Signing Up..." : "Sign Up"}
          onPress={handleSignUp}
          disabled={loading}
        />

        {/* Footer */}
        <View style={styles.footerContainer}>
          <Footer
            text="Already have an account?"
            linkText="Sign In"
            onLinkPress={() => navigation.navigate("ProviderSignIn")}
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
    alignItems: "center",
  },
});

export default ProviderSignUp;

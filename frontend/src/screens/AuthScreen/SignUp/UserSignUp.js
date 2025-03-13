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
import AuthHeader from "../../../components/AuthHeader";
import Input from "../../../components/Input";
import Button from "../../../components/Button.js/Index";
import Footer from "../../../components/Footer";
//import styles from "./styles";
import axios from "axios"; // Import axios
import backend from "../../../utils/api";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage"; // For storing tokens

const UserSignUp = ({ navigation }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  // Handle user registration
  const handleSignUp = async () => {
    if (!name || !phone || !password || !confirmPassword) {
      Alert.alert("Missing Fields", "Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match.");
      return;
    }

    const userData = {
      name,
      phone,
      password,
    };

    try {
      const response = await axios.post(
        `${backend.backendUrl}/api/users/register`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        const { token, user } = response.data; // Extract token and user data from response

        // Store the token in AsyncStorage
        await AsyncStorage.setItem("userToken", token);

        // Store user data (name and phone from component state)
        const userDataToStore = { name, phone };
        await AsyncStorage.setItem("userData", JSON.stringify(userDataToStore));

        // Log the API response to the terminal
        console.log("API Response:", response.data);

        // Show success message
        Alert.alert("Success", "Registration successful!", [
          {
            text: "OK",
            onPress: () => navigation.navigate("UserSignIn"), // Navigate to the sign-in screen
          },
        ]);
      }
    } catch (error) {
      if (error.response) {
        Alert.alert(
          "Error",
          error.response.data.message || "Registration failed."
        );
      } else if (error.request) {
        Alert.alert("Error", "No response from the server. Please try again.");
      } else {
        Alert.alert("Error", "An unexpected error occurred. Please try again.");
      }
      console.error("Sign-up error:", error);
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
        <Text style={styles.headerTitle}>User Sign Up</Text>
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
            onLinkPress={() => navigation.navigate("UserSignIn")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
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
export default UserSignUp;

import React, { useState } from "react";
import { View, Alert } from "react-native";
import AuthHeader from "../../../components/AuthHeader";
import Input from "../../../components/Input";
import Button from "../../../components/Button.js/Index";
import Footer from "../../../components/Footer";
import styles from "./styles";
import axios from "axios"; // Import axios
import backend from "../../../utils/api";

const ProviderSignUp = ({ navigation }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state

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

    const userData = { name, phone, password };

    try {
      const response = await axios.post(
        `${backend.backendUrl}/providers/register`,
        userData,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("API Response:", response.data); // Debugging

      if (response.status === 200 || response.status === 201) {
        const successMessage =
          response.data.message || "Registration successful!";
        Alert.alert("Success", successMessage);
        navigation.navigate("ProviderSignIn");
      } else {
        Alert.alert("Error", "Unexpected response from server.");
      }
    } catch (error) {
      console.error("Sign-up error:", error);

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
    } finally {
      setLoading(false); // Stop loading
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

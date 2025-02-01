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
import { useAuth } from "../../../components/AuthContext";
const UserSignIn = ({ navigation }) => {
  const { login } = useAuth(); // Get login function from context
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    if (!phone || !password) {
      Alert.alert("Error", "Please enter both phone and password.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${backend.backendUrl}/users/login`, {
        phone,
        password,
      });

      if (response.status >= 200 && response.status < 300) {
        const { token, user } = response.data;

        await AsyncStorage.multiSet([
          ["userToken", token],
          ["userData", JSON.stringify(user)],
        ]);

        login(user, token); // 🔹 Update global authentication state

        Alert.alert("Success", "Login successful!");
        navigation.navigate("UserTabs");
      } else {
        Alert.alert("Error", "Unexpected response from the server.");
      }
    } catch (error) {
      Alert.alert("Error", "Sign-in failed. Please try again.");
    } finally {
      setIsLoading(false);
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

import React, { useState } from "react";
import { View, Alert } from "react-native";
import AuthHeader from "../../../components/AuthHeader";
import Input from "../../../components/Input";
import Button from "../../../components/Button.js/Index";
import Footer from "../../../components/Footer";
import styles from "./styles";
import axios from "axios"; // Import axios
import backend from "../../../utils/api";

const UserSignIn = ({ navigation }) => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    try {
      const response = await axios.post(
        `${backend.backendUrl}/users/login`, // Replace with your backend URL
        { phone, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        navigation.navigate("UserTabs");
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
        title="User Sign In"
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
        onLinkPress={() => navigation.navigate("UserSignUp")}
      />
    </View>
  );
};

export default UserSignIn;

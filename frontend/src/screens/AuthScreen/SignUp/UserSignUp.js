import React, { useState } from "react";
import { View, Alert } from "react-native";
import AuthHeader from "../../../components/AuthHeader";
import Input from "../../../components/Input";
import Button from "../../../components/Button.js/Index";
import Footer from "../../../components/Footer";
import styles from "./styles";
import axios from "axios"; // Import axios
import backend from "../../../utils/api";

const UserSignUp = ({ navigation }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async () => {
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
        "http://192.168.1.5:3001/api/users/register",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        Alert.alert("Success", "Registration successful!");
        navigation.navigate("UserSignIn");
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
    <View style={styles.container}>
      <AuthHeader
        title="User Sign Up"
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
      <Button title="Sign Up" onPress={handleSignUp} />
      <Footer
        text="Already have an account?"
        linkText="Sign In"
        onLinkPress={() => navigation.navigate("UserSignIn")}
      />
    </View>
  );
};

export default UserSignUp;

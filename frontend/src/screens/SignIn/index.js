import React, { useState } from "react";
import { View } from "react-native";
import Header from "../../components/AuthHeader";
import Input from "../../components/Input";
import Button from "../../components/Button.js/Index";
import Footer from "../../components/Footer";
import styles from "./styles";

const SignIn = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async () => {
    if (!email.includes("@")) {
      alert("Invalid Email: Please enter a valid email address.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Password Mismatch: Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        navigation.navigate("Home");
      } else {
        const error = await response.json();
        alert(`Sign-In Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Sign-up error:", error);
      alert(
        "Sign-In Error: An unexpected error occurred. Please try again later."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Sign In" onBackPress={() => navigation.goBack()} />
      <Input
        iconName="phone"
        placeholder="phone"
        value={phone}
        onChangeText={setPhone}
        autoCapitalize="none"
      />
      <Input
        iconName="email"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <Input
        iconName="lock"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Sign In" onPress={handleSignUp} />
      <Footer
        text="Don't have an account?"
        linkText="Sign Up"
        onLinkPress={() => navigation.navigate("SignUp")}
      />
    </View>
  );
};

export default SignIn;

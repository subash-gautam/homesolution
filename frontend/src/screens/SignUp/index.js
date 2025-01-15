import React, { useState } from "react";
import { View } from "react-native";
import Header from "../../components/AuthHeader";
import Input from "../../components/Input";
import Button from "../../components/Button.js/Index";
import Footer from "../../components/Footer";
import styles from "./styles";

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
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
        alert(`Sign-up Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Sign-up error:", error);
      alert(
        "Sign-up Error: An unexpected error occurred. Please try again later."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Sign Up" onBackPress={() => navigation.goBack()} />
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Input
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <Button title="Sign Up" onPress={handleSignUp} />
      <Footer
        text="Already have an account?"
        linkText="Sign in"
        onLinkPress={() => navigation.navigate("SignInScreen")}
      />
    </View>
  );
};

export default SignUpScreen;

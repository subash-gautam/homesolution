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
import { Ionicons } from "@expo/vector-icons";
import Input from "../../../components/Input";
import Button from "../../../components/Button.js/Index";
import Footer from "../../../components/Footer";
import axios from "axios";
import backend from "../../../utils/api";
import { SafeAreaView } from "react-native-safe-area-context";

const ProviderSignUp = ({ navigation }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle sign-up logic
  const handleSignUp = () => {
    if (!name || !phone || !email || !password || !confirmPassword) {
      Alert.alert("Missing Fields", "Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match.");
      return;
    }

    setLoading(true);
    const providerData = { name, phone, email, password };

    axios
      .post(`${backend.backendUrl}/api/providers/register`, providerData, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log("API Response:", response.data);
        if (response.status === 200 || response.status === 201) {
          const token = response.data.token;
          if (token) {
            console.log("Token received:", token);
            const successMessage =
              response.data.message || "Registration successful!";
            Alert.alert("Success", successMessage);
            navigation.navigate("ProviderSignIn", { phone });
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
      .finally(() => setLoading(false));
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Provider Sign Up</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageView}>
          <Image
            source={require("../../../assets/Signup.png")}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <Input
          iconName="person"
          placeholder="Name"
          value={name}
          onChangeText={setName}
          keyboardType="default"
        />
        <Input
          iconName="email"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Input
          iconName="phone"
          placeholder="Phone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
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

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  backButton: { marginRight: 8 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  scrollViewContent: { flexGrow: 1, padding: 16 },
  imageView: { alignItems: "center", marginBottom: 24 },
  image: { width: 400, height: 200 },
  footerContainer: { alignItems: "center" },
});

export default ProviderSignUp;

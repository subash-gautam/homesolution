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
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
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
      const response = await axios.post(
        `${backend.backendUrl}/api/users/login`,
        {
          phone,
          password,
        }
      );

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
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>User Sign In</Text>
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

export default UserSignIn;

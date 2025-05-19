import React, { useState } from "react";
import {
  View,
  Alert,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import backend from "../../../utils/api";
import Button from "../../../components/Button.js/Index";
import Footer from "../../../components/Footer";

const FloatingLabelInput = ({
  label,
  iconName,
  value,
  secureTextEntry,
  showPassword,
  togglePasswordVisibility,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.inputContainer}>
      <Ionicons
        name={iconName}
        size={20}
        color={isFocused ? "#007AFF" : "#8E8E93"}
        style={styles.inputIcon}
      />
      <TextInput
        style={[styles.input, isFocused && styles.focusedInput]}
        value={value}
        placeholder={!isFocused ? label : ""}
        placeholderTextColor="#8E8E93"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        secureTextEntry={secureTextEntry && !showPassword}
        {...props}
      />
      {secureTextEntry && (
        <TouchableOpacity
          style={styles.rightIconContainer}
          onPress={togglePasswordVisibility}
        >
          <Ionicons
            name={showPassword ? "eye" : "eye-off"}
            size={20}
            color="#8E8E93"
          />
        </TouchableOpacity>
      )}
      {(isFocused || value) && (
        <Text style={[styles.label, isFocused && styles.focusedLabel]}>
          {label}
        </Text>
      )}
    </View>
  );
};

const ProviderSignUp = ({ navigation }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const checkPasswordStrength = (text) => {
    let strength = 0;

    if (text.length >= 5) strength += 1;
    if (/[A-Z]/.test(text)) strength += 1;
    if (/[a-z]/.test(text)) strength += 1;
    if (/[0-9]/.test(text)) strength += 1;
    if (/[^A-Za-z0-9]/.test(text)) strength += 1; // Optional: special character

    switch (strength) {
      case 0:
      case 1:
      case 2:
        setPasswordStrength("Weak");
        break;
      case 3:
      case 4:
        setPasswordStrength("Medium");
        break;
      case 5:
        setPasswordStrength("Strong");
        break;
      default:
        setPasswordStrength("");
    }
  };
  const handleSignUp = async () => {
    if (
      !name.trim() ||
      !phone.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      Alert.alert("Missing Fields", "Please fill in all fields.");
      return;
    }

    // Phone validation: exactly 10 digits
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      Alert.alert("Invalid Phone", "Phone must be exactly 10 digits.");
      return;
    }

    // Password validation: min 5 chars, at least one uppercase, lowercase, number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{5,}$/; // Special char optional
    if (!passwordRegex.test(password)) {
      Alert.alert(
        "Weak Password",
        "Password must be at least 5 characters long,\nwith at least one uppercase letter,\none lowercase letter, and one number."
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const providerData = { name, phone, email, password };
      const response = await axios.post(
        `${backend.backendUrl}/api/providers/register`,
        providerData,
        { headers: { "Content-Type": "application/json" } }
      );

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
    } catch (error) {
      let errorMessage = "Sign-up failed";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        errorMessage = "No response from server";
      }
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
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
        <View style={styles.imageContainer}>
          <Image
            source={require("../../../assets/Signup.png")}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <FloatingLabelInput
          label="Full Name"
          iconName="person-outline"
          value={name}
          onChangeText={setName}
          keyboardType="default"
        />

        <FloatingLabelInput
          label="Email Address"
          iconName="mail-outline"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoComplete="email"
        />

        <FloatingLabelInput
          label="Phone Number"
          iconName="call-outline"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          autoComplete="tel"
        />

        <FloatingLabelInput
          label="Password"
          iconName="lock-closed-outline"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            checkPasswordStrength(text);
          }}
          secureTextEntry
          showPassword={showPassword}
          togglePasswordVisibility={togglePasswordVisibility}
        />
        {password && (
          <View style={styles.strengthContainer}>
            <View
              style={[
                styles.strengthBar,
                passwordStrength === "Weak"
                  ? styles.weak
                  : passwordStrength === "Medium"
                  ? styles.medium
                  : passwordStrength === "Strong"
                  ? styles.strong
                  : null,
              ]}
            />
            <Text style={styles.strengthText}>{passwordStrength}</Text>
          </View>
        )}
        <FloatingLabelInput
          label="Confirm Password"
          iconName="lock-closed-outline"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          showPassword={showPassword}
          togglePasswordVisibility={togglePasswordVisibility}
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
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 32,
  },
  image: {
    width: 300,
    height: 200,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputIcon: {
    position: "absolute",
    left: 16,
    top: 18,
    zIndex: 2,
  },
  input: {
    backgroundColor: "#F2F2F7",
    borderRadius: 10,
    paddingVertical: 16,
    paddingLeft: 48,
    paddingRight: 48,
    fontSize: 16,
    color: "#1C1C1E",
    borderWidth: 1,
    borderColor: "#F2F2F7",
  },
  focusedInput: {
    borderColor: "#007AFF",
    backgroundColor: "#FFFFFF",
  },
  label: {
    position: "absolute",
    left: 48,
    top: -8,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 4,
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "500",
  },
  focusedLabel: {
    color: "#007AFF",
  },
  rightIconContainer: {
    position: "absolute",
    right: 16,
    top: 18,
    zIndex: 2,
    padding: 4,
  },
  footerContainer: {
    marginTop: 32,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    paddingTop: 24,
  },
  strengthContainer: {
    marginBottom: 20,
    alignItems: "flex-start",
    width: "100%",
  },
  strengthBar: {
    height: 6,
    borderRadius: 3,
    width: "100%",
    marginBottom: 6,
  },
  weak: {
    backgroundColor: "#FF4D4D",
    width: "33%",
  },
  medium: {
    backgroundColor: "#FFA500",
    width: "66%",
  },
  strong: {
    backgroundColor: "#4CAF50",
    width: "100%",
  },
  strengthText: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "500",
  },
});

export default ProviderSignUp;

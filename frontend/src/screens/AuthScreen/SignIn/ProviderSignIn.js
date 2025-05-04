import React, { useState, useEffect } from "react";
import {
  View,
  Alert,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import backend from "../../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../../components/AuthContext";
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

const ProviderSignIn = ({ navigation }) => {
  const { login } = useAuth();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const clearPreviousSession = async () => {
      try {
        await AsyncStorage.multiRemove(["providerToken", "providerData"]);
      } catch (error) {
        console.error("Session cleanup error:", error);
      }
    };
    clearPreviousSession();
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignIn = async () => {
    if (!phone.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${backend.backendUrl}/api/providers/login`,
        { phone: phone.trim(), password: password.trim() },
        { timeout: 15000 }
      );

      if (response.data.token && response.data.provider) {
        await AsyncStorage.multiSet([
          ["providerToken", response.data.token],
          ["providerData", JSON.stringify(response.data.provider)],
        ]);

        login(response.data.provider, response.data.token);

        // Check if this is the first time login
        if (response.data.provider.isFirstTime) {
          // Navigate to ProviderOnboarding screen if it's the first time
          // Using navigate instead of reset to avoid navigation errors
          navigation.navigate("ProviderInformation");
        } else {
          // Navigate to ProviderTabs if not the first time
          navigation.reset({
            routes: [{ name: "ProviderTabs" }],
          });
        }
      }
    } catch (error) {
      let errorMessage = "Authentication failed";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        errorMessage = "No response from server";
      }
      Alert.alert("Error", errorMessage);
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Provider Sign In</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image
            source={require("../../../assets/Login.png")}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <FloatingLabelInput
          label="Phone Number"
          iconName="phone-portrait-outline"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          autoComplete="tel"
          textContentType="telephoneNumber"
        />

        <FloatingLabelInput
          label="Password"
          iconName="lock-closed-outline"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          showPassword={showPassword}
          togglePasswordVisibility={togglePasswordVisibility}
          autoComplete="password"
          textContentType="password"
          onSubmitEditing={handleSignIn}
        />

        <TouchableOpacity
          style={styles.forgotPassword}
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        {isLoading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <Button title="Sign In" onPress={handleSignIn} />
        )}

        <View style={styles.footerContainer}>
          <Footer
            text="Don't have an account?"
            linkText="Sign Up"
            onLinkPress={() => navigation.navigate("ProviderSignUp")}
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
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "500",
  },
  footerContainer: {
    marginTop: 32,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    paddingTop: 24,
  },
});

export default ProviderSignIn;

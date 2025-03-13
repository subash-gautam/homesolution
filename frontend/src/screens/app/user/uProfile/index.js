// Uprofile.js
import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../../components/AuthContext";
import { ThemeContext } from "../../../../context/ThemeContext";
import backend from "../../../../utils/api";

const Uprofile = () => {
  const { user, loading, logout, updateUserProfile } = useAuth();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState("User");
  const [firstLogin, setFirstLogin] = useState(false);

  // Fetch user data and check if it's the first login
  useEffect(() => {
    const fetchDataAndCheckFirstLogin = async () => {
      try {
        // Fetch user data
        const userData = await AsyncStorage.getItem("userData");
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          setUserName(parsedUserData.name || "User");
        }

        // Check if it's the first login
        const hasLoggedInBefore = await AsyncStorage.getItem(
          "hasLoggedInBefore"
        );
        if (hasLoggedInBefore === null) {
          setFirstLogin(true);
          await AsyncStorage.setItem("hasLoggedInBefore", "true");
        } else {
          setFirstLogin(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchDataAndCheckFirstLogin();
  }, []);

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  // Handle Profile Image Upload
  const handleImageUpload = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Please allow access to your photos!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!pickerResult.canceled) {
      const uri = pickerResult.assets[0].uri;
      const filename = uri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      const formData = new FormData();
      formData.append("file", { uri, name: filename, type });

      try {
        const response = await fetch(
          `${backend.backendUrl}/users/upload-profile-image`,
          {
            method: "POST",
            body: formData,
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${user.token}`, // Assuming you have a token for authentication
            },
          }
        );

        const data = await response.json();
        if (response.ok) {
          updateUserProfile({ photoURL: data.imageUrl }); // Update the profile with the new image URL
          Alert.alert("Success", "Profile image uploaded successfully!");
        } else {
          Alert.alert(
            "Upload Failed",
            data.message || "Failed to upload image"
          );
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        Alert.alert(
          "Upload Failed",
          "An error occurred while uploading the image"
        );
      }
    }
  };

  // Menu Navigation
  const handleMenuPress = (menuItem) => {
    const navigationMap = {
      "Personal Data": "PersonalData",
      Settings: "Settings",
      Dashboard: "Dashboard",
      "Billing Details": "Billing",
      "Privacy Policy": "PrivacyPolicy",
      "Help & Support": "Support",
      "Terms & Condition": "Terms",
      "About App": "About",
      "My Reviews": "Reviews",
    };
    if (menuItem === "LogOut") {
      Alert.alert("Log Out", "Are you sure you want to log out?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          onPress: () => {
            logout();
            navigation.navigate("UserSignIn");
          },
        },
      ]);
    } else if (navigationMap[menuItem]) {
      navigation.navigate(navigationMap[menuItem]);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6B46C1" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#6B46C1", "#4299E1"]}
      style={styles.gradientContainer}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#fff"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerText}>My Profile</Text>
        </View>

        {/* Profile Card */}
        <LinearGradient
          colors={["rgba(255,255,255,0.9)", "rgba(245,245,255,0.9)"]}
          style={styles.profileCard}
        >
          {/* Profile Image */}
          <TouchableOpacity onPress={handleImageUpload}>
            <Image
              source={
                user?.photoURL
                  ? { uri: user.photoURL }
                  : require("../../../../assets/profile.png")
              }
              style={styles.profileImage}
            />
          </TouchableOpacity>

          {/* User Name */}
          <Text style={styles.userName}>{userName}</Text>
        </LinearGradient>

        {/* Menu Options */}
        <View style={styles.menu}>
          {[
            { icon: "document-text", text: "Personal Data" },
            { icon: "settings", text: "Settings" },
            { icon: "grid", text: "Dashboard" },
            { icon: "card", text: "Billing Details" },
            { icon: "document-lock", text: "Privacy Policy" },
            { icon: "help-circle", text: "Help & Support" },
            { icon: "document-text", text: "Terms & Condition" },
            { icon: "information-circle", text: "About App" },
            { icon: "star", text: "My Reviews" },
            { icon: "log-out", text: "LogOut" },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuButton}
              onPress={() => handleMenuPress(item.text)}
            >
              <Ionicons name={item.icon} size={22} color="#6B46C1" />
              <Text style={styles.menuText}>{item.text}</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color="rgba(107,70,193,0.5)"
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

// Styles
const styles = StyleSheet.create({
  gradientContainer: { flex: 1 },
  scrollContent: { paddingBottom: 80 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
  },
  backButton: { padding: 8 },
  headerText: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: "white",
  },
  profileCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  userName: { fontSize: 18, fontWeight: "bold", color: "#333", marginTop: 10 },
  menuButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 0.5,
  },
  menuText: { flex: 1, fontSize: 16, marginLeft: 15 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Uprofile;

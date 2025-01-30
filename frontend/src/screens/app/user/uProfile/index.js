import React, { useState } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import ProfileHeader from "../../../../components/ProfileHeader";
import { useAuth } from "../../../../components/AuthContext";

const Uprofile = () => {
  const { user, loading, logout, updateUserProfile } = useAuth();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const handleImageUpload = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
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
      updateUserProfile({ photoURL: pickerResult.assets[0].uri });
    }
  };

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
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerText}>My Profile</Text>
        </View>

        {/* Profile Section */}
        <LinearGradient
          colors={["rgba(255,255,255,0.9)", "rgba(245,245,255,0.9)"]}
          style={styles.profileCard}
        >
          {/* Profile Image */}
          <View style={styles.imageContainer}>
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
          </View>

          {/* User Name */}
          <View style={styles.nameContainer}>
            <Text style={styles.userName}>
              {user?.displayName || user?.name || "Guest User"}
            </Text>
          </View>
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
            <LinearGradient
              key={index}
              colors={["rgba(255,255,255,0.95)", "rgba(245,245,255,0.95)"]}
              style={styles.menuItem}
            >
              <TouchableOpacity
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
            </LinearGradient>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

// Styles
const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
  },
  backButton: {
    padding: 8,
  },
  headerText: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: "white",
    marginRight: 32,
  },
  profileCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    alignItems: "center", // Center align children
  },
  imageContainer: {
    marginBottom: 15, // Add space between image and name
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60, // Make it circular
    borderWidth: 3,
    borderColor: "#6B46C1", // Add a border to distinguish the image
  },
  nameContainer: {
    alignItems: "center",
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2D3748",
  },
  menu: {
    paddingHorizontal: 15,
  },
  menuItem: {
    borderRadius: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  menuButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
  },
  menuText: {
    fontSize: 16,
    color: "#2D3748",
    marginLeft: 15,
    flex: 1,
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Uprofile;

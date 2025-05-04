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
  Modal,
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
  const { theme, setTheme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState("User");
  const [showThemeModal, setShowThemeModal] = useState(false);

  // Theme-aware colors
  const colors = {
    background:
      theme === "dark" ? "#1a1a1a" : theme === "light" ? "#fff" : "#f5f5f5",
    text: theme === "dark" ? "#e0e0e0" : "#333",
    card: theme === "dark" ? "#2d2d2d" : "#fff",
    primary: "#6B46C1",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          setUserName(parsedUserData.name || "User");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleImageUpload = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          "Permission required",
          "Please allow access to your photos!"
        );
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (pickerResult.canceled) return;

      const uri = pickerResult.assets[0].uri;
      const filename = uri.split("/").pop();
      const type = pickerResult.assets[0].mimeType;

      const formData = new FormData();
      formData.append("userProfile", {
        uri,
        name: filename,
        type,
      });

      const response = await fetch(`${backend.backendUrl}/api/users/profile`, {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Upload failed");
      }

      // Verify server response structure
      if (!responseData.user?.profile) {
        throw new Error("Invalid server response");
      }

      const imageUrl = `${backend.backendUrl}/uploads/${
        responseData.user.profile
      }?t=${Date.now()}`;

      // Verify image exists
      const imageCheck = await fetch(imageUrl);
      if (!imageCheck.ok) {
        throw new Error("Uploaded image not found");
      }

      updateUserProfile({ photoURL: imageUrl });
      Alert.alert("Success", "Profile image updated successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Error", error.message || "Failed to update profile");
    }
  };

  const handleMenuPress = (menuItem) => {
    if (menuItem === "LogOut") {
      Alert.alert("Log Out", "Are you sure you want to log out?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          onPress: async () => {
            await logout();
            navigation.reset({
              index: 0,
              routes: [{ name: "SplashScreen" }],
            });
          },
        },
      ]);
    } else if (menuItem === "Appearance") {
      setShowThemeModal(true);
    } else {
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
      navigation.navigate(navigationMap[menuItem]);
    }
  };

  const handleThemeSelect = async (selectedTheme) => {
    try {
      await AsyncStorage.setItem("appTheme", selectedTheme);
      setTheme(selectedTheme);
    } catch (error) {
      console.error("Error saving theme:", error);
    } finally {
      setShowThemeModal(false);
    }
  };

  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => setRefreshing(true)}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.card }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerText, { color: colors.text }]}>
            My Profile
          </Text>
        </View>

        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
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
          <Text style={[styles.userName, { color: colors.text }]}>
            {userName}
          </Text>
        </View>

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
            { icon: "color-palette", text: "Appearance" },
            { icon: "log-out", text: "LogOut" },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuButton, { borderBottomColor: colors.border }]}
              onPress={() => handleMenuPress(item.text)}
            >
              <Ionicons name={item.icon} size={22} color={colors.primary} />
              <Text style={[styles.menuText, { color: colors.text }]}>
                {item.text}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.primary}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Theme Selection Modal */}
      <Modal
        visible={showThemeModal}
        onRequestClose={() => setShowThemeModal(false)}
        transparent={true}
        animationType="fade"
      >
        <View
          style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}
        >
          <View style={[styles.themeModal, { backgroundColor: colors.card }]}>
            {["Default", "Light", "Dark"].map((themeOption) => (
              <TouchableOpacity
                key={themeOption}
                style={styles.themeOption}
                onPress={() => handleThemeSelect(themeOption.toLowerCase())}
              >
                <Text style={[styles.themeText, { color: colors.text }]}>
                  {themeOption}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingBottom: 80,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  backButton: {
    padding: 8,
  },
  headerText: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
  },
  profileCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginTop: -20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: "#6B46C1",
    borderWidth: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  menu: {
    marginTop: 20,
  },
  menuButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 0.5,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 15,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  themeModal: {
    width: "80%",
    borderRadius: 10,
    padding: 20,
  },
  themeOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  themeText: {
    fontSize: 18,
    textAlign: "center",
  },
});

export default Uprofile;

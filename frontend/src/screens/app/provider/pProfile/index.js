import React, { useState, useEffect } from "react";
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
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

const Pprofile = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState({
    name: "Provider", // Default name
    designation: "Electrician",
    image: require("../../../../assets/profile.png"), // Default image
    rating: 4.9, // Default rating
    jobsCompleted: 127, // Default jobs completed
    reviews: 5, // Default reviews
  });
  const [loading, setLoading] = useState(true); // Loading state for fetching data
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        // Fetch the token from AsyncStorage
        const token = await AsyncStorage.getItem("providerToken");
        if (token) {
          // Fetch provider data using the token (you may need to call an API here)
          const providerData = await AsyncStorage.getItem("providerData");
          if (providerData) {
            const parsedUserData = JSON.parse(providerData);
            setUser((prevUser) => ({
              ...prevUser,
              name: parsedUserData.name || "Provider",
              image:
                parsedUserData.image ||
                require("../../../../assets/profile.png"),
              rating: parsedUserData.rating || 4.9,
              jobsCompleted: parsedUserData.jobsCompleted || 127,
              reviews: parsedUserData.reviews || 5,
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching provider data:", error);
      } finally {
        setLoading(false); // Stop loading after fetching data
      }
    };
    fetchProviderData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const pickImage = async () => {
    // Request permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Sorry, we need camera roll permissions to make this work!"
      );
      return;
    }

    // Launch image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri;

      // Upload the image to the backend
      const uploadSuccess = await uploadImageToBackend(selectedImageUri);

      if (uploadSuccess) {
        // Update local state with the new image URI
        setUser((prevUser) => ({
          ...prevUser,
          image: { uri: selectedImageUri },
        }));

        // Optionally, save the updated image URI in AsyncStorage
        const providerData = await AsyncStorage.getItem("providerData");
        if (providerData) {
          const parsedUserData = JSON.parse(providerData);
          parsedUserData.image = { uri: selectedImageUri };
          await AsyncStorage.setItem(
            "providerData",
            JSON.stringify(parsedUserData)
          );
        }
      }
    }
  };

  const uploadImageToBackend = async (imageUri) => {
    try {
      // Simulate uploading the image to the backend
      // Replace this with your actual API call to upload the image
      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        name: "profile.jpg",
        type: "image/jpeg",
      });

      const token = await AsyncStorage.getItem("providerToken");
      const response = await fetch("http://192.168.1.74:3000/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Image uploaded successfully:", result);
        return true;
      } else {
        console.error("Failed to upload image:", response.statusText);
        Alert.alert("Error", "Failed to upload image. Please try again.");
        return false;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error", "An error occurred while uploading the image.");
      return false;
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
          {/* Profile Image Section */}
          <TouchableOpacity
            onPress={pickImage}
            style={styles.profileImageContainer}
          >
            <Image source={user.image} style={styles.profileImage} />
          </TouchableOpacity>

          {/* Name and Designation Section */}
          <View style={styles.nameContainer}>
            <Text style={styles.nameText}>{user.name}</Text>
            <Text style={styles.designationText}>{user.designation}</Text>
          </View>

          {/* Stats Section (Rating, Jobs, Reviews) */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.rating}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.jobsCompleted}</Text>
              <Text style={styles.statLabel}>Jobs</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.reviews}★</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
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
              <TouchableOpacity style={styles.menuButton}>
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
    alignItems: "center",
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#6B46C1",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  nameContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  nameText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2D3748",
  },
  designationText: {
    fontSize: 16,
    color: "#718096",
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D3748",
  },
  statLabel: {
    fontSize: 14,
    color: "#718096",
    marginTop: 4,
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
    backgroundColor: "#6B46C1",
  },
});

export default Pprofile;

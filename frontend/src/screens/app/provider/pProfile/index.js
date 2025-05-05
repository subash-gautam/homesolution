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
import { useNavigation } from "@react-navigation/native";
import backend from "../../../../utils/api";

const Pprofile = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState({
    name: "Provider",
    image: require("../../../../assets/profile.png"),
    rating: 4.9,
    jobsCompleted: 127,
    reviews: 5,
  });
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchProviderData = async () => {
    try {
      const token = await AsyncStorage.getItem("providerToken");
      const providerData = await AsyncStorage.getItem("providerData");

      if (token && providerData) {
        const parsedData = JSON.parse(providerData);
        const currentProviderId = parsedData.id;

        // Get local image if available
        const savedImage = await AsyncStorage.getItem("savedProfileImage");
        const parsedImage = savedImage ? JSON.parse(savedImage) : null;

        const profileImage =
          parsedImage?.providerId === currentProviderId
            ? parsedImage.imageUrl
            : parsedData.profile
            ? `${backend.backendUrl}/uploads/${parsedData.profile}`
            : null;

        setUser({
          name: parsedData.name || "Provider",
          image: profileImage
            ? { uri: profileImage }
            : require("../../../../assets/profile.png"),
          rating: parsedData.rating || 4.9,
          jobsCompleted: parsedData.jobsCompleted || 127,
          reviews: parsedData.reviews || 5,
        });

        // Update local storage if needed
        if (!parsedImage && parsedData.profile) {
          await AsyncStorage.setItem(
            "savedProfileImage",
            JSON.stringify({
              providerId: currentProviderId,
              imageUrl: `${backend.backendUrl}/uploads/${parsedData.profile}`,
            })
          );
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Error", "Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviderData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProviderData();
    setRefreshing(false);
  };

  const uploadImage = async (imageUri) => {
    try {
      const formData = new FormData();
      formData.append("ProviderProfile", {
        uri: imageUri,
        name: "profile.jpg",
        type: "image/jpeg",
      });

      const token = await AsyncStorage.getItem("providerToken");
      const response = await fetch(
        `${backend.backendUrl}/api/providers/profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      const newImageUrl = `${backend.backendUrl}/uploads/${data.updatedProvider.profile}`;

      // Update local storage
      const providerData = JSON.parse(
        await AsyncStorage.getItem("providerData")
      );
      const imageData = {
        providerId: providerData.id,
        imageUrl: newImageUrl,
      };

      await AsyncStorage.setItem(
        "savedProfileImage",
        JSON.stringify(imageData)
      );
      setUser((prev) => ({ ...prev, image: { uri: newImageUrl } }));
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Error", "Failed to update profile picture");
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Need camera roll access to upload images"
      );
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        await uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert("Error", "Failed to select image");
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.multiRemove([
      "providerToken",
      "providerData",
      "savedProfileImage",
    ]);
    navigation.replace("ProviderSignIn");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4299E1" />
      </View>
    );
  }

  const menuOptions = [
    { icon: "document-text", text: "Personal Data", screen: "PersonalData" },
    { icon: "settings", text: "Settings", screen: "Settings" },
    { icon: "grid", text: "Dashboard", screen: "Dashboard" },
    { icon: "card", text: "Billing Details", screen: "Billing" },
    { icon: "document-lock", text: "Privacy Policy", screen: "PrivacyPolicy" },
    { icon: "help-circle", text: "Help & Support", screen: "HelpSupport" },
    { icon: "document-text", text: "Terms & Conditions", screen: "Terms" },
    { icon: "information-circle", text: "About App", screen: "About" },
    { icon: "star", text: "My Reviews", screen: "Reviews" },
    { icon: "log-out", text: "Log Out", action: handleLogout },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#4299E1"]}
          />
        }
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerText}>My Profile</Text>
        </View>

        <View style={styles.profileCard}>
          <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
            <Image source={user.image} style={styles.profileImage} />
            <View style={styles.editIcon}>
              <Ionicons name="camera" size={20} color="white" />
            </View>
          </TouchableOpacity>
          <Text style={styles.nameText}>{user.name}</Text>

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
              <Text style={styles.statValue}>{user.reviews}</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {menuOptions.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() =>
                item.action ? item.action() : navigation.navigate(item.screen)
              }
            >
              <Ionicons name={item.icon} size={22} color="#4299E1" />
              <Text style={styles.menuText}>{item.text}</Text>
              <Ionicons name="chevron-forward" size={20} color="#CBD5E0" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4299E1",
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  backButton: {
    padding: 8,
  },
  headerText: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    color: "white",
    marginRight: 30,
  },
  profileCard: {
    backgroundColor: "white",
    borderRadius: 12,
    margin: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#4299E1",
    borderRadius: 15,
    padding: 5,
  },
  nameText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#2D3748",
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 10,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4299E1",
  },
  statLabel: {
    fontSize: 14,
    color: "#718096",
  },
  menuContainer: {
    paddingHorizontal: 15,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: "#2D3748",
    marginLeft: 15,
  },
});

export default Pprofile;

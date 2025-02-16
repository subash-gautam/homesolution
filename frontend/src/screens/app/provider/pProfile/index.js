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

const backend = {
  backendUrl: "http://192.168.1.2:3000",
};

const Pprofile = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState({
    name: "Provider",
    designation: "Electrician",
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
      if (token) {
        // Get the current provider's ID or unique identifier
        const providerData = await AsyncStorage.getItem("providerData");
        if (providerData) {
          const parsedUserData = JSON.parse(providerData);
          const currentProviderId = parsedUserData.id; // Assuming you have an ID field

          // Get the saved image data which includes provider ID
          const savedImageData = await AsyncStorage.getItem(
            "savedProfileImage"
          );
          const parsedImageData = savedImageData
            ? JSON.parse(savedImageData)
            : null;
          console.log(savedImageData);
          // Only use saved image if it belongs to current provider
          const profileImage =
            parsedImageData && parsedImageData.providerId === currentProviderId
              ? parsedImageData.imageUrl
              : parsedUserData.profileImage;

          setUser((prevUser) => ({
            ...prevUser,
            name: parsedUserData.name || "Provider",
            image: profileImage
              ? { uri: profileImage }
              : require("../../../../assets/profile.png"),
            rating: parsedUserData.rating || 4.9,
            jobsCompleted: parsedUserData.jobsCompleted || 127,
            reviews: parsedUserData.reviews || 5,
          }));

          // If no saved image for current provider, try to fetch from backend
          if (!profileImage) {
            console.log("trying fetching from backend");
            const response = await fetch(
              `${backend.backendUrl}/api/providers/profile`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (response.ok) {
              const data = await response.json();
              if (data.provider && data.provider.profileImage) {
                const fullImageUrl = `${backend.backendUrl}/uploads/${data.provider.profileImage}`;
                // Save image URL with provider ID
                const imageData = {
                  providerId: currentProviderId,
                  imageUrl: fullImageUrl,
                };
                await AsyncStorage.setItem(
                  "savedProfileImage",
                  JSON.stringify(imageData)
                );
                setUser((prevUser) => ({
                  ...prevUser,
                  image: { uri: fullImageUrl },
                }));
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error fetching provider data:", error);
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

  const uploadImageToBackend = async (imageUri) => {
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

      if (response.ok) {
        const data = await response.json();
        return data.updatedProvider.profile;
      } else {
        Alert.alert("Error", "Failed to upload image. Please try again.");
        return null;
      }
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Error", "An error occurred while uploading the image.");
      return null;
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Sorry, we need camera roll permissions to make this work!"
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri;
      const imageFilename = await uploadImageToBackend(selectedImageUri);

      if (imageFilename) {
        const fullImageUrl = `${backend.backendUrl}/uploads/${imageFilename}`;

        // Get current provider ID
        const providerData = await AsyncStorage.getItem("providerData");
        const parsedUserData = JSON.parse(providerData);
        const currentProviderId = parsedUserData.id;

        // Save image URL with provider ID
        const imageData = {
          providerId: currentProviderId,
          imageUrl: fullImageUrl,
        };
        await AsyncStorage.setItem(
          "savedProfileImage",
          JSON.stringify(imageData)
        );

        setUser((prevUser) => ({
          ...prevUser,
          image: { uri: fullImageUrl },
        }));

        // Update provider data
        if (providerData) {
          parsedUserData.profileImage = fullImageUrl;
          await AsyncStorage.setItem(
            "providerData",
            JSON.stringify(parsedUserData)
          );
        }
      }
    }
  };

  const handleLogout = async () => {
    // Clear all data including saved profile image
    await AsyncStorage.removeItem("providerToken");
    await AsyncStorage.removeItem("providerData");
    await AsyncStorage.removeItem("savedProfileImage");

    navigation.replace("ProviderSignIn");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6B46C1" />
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
    { icon: "document-text", text: "Terms & Condition", screen: "Terms" },
    { icon: "information-circle", text: "About App", screen: "About" },
    { icon: "star", text: "My Reviews", screen: "Reviews" },
    { icon: "log-out", text: "LogOut", action: handleLogout },
  ];

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

        <LinearGradient
          colors={["rgba(255,255,255,0.9)", "rgba(245,245,255,0.9)"]}
          style={styles.profileCard}
        >
          <TouchableOpacity
            onPress={pickImage}
            style={styles.profileImageContainer}
          >
            <Image source={user.image} style={styles.profileImage} />
          </TouchableOpacity>
          <View style={styles.nameContainer}>
            <Text style={styles.nameText}>{user.name}</Text>
            <Text style={styles.designationText}>{user.designation}</Text>
          </View>
        </LinearGradient>

        <View style={styles.menu}>
          {menuOptions.map((item, index) => (
            <LinearGradient
              key={index}
              colors={["rgba(255,255,255,0.95)", "rgba(245,245,255,0.95)"]}
              style={styles.menuItem}
            >
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() =>
                  item.action ? item.action() : navigation.navigate(item.screen)
                }
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

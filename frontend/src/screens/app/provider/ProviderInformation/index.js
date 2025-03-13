import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  Modal,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import styles from "./styles";
import backend from "../../../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const ProviderInformationScreen = ({ navigation, route }) => {
  const [selectedService, setSelectedService] = useState("");
  const [bio, setBio] = useState("");
  const [documentImages, setDocumentImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [providerData, setProviderData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: route.params?.name || "",
    email: "",
    phone: route.params?.phone || "",
    location: "",
    latitude: null,
    longitude: null,
    ratePerHr: "450",
    city: "Pokhara",
  });
  const [mapRegion, setMapRegion] = useState({
    latitude: 28.2096,
    longitude: 83.9856,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [isMapModalVisible, setIsMapModalVisible] = useState(false);
  const [markerPosition, setMarkerPosition] = useState({
    latitude: 28.2096,
    longitude: 83.9856,
  });

  const fetchAddressFromCoordinates = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=d11083a9b4d1445c8837c90624c68899`
      );

      if (response.data.features && response.data.features.length > 0) {
        return response.data.features[0].properties.formatted;
      }
      return `Lat: ${lat.toFixed(4)}, Long: ${lon.toFixed(4)}`;
    } catch (error) {
      console.error("Geocoding error:", error);
      return `Lat: ${lat.toFixed(4)}, Long: ${lon.toFixed(4)}`;
    }
  };

  const updateLocationData = async (latitude, longitude) => {
    try {
      const address = await fetchAddressFromCoordinates(latitude, longitude);

      setMarkerPosition({ latitude, longitude });
      setMapRegion((prev) => ({
        ...prev,
        latitude,
        longitude,
      }));
      setFormData((prev) => ({
        ...prev,
        latitude,
        longitude,
        location: address,
      }));
    } catch (error) {
      console.error("Error updating location:", error);
      Alert.alert("Error", "Failed to update location details");
    }
  };

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("providerToken");
        if (!storedToken) {
          Alert.alert(
            "Authentication Error",
            "Please sign in again to continue",
            [
              {
                text: "OK",
                onPress: () => navigation.navigate("ProviderSignIn"),
              },
            ]
          );
          return;
        }
        setToken(storedToken);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${storedToken}`;
        const providerDataString = await AsyncStorage.getItem("providerData");
        if (providerDataString) {
          const provider = JSON.parse(providerDataString);
          setProviderData(provider);
          setFormData((prev) => ({
            ...prev,
            name: provider.name || prev.name,
            phone: provider.phone || prev.phone,
            email: provider.email || prev.email,
            location: provider.address || prev.location,
            ratePerHr: provider.ratePerHr || "450",
            city: provider.city || "Pokhara",
          }));
          setBio(provider.bio || "");
          if (provider.service) {
            setSelectedService(provider.service);
          }
          if (provider.lat && provider.lon) {
            await updateLocationData(provider.lat, provider.lon);
          }
        }
        // Fetch categories
        const categoriesResponse = await axios.get(
          `${backend.backendUrl}/api/categories`
        );
        if (categoriesResponse.data && categoriesResponse.data.length > 0) {
          setCategories(categoriesResponse.data);
          // Set default service if not already set
          if (!selectedService) {
            setSelectedService(categoriesResponse.data[0].value);
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
        Alert.alert("Error", "Failed to load provider data or categories");
      }
    };
    loadAuthData();
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to use the map features."
        );
      }
    } catch (error) {
      console.error("Error requesting location permission:", error);
      Alert.alert("Error", "Failed to request location permission");
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Camera roll permission is required to upload images."
        );
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: true,
        maxSelected: 3,
      });
      if (!result.canceled && result.assets) {
        const newImages = result.assets.map((asset) => asset.uri);
        setDocumentImages((prev) => [...prev, ...newImages]);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error", "Failed to upload image");
    }
  };

  const handleRemoveImage = (index) => {
    setDocumentImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMapPress = async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    await updateLocationData(latitude, longitude);
  };

  const handleMarkerDragEnd = async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    await updateLocationData(latitude, longitude);
  };

  const handleUseCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude, longitude } = location.coords;
      await updateLocationData(latitude, longitude);
    } catch (error) {
      console.error("Error getting current location:", error);
      Alert.alert("Error", "Failed to get current location");
    }
  };

  const validateForm = () => {
    const requiredFields = {
      name: "Name",
      email: "Email",
      phone: "Phone",
      location: "Location",
    };
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field]?.trim()) {
        Alert.alert("Validation Error", `${label} is required`);
        return false;
      }
    }
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert("Validation Error", "Please enter a valid email address");
      return false;
    }
    if (!bio.trim()) {
      Alert.alert("Validation Error", "Bio is required");
      return false;
    }
    if (documentImages.length === 0) {
      Alert.alert("Validation Error", "Please upload at least one document");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    if (!token) {
      Alert.alert("Authentication Error", "Please sign in again to continue", [
        {
          text: "OK",
          onPress: () => navigation.navigate("ProviderSignIn"),
        },
      ]);
      return;
    }
    try {
      setIsLoading(true);
      // Step 1: Upload Documents first
      const formDataToSend = new FormData();
      for (let i = 0; i < documentImages.length; i++) {
        const imageUri = documentImages[i];
        const uriParts = imageUri.split("/");
        const fileName = uriParts[uriParts.length - 1];
        const match = /\.(\w+)$/.exec(fileName);
        const fileType = match ? `image/${match[1]}` : "image/jpeg";
        formDataToSend.append("document", {
          uri: imageUri,
          name: fileName,
          type: fileType,
        });
      }
      console.log("Uploading documents:", documentImages.length);
      // Using axios instead of fetch for consistent error handling
      const documentResponse = await axios.put(
        `${backend.backendUrl}/api/providers/document`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Documents uploaded successfully:", documentResponse.data);
      const documentData = documentResponse.data;
      // Step 2: Update Provider Profile
      const profileResponse = await axios.put(
        `${backend.backendUrl}/api/providers`,
        {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          bio: bio,
          address: formData.location,
          city: formData.city,
          lat: formData.latitude,
          lon: formData.longitude,
          ratePerHr: formData.ratePerHr,
          service: selectedService,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Profile updated successfully:", profileResponse.data);
      // Update the stored provider data with new values
      const updatedProviderData = {
        ...providerData,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        bio: bio,
        address: formData.location,
        city: formData.city,
        lat: formData.latitude,
        lon: formData.longitude,
        ratePerHr: formData.ratePerHr,
        service: selectedService,
        isFirstTime: false,
        documentId:
          documentData?.updatedProvider?.documentId || providerData?.documentId,
      };
      await AsyncStorage.setItem(
        "providerData",
        JSON.stringify(updatedProviderData)
      );
      // Navigate to ProviderTabs
      Alert.alert(
        "Success",
        "Provider documents and profile updated successfully",
        [
          {
            text: "OK",
            onPress: () =>
              navigation.reset({
                index: 0,
                routes: [{ name: "ProviderTabs" }],
              }),
          },
        ]
      );
    } catch (error) {
      console.error("Error saving provider data:", error);
      let errorMessage = "An error occurred while saving";
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        if (typeof error.response.data === "string") {
          errorMessage = "Server error: " + error.response.status;
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error request:", error.request);
        errorMessage = "No response from server. Please check your connection.";
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
        errorMessage = error.message;
      }
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Provider Details</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your Name"
            value={formData.name}
            onChangeText={(text) => handleInputChange("name", text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your Phone Number"
            value={formData.phone}
            onChangeText={(text) => handleInputChange("phone", text)}
            keyboardType="phone-pad"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>E-mail *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your Email"
            value={formData.email}
            onChangeText={(text) => handleInputChange("email", text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Location *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your location"
            value={formData.location}
            onChangeText={(text) => handleInputChange("location", text)}
          />
        </View>
        <View style={styles.locationButtonsContainer}>
          <TouchableOpacity
            style={styles.locationButton}
            onPress={() => setIsMapModalVisible(true)}
          >
            <Text style={styles.locationButtonText}>Choose from Map</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.locationButton}
            onPress={handleUseCurrentLocation}
          >
            <Text style={styles.locationButtonText}>Use Current Location</Text>
          </TouchableOpacity>
        </View>
        <Modal visible={isMapModalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <MapView
              style={styles.fullScreenMap}
              region={mapRegion}
              onPress={handleMapPress}
            >
              <Marker
                coordinate={markerPosition}
                draggable
                onDragEnd={handleMarkerDragEnd}
              />
            </MapView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsMapModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        {/* Service Picker Section */}
        <View style={styles.serviceContainer}>
          <Text style={styles.label}>Select Service *</Text>
          <View style={styles.pickerContainer}>
            {categories.length > 0 ? (
              <Picker
                selectedValue={selectedService}
                onValueChange={(value) => setSelectedService(value)}
                style={styles.picker}
              >
                {categories.map((category) => (
                  <Picker.Item
                    key={category.value}
                    label={category.name}
                    value={category.value}
                  />
                ))}
              </Picker>
            ) : (
              <ActivityIndicator size="small" color="#000" />
            )}
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Upload Official Documents *</Text>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleImageUpload}
          >
            <Text style={styles.uploadButtonText}>Upload Documents</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.imagePreviewContainer}>
          {documentImages.map((uri, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri }} style={styles.imagePreview} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveImage(index)}
              >
                <Ionicons name="close-circle" size={24} color="#FF5722" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Bio *</Text>
          <TextInput
            style={styles.bioInput}
            placeholder="Tell Us About Yourself.."
            value={bio}
            onChangeText={setBio}
            multiline
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Rate Per Hour (NPR) *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your rate per hour"
            value={formData.ratePerHr}
            onChangeText={(text) => handleInputChange("ratePerHr", text)}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.disabledButton]}
          onPress={handleSave}
          disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? "Saving..." : "Save"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProviderInformationScreen;

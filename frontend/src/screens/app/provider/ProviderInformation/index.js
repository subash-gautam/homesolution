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
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import styles from "./styles";

const ProviderInformationScreen = ({ navigation, route }) => {
  const [selectedService, setSelectedService] = useState("plumbing");
  const [bio, setBio] = useState("");
  const [documentImages, setDocumentImages] = useState([]);
  const [formData, setFormData] = useState({
    name: route.params?.name || "",
    email: "",
    phone: route.params?.phone || "",
    location: "",
    latitude: null,
    longitude: null,
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

  useEffect(() => {
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
        quality: 1,
        allowsMultipleSelection: true,
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

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    updateLocationData(latitude, longitude);
  };

  const handleMarkerDragEnd = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    updateLocationData(latitude, longitude);
  };

  const updateLocationData = (latitude, longitude) => {
    setMarkerPosition({ latitude, longitude });
    setFormData((prev) => ({
      ...prev,
      latitude,
      longitude,
      location: `Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`,
    }));
  };

  const handleUseCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude, longitude } = location.coords;

      updateLocationData(latitude, longitude);
      setMapRegion((prev) => ({
        ...prev,
        latitude,
        longitude,
      }));
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

    try {
      // Step 1: Update Provider Profile
      const profileResponse = await fetch(
        "http://192.168.1.2:3000/api/providers",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            bio: bio,
            address: formData.location,
            lat: formData.latitude,
            lon: formData.longitude,
            service: selectedService,
          }),
        }
      );

      if (!profileResponse.ok) {
        const profileData = await profileResponse.json();
        throw new Error(profileData.message || "Failed to update profile");
      }

      // Step 2: Upload Documents
      const formDataToSend = new FormData();

      documentImages.forEach((imageUri, index) => {
        const fileExtension = imageUri.split(".").pop();
        const fileName = `ProviderDocument-${Date.now()}-${index}.${fileExtension}`;

        formDataToSend.append("documents", {
          uri: imageUri,
          name: fileName,
          type: `image/${
            fileExtension === "jpg" || fileExtension === "jpeg"
              ? "jpeg"
              : fileExtension
          }`,
        });
      });

      console.log("Uploading documents:", documentImages.length);

      const documentResponse = await fetch(
        "http://192.168.1.2:3000/api/providers/document",
        {
          method: "PUT",
          body: formDataToSend,
        }
      );

      if (!documentResponse.ok) {
        const documentData = await documentResponse.json();
        throw new Error(documentData.message || "Failed to upload documents");
      }

      // Clear all fields after successful update
      setFormData({
        name: "",
        email: "",
        phone: "",
        location: "",
        latitude: null,
        longitude: null,
      });
      setBio("");
      setDocumentImages([]);
      setSelectedService("plumbing");
      setMarkerPosition({
        latitude: 28.2096,
        longitude: 83.9856,
      });

      // Navigate to ProviderSignIn
      Alert.alert(
        "Success",
        "Provider profile and documents updated successfully",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("ProviderSignIn"),
          },
        ]
      );
    } catch (error) {
      console.error("Error saving provider data:", error);
      Alert.alert("Error", error.message || "An error occurred while saving");
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
              region={{
                ...mapRegion,
                latitude: markerPosition.latitude,
                longitude: markerPosition.longitude,
              }}
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

        <View style={styles.serviceContainer}>
          <Text style={styles.label}>Select Service *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedService}
              onValueChange={setSelectedService}
              style={styles.picker}
            >
              <Picker.Item label="Plumbing" value="plumbing" />
              <Picker.Item label="Maintenance" value="maintenance" />
              <Picker.Item label="Electrician" value="electrician" />
              <Picker.Item label="Painting" value="painting" />
              <Picker.Item label="Repairs" value="repairs" />
            </Picker>
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

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProviderInformationScreen;

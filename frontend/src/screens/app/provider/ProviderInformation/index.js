import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  SafeAreaView,
  ActivityIndicator,
  Image,
  Platform,
  ProgressBarAndroid,
  ProgressViewIOS,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import styles from "./styles";
import backend from "../../../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const ProviderInformationScreen = ({ navigation, route }) => {
  const mapRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [bio, setBio] = useState("");
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
    ratePerHr: "",
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

  // New state variables for multi-form and progress
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0.25);
  const [profileImage, setProfileImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const totalSteps = 4;

  useEffect(() => {
    if (selectedCategory) {
      axios
        .get(
          `${backend.backendUrl}/api/services?categoryId=${selectedCategory}`
        )
        .then((response) => {
          setServices(response.data);
          setSelectedService("");
        })
        .catch((error) => {
          console.error("Services fetch error:", error.response?.data);
          Alert.alert("Error", "Failed to load services for this category");
        });
    } else {
      setServices([]);
    }
  }, [selectedCategory]);

  const fetchAddressFromCoordinates = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=d11083a9b4d1445c8837c90624c68899`
      );

      if (response.data.features?.length > 0) {
        const properties = response.data.features[0].properties;
        return (
          properties.formatted ||
          `Lat: ${lat.toFixed(4)}, Long: ${lon.toFixed(4)}`
        );
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
      setFormData((prev) => ({
        ...prev,
        latitude,
        longitude,
        location: address,
      }));
    } catch (error) {
      Alert.alert("Error", "Failed to update location details");
    }
  };

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("providerToken");
        if (!storedToken) {
          Alert.alert("Authentication Error", "Please login again");
          navigation.navigate("Login");
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
          setFormData({
            name: provider.name || "",
            phone: provider.phone || "",
            email: provider.email || "",
            location: provider.address || "",
            ratePerHr: provider.ratePerHr?.toString() || "450",
            city: provider.city || "Pokhara",
            latitude: provider.lat || null,
            longitude: provider.lon || null,
          });
          setBio(provider.bio || "");

          // Load profile image if available
          if (provider.profile) {
            setProfileImage(
              `${backend.backendUrl}/uploads/profiles/${provider.profile}`
            );
          }

          if (provider.service) {
            try {
              const res = await axios.get(
                `${backend.backendUrl}/api/services/${provider.service}`
              );
              setSelectedCategory(res.data.categoryId);
              setSelectedService(provider.service);
            } catch (err) {
              console.error("Service fetch error:", err);
            }
          }

          if (provider.lat && provider.lon) {
            setMarkerPosition({
              latitude: provider.lat,
              longitude: provider.lon,
            });
            setMapRegion((prev) => ({
              ...prev,
              latitude: provider.lat,
              longitude: provider.lon,
            }));
          }
        }

        const categoriesResponse = await axios.get(
          `${backend.backendUrl}/api/categories`
        );
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Initial data load error:", error);
        Alert.alert("Error", "Failed to load initial data");
      }
    };

    loadAuthData();
    requestLocationPermission();
    requestMediaLibraryPermission();
  }, [navigation]);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission required for map features"
        );
      }
    } catch (error) {
      Alert.alert("Error", "Location permission request failed");
    }
  };

  const requestMediaLibraryPermission = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Please allow access to your photo library to upload a profile picture"
        );
      }
    }
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const uploadProfilePicture = async () => {
    if (!profileImage || !token) return false;

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Create form data
      const formData = new FormData();

      const filename = profileImage.split("/").pop();
      const match = /\.(\w+)$/.exec(filename || "");
      const type = match ? `image/${match[1]}` : "image";

      formData.append("profilePicture", {
        uri: profileImage,
        name: filename,
        type,
      });

      // Upload the image
      const response = await axios.put(
        `${backend.backendUrl}/api/providers/profile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent) => {
            const progress = progressEvent.loaded / progressEvent.total;
            setUploadProgress(progress);
          },
        }
      );

      console.log("Profile picture upload response:", response.data);

      // Update local provider data
      if (response.data.updatedProvider) {
        const updatedProvider = {
          ...providerData,
          profile: response.data.updatedProvider.profile,
        };

        await AsyncStorage.setItem(
          "providerData",
          JSON.stringify(updatedProvider)
        );

        setProviderData(updatedProvider);
      }

      setIsUploading(false);
      return true;
    } catch (error) {
      console.error("Upload error:", error);
      setIsUploading(false);

      Alert.alert(
        "Upload Failed",
        error.response?.data?.message || "Failed to upload profile picture"
      );
      return false;
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMapPress = async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarkerPosition({ latitude, longitude });
    mapRef.current?.animateToRegion({ ...mapRegion, latitude, longitude }, 500);
    updateLocationData(latitude, longitude);
  };

  const handleMarkerDragEnd = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarkerPosition({ latitude, longitude });
    updateLocationData(latitude, longitude);
  };

  const handleUseCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude, longitude } = location.coords;
      setMarkerPosition({ latitude, longitude });
      mapRef.current?.animateToRegion(
        { ...mapRegion, latitude, longitude },
        500
      );
      updateLocationData(latitude, longitude);
    } catch (error) {
      Alert.alert("Error", "Failed to get current location");
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 1: // Basic info
        if (
          !formData.name?.trim() ||
          !formData.email?.trim() ||
          !formData.phone?.trim()
        ) {
          Alert.alert("Validation Error", "Name, Email and Phone are required");
          return false;
        }
        if (
          !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)
        ) {
          Alert.alert("Validation Error", "Invalid email format");
          return false;
        }
        return true;

      case 2: // Location info
        if (!formData.location?.trim()) {
          Alert.alert("Validation Error", "Location is required");
          return false;
        }
        if (!formData.latitude || !formData.longitude) {
          Alert.alert(
            "Validation Error",
            "Please select a precise location on the map"
          );
          return false;
        }
        return true;

      case 3: // Service info
        if (!selectedCategory) {
          Alert.alert("Validation Error", "Please select a category");
          return false;
        }
        if (!selectedService) {
          Alert.alert("Validation Error", "Please select a service");
          return false;
        }
        if (!bio.trim()) {
          Alert.alert("Validation Error", "Bio is required");
          return false;
        }
        if (!formData.ratePerHr) {
          Alert.alert("Validation Error", "Hourly rate is required");
          return false;
        }
        return true;

      case 4: // Profile picture
        // Profile picture is optional, so always return true
        return true;

      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
        setProgress((currentStep + 1) / totalSteps);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setProgress((currentStep - 1) / totalSteps);
    }
  };

  const handleSave = async () => {
    if (!validateStep(currentStep)) return;

    if (!token) {
      // Attempt to refresh token
      try {
        const refreshedToken = await AsyncStorage.getItem("providerToken");
        if (!refreshedToken) {
          Alert.alert("Session Expired", "Please login again");
          navigation.navigate("Login");
          return;
        }
        setToken(refreshedToken);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${refreshedToken}`;
      } catch (err) {
        Alert.alert("Authentication Error", "Please login again");
        navigation.navigate("Login");
        return;
      }
    }

    try {
      setIsLoading(true);

      // First upload profile picture if present
      if (profileImage && !profileImage.includes(backend.backendUrl)) {
        const uploadSuccess = await uploadProfilePicture();
        if (!uploadSuccess) {
          setIsLoading(false);
          return;
        }
      }

      // Prepare profile payload with proper data types
      const profilePayload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        bio: bio.trim(),
        address: formData.location.trim(),
        city: formData.city,
        lat: formData.latitude || 0,
        lon: formData.longitude || 0,
        ratePerHr: parseInt(formData.ratePerHr, 10) || 450,
      };

      // Update provider profile
      const profileResponse = await axios.put(
        `${backend.backendUrl}/api/providers`,
        profilePayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Profile update response:", profileResponse.data);

      // Update service selection - sending as array as required by API
      const serviceResponse = await axios.put(
        `${backend.backendUrl}/api/providerServices`,
        { serviceId: [selectedService] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Service update response:", serviceResponse.data);

      // Update local storage with new data
      const updatedProvider = {
        ...providerData,
        ...profilePayload,
        service: selectedService,
      };

      await AsyncStorage.setItem(
        "providerData",
        JSON.stringify(updatedProvider)
      );

      Alert.alert("Success", "Profile updated successfully", [
        {
          text: "OK",
          onPress: () =>
            navigation.reset({
              index: 0,
              routes: [{ name: "ProviderTabs" }],
            }),
        },
      ]);
    } catch (error) {
      console.error("Save error:", error);

      // More detailed error handling
      if (error.response) {
        // Server responded with error
        console.error("Error response:", error.response.data);
        const message =
          error.response.data?.message ||
          error.response.data?.error ||
          "Server error occurred while saving";
        Alert.alert("Error", message);
      } else if (error.request) {
        // Request made but no response received
        console.error("Error request:", error.request);
        Alert.alert(
          "Network Error",
          "Could not connect to server. Please check your internet connection."
        );
      } else {
        // Error in setting up request
        console.error("Error message:", error.message);
        Alert.alert("Error", "An unexpected error occurred while saving");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderCategoryItems = () => [
    <Picker.Item label="Select Category" value="" key="cat-default" />,
    ...categories.map((cat) => (
      <Picker.Item label={cat.name} value={cat.id} key={`cat-${cat.id}`} />
    )),
  ];

  const renderServiceItems = () => {
    if (!selectedCategory)
      return [
        <Picker.Item
          label="First select a category"
          value=""
          key="serv-default"
        />,
      ];

    if (services.length === 0)
      return [
        <Picker.Item label="No services available" value="" key="serv-empty" />,
      ];

    return [
      <Picker.Item label="Select Service" value="" key="serv-default" />,
      ...services.map((serv) => (
        <Picker.Item
          label={serv.name}
          value={serv.id}
          key={`serv-${serv.id}`}
        />
      )),
    ];
  };

  const renderProgressBar = () => {
    return (
      <View style={styles.progressContainer}>
        <View style={styles.stepsTextContainer}>
          <Text style={styles.stepsText}>
            Step {currentStep} of {totalSteps}
          </Text>
        </View>
        {Platform.OS === "ios" ? (
          <ProgressViewIOS progress={progress} progressTintColor="#4CAF50" />
        ) : (
          <ProgressBarAndroid
            styleAttr="Horizontal"
            indeterminate={false}
            progress={progress}
            color="#4CAF50"
          />
        )}
      </View>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <Text style={styles.stepTitle}>Basic Information</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your Name"
                value={formData.name}
                onChangeText={(t) => handleInputChange("name", t)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Phone Number"
                value={formData.phone}
                onChangeText={(t) => handleInputChange("phone", t)}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Email"
                value={formData.email}
                onChangeText={(t) => handleInputChange("email", t)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </>
        );

      case 2:
        return (
          <>
            <Text style={styles.stepTitle}>Location Information</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Location *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Location"
                value={formData.location}
                onChangeText={(t) => handleInputChange("location", t)}
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
                <Text style={styles.locationButtonText}>
                  Use Current Location
                </Text>
              </TouchableOpacity>
            </View>

            {formData.latitude && formData.longitude && (
              <View style={styles.mapPreviewContainer}>
                <Text style={styles.mapPreviewTitle}>Selected Location:</Text>
                <MapView
                  style={styles.mapPreview}
                  region={{
                    latitude: formData.latitude,
                    longitude: formData.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                  }}
                  scrollEnabled={false}
                  zoomEnabled={false}
                >
                  <Marker
                    coordinate={{
                      latitude: formData.latitude,
                      longitude: formData.longitude,
                    }}
                  />
                </MapView>
              </View>
            )}
          </>
        );

      case 3:
        return (
          <>
            <Text style={styles.stepTitle}>Service Information</Text>
            <View style={styles.serviceContainer}>
              <Text style={styles.label}>Category *</Text>
              <View style={styles.pickerContainer}>
                {categories.length > 0 ? (
                  <Picker
                    selectedValue={selectedCategory}
                    onValueChange={setSelectedCategory}
                    style={styles.picker}
                  >
                    {renderCategoryItems()}
                  </Picker>
                ) : (
                  <ActivityIndicator size="small" color="#000" />
                )}
              </View>
            </View>

            <View style={styles.serviceContainer}>
              <Text style={styles.label}>Service *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedService}
                  onValueChange={setSelectedService}
                  style={styles.picker}
                  enabled={!!selectedCategory && services.length > 0}
                >
                  {renderServiceItems()}
                </Picker>
                {selectedCategory && services.length === 0 && (
                  <ActivityIndicator size="small" color="#000" />
                )}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Bio *</Text>
              <TextInput
                style={styles.bioInput}
                placeholder="Describe your services and experience"
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Hourly Rate (NPR) *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter hourly rate"
                value={formData.ratePerHr}
                onChangeText={(t) => handleInputChange("ratePerHr", t)}
                keyboardType="numeric"
              />
            </View>
          </>
        );

      case 4:
        return (
          <>
            <Text style={styles.stepTitle}>Profile Picture</Text>
            <View style={styles.profileImageContainer}>
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.placeholderImage}>
                  <Ionicons name="person" size={80} color="#ccc" />
                </View>
              )}

              <TouchableOpacity
                style={styles.chooseImageButton}
                onPress={pickImage}
              >
                <Text style={styles.chooseImageText}>
                  {profileImage ? "Change Picture" : "Choose Picture"}
                </Text>
              </TouchableOpacity>
            </View>

            {isUploading && (
              <View style={styles.uploadProgressContainer}>
                <Text style={styles.uploadProgressText}>
                  Uploading: {Math.round(uploadProgress * 100)}%
                </Text>
                {Platform.OS === "ios" ? (
                  <ProgressViewIOS
                    progress={uploadProgress}
                    progressTintColor="#4CAF50"
                  />
                ) : (
                  <ProgressBarAndroid
                    styleAttr="Horizontal"
                    indeterminate={false}
                    progress={uploadProgress}
                    color="#4CAF50"
                  />
                )}
              </View>
            )}
          </>
        );

      default:
        return null;
    }
  };

  const renderNavigationButtons = () => {
    return (
      <View style={styles.navigationButtonsContainer}>
        {currentStep > 1 && (
          <TouchableOpacity
            style={styles.navigationButton}
            onPress={prevStep}
            disabled={isLoading}
          >
            <Text style={styles.navigationButtonText}>Previous</Text>
          </TouchableOpacity>
        )}

        {currentStep < totalSteps ? (
          <TouchableOpacity
            style={styles.navigationButton}
            onPress={nextStep}
            disabled={isLoading}
          >
            <Text style={styles.navigationButtonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.saveButton, isLoading && styles.disabledButton]}
            onPress={handleSave}
            disabled={isLoading}
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? "Saving..." : "Save Profile"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
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

      {renderProgressBar()}

      <ScrollView contentContainerStyle={styles.container}>
        {renderStepContent()}
        {renderNavigationButtons()}
      </ScrollView>

      <Modal visible={isMapModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <MapView
            ref={mapRef}
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
    </SafeAreaView>
  );
};

export default ProviderInformationScreen;

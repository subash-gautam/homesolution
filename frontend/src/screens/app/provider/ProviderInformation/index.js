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
  Pressable,
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
  const [selectedServices, setSelectedServices] = useState([]);
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
  const [profileImage, setProfileImage] = useState(null);
  const [documentImage, setDocumentImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadProgressDoc, setUploadProgressDoc] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);

  useEffect(() => {
    if (selectedCategory) {
      axios
        .get(
          `${backend.backendUrl}/api/services?categoryId=${selectedCategory}`
        )
        .then((response) => {
          setServices(response.data);
          setSelectedServices([]);
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

          const profileImageData = await AsyncStorage.getItem(
            "profileImageData"
          );
          if (profileImageData) {
            const parsedImageData = JSON.parse(profileImageData);
            if (parsedImageData.providerId === provider.id) {
              setProfileImage(parsedImageData.imageUrl);
            }
          } else if (provider.profile) {
            const imageUrl = `${backend.backendUrl}/Uploads/${provider.profile}`;
            setProfileImage(imageUrl);
            await AsyncStorage.setItem(
              "profileImageData",
              JSON.stringify({
                providerId: provider.id,
                imageUrl: imageUrl,
                timestamp: Date.now(),
              })
            );
          }

          if (provider.documentId) {
            try {
              const docResponse = await axios.get(
                `${backend.backendUrl}/api/providers/document?providerId=${provider.id}`
              );
              if (docResponse.data.length > 0) {
                setDocumentImage(
                  `${backend.backendUrl}/Uploads/${docResponse.data[0].name}`
                );
              }
            } catch (error) {
              console.error("Document fetch error:", error);
            }
          }

          if (provider.services) {
            try {
              const serviceIds = provider.services; // Assuming services is an array of service IDs
              setSelectedServices(serviceIds);
              if (serviceIds.length > 0) {
                const res = await axios.get(
                  `${backend.backendUrl}/api/services/${serviceIds[0]}`
                );
                setSelectedCategory(res.data.categoryId);
              }
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
          "Please allow access to your photo library to upload files"
        );
      }
    }
  };

  const pickImage = async (type) => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: type === "profile",
        aspect: type === "profile" ? [1, 1] : undefined,
        quality: 0.7,
        base64: Platform.OS === "android",
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        if (type === "profile") {
          setProfileImage(result.assets[0].uri);
        } else {
          setDocumentImage(result.assets[0].uri);
        }
      }
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert("Error", `Failed to pick ${type}`);
    }
  };

  const uploadFile = async (fileUri, type) => {
    if (!fileUri || !token) return false;

    if (fileUri.startsWith(`${backend.backendUrl}/Uploads/`)) {
      return true;
    }

    try {
      type === "profile" ? setIsUploading(true) : setIsUploadingDoc(true);
      type === "profile" ? setUploadProgress(0) : setUploadProgressDoc(0);

      const formDataObj = new FormData();
      const filename = fileUri.split("/").pop();

      let fileType = "image/jpeg";
      if (filename) {
        const ext = filename.split(".").pop().toLowerCase();
        if (ext === "png") fileType = "image/png";
        else if (ext === "gif") fileType = "image/gif";
      }

      formDataObj.append(
        type === "profile" ? "ProviderProfile" : "ProviderDocument",
        {
          uri: fileUri,
          name: filename || `${type}.jpg`,
          type: fileType,
        }
      );

      const response = await axios.put(
        `${backend.backendUrl}/api/providers/${
          type === "profile" ? "profile" : "document"
        }`,
        formDataObj,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent) => {
            const progress = progressEvent.loaded / progressEvent.total;
            type === "profile"
              ? setUploadProgress(progress)
              : setUploadProgressDoc(progress);
          },
        }
      );

      if (response.data?.updatedProvider) {
        const updatedProvider = {
          ...providerData,
          ...response.data.updatedProvider,
        };

        await AsyncStorage.setItem(
          "providerData",
          JSON.stringify(updatedProvider)
        );
        setProviderData(updatedProvider);

        if (type === "profile") {
          const newImageUrl = `${backend.backendUrl}/Uploads/${
            response.data.updatedProvider.profile
          }?t=${Date.now()}`;
          setProfileImage(newImageUrl);

          await AsyncStorage.setItem(
            "profileImageData",
            JSON.stringify({
              providerId: updatedProvider.id,
              imageUrl: newImageUrl,
              timestamp: Date.now(),
            })
          );

          await AsyncStorage.setItem(
            "savedProfileImage",
            JSON.stringify({
              providerId: updatedProvider.id,
              imageUrl: newImageUrl,
            })
          );
        } else {
          try {
            const docResponse = await axios.get(
              `${backend.backendUrl}/api/providers/document?providerId=${updatedProvider.id}`
            );
            if (docResponse.data.length > 0) {
              setDocumentImage(
                `${backend.backendUrl}/Uploads/${docResponse.data[0].name}`
              );
            }
          } catch (error) {
            console.error("Document fetch error:", error);
          }
        }
      }
      return true;
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert(
        "Upload Failed",
        error.response?.data?.error || `Failed to upload ${type}`
      );
      return false;
    } finally {
      type === "profile" ? setIsUploading(false) : setIsUploadingDoc(false);
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

  const validateForm = () => {
    if (
      !formData.name?.trim() ||
      !formData.email?.trim() ||
      !formData.phone?.trim()
    ) {
      Alert.alert("Validation Error", "Name, Email, and Phone are required");
      return false;
    }
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      Alert.alert("Validation Error", "Invalid email format");
      return false;
    }
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
    if (!selectedCategory) {
      Alert.alert("Validation Error", "Please select a category");
      return false;
    }
    if (selectedServices.length === 0) {
      Alert.alert("Validation Error", "Please select at least one service");
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
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
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

      let profileUploadSuccess = true;
      if (profileImage && !profileImage.includes(backend.backendUrl)) {
        profileUploadSuccess = await uploadFile(profileImage, "profile");
        if (!profileUploadSuccess) {
          setIsLoading(false);
          return;
        }
      }

      let docUploadSuccess = true;
      if (documentImage && !documentImage.includes(backend.backendUrl)) {
        docUploadSuccess = await uploadFile(documentImage, "document");
        if (!docUploadSuccess) {
          setIsLoading(false);
          return;
        }
      }

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

      const profileResponse = await axios.put(
        `${backend.backendUrl}/api/providers`,
        profilePayload,
        {
          headers: {
            Authorization: `Bearer ${refreshedToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const serviceResponse = await axios.put(
        `${backend.backendUrl}/api/providerServices`,
        { serviceId: selectedServices },
        {
          headers: {
            Authorization: `Bearer ${refreshedToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const updatedProvider = {
        ...providerData,
        ...profilePayload,
        services: selectedServices,
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
      if (error.response) {
        console.error("Error response data:", error.response.data);
        Alert.alert("Error", error.response.data?.message || "Server error");
      } else if (error.request) {
        Alert.alert("Network Error", "Could not connect to server");
      } else {
        Alert.alert("Error", "An unexpected error occurred");
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
    if (!selectedCategory) return <Text>Select a category first</Text>;
    if (services.length === 0) return <Text>No services available</Text>;

    return services.map((serv) => {
      const isChecked = selectedServices.includes(serv.id);
      return (
        <Pressable
          key={`serv-${serv.id}`}
          onPress={() => toggleServiceSelection(serv.id)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 5,
          }}
        >
          <View
            style={{
              height: 20,
              width: 20,
              borderWidth: 1,
              borderColor: "#333",
              marginRight: 8,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: isChecked ? "#333" : "#fff",
            }}
          >
            {isChecked && <Text style={{ color: "white" }}>✓</Text>}
          </View>
          <Text>{serv.name}</Text>
        </Pressable>
      );
    });
  };

  const toggleServiceSelection = (serviceId) => {
    setSelectedServices((prev) => {
      if (prev.includes(serviceId)) {
        return prev.filter((id) => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
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
        <Text style={styles.sectionTitle}>Basic Information</Text>
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

        <Text style={styles.sectionTitle}>Location Information</Text>
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
            <Text style={styles.locationButtonText}>Use Current Location</Text>
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

        <Text style={styles.sectionTitle}>Service Information</Text>
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
          <Text style={styles.label}>Services *</Text>
          <View style={styles.serviceListContainer}>
            {renderServiceItems()}
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

        <Text style={styles.sectionTitle}>Profile Picture</Text>
        <View style={styles.profileImageContainer}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name="person" size={80} color="#ccc" />
            </View>
          )}
          <TouchableOpacity
            style={styles.chooseImageButton}
            onPress={() => pickImage("profile")}
          >
            <Text style={styles.chooseImageText}>
              {profileImage ? "Change Picture" : "Choose Picture"}
            </Text>
          </TouchableOpacity>
        </View>

        {isUploading && (
          <View style={styles.uploadProgressContainer}>
            <Text style={styles.uploadProgressText}>
              Uploading Profile: {Math.round(uploadProgress * 100)}%
            </Text>
            <ActivityIndicator size="small" color="#4CAF50" />
          </View>
        )}

        <Text style={styles.sectionTitle}>Official Document</Text>
        <View style={styles.profileImageContainer}>
          {documentImage ? (
            <Image
              source={{ uri: documentImage }}
              style={styles.documentImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.placeholderDocument}>
              <Ionicons name="document-text" size={80} color="#ccc" />
            </View>
          )}
          <TouchableOpacity
            style={styles.chooseImageButton}
            onPress={() => pickImage("document")}
          >
            <Text style={styles.chooseImageText}>
              {documentImage ? "Change Document" : "Upload Document"}
            </Text>
          </TouchableOpacity>
        </View>

        {isUploadingDoc && (
          <View style={styles.uploadProgressContainer}>
            <Text style={styles.uploadProgressText}>
              Uploading Document: {Math.round(uploadProgressDoc * 100)}%
            </Text>
            <ActivityIndicator size="small" color="#4CAF50" />
          </View>
        )}

        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.disabledButton]}
          onPress={handleSave}
          disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? "Saving..." : "Save Profile"}
          </Text>
        </TouchableOpacity>
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

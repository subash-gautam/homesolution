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
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
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

          if (provider.service) {
            axios
              .get(`${backend.backendUrl}/api/services/${provider.service}`)
              .then((res) => {
                setSelectedCategory(res.data.categoryId);
                setSelectedService(provider.service);
              })
              .catch((err) => console.error("Service fetch error:", err));
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
        Alert.alert("Error", "Failed to load initial data");
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
          "Location permission required for map features"
        );
      }
    } catch (error) {
      Alert.alert("Error", "Location permission request failed");
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
    const required = ["name", "email", "phone", "location"];
    for (const field of required) {
      if (!formData[field]?.trim()) {
        Alert.alert(
          "Validation Error",
          `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
        );
        return false;
      }
    }

    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      Alert.alert("Validation Error", "Invalid email format");
      return false;
    }

    if (!bio.trim() || !selectedService) {
      Alert.alert("Validation Error", "Bio and Service selection are required");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm() || !token) return;

    try {
      setIsLoading(true);
      const profilePayload = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        bio,
        address: formData.location,
        city: formData.city,
        lat: formData.latitude,
        lon: formData.longitude,
        ratePerHr: parseInt(formData.ratePerHr, 10) || 450,
      };

      await axios.put(`${backend.backendUrl}/api/providers`, profilePayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await axios.put(
        `${backend.backendUrl}/api/providerServices`,
        { serviceId: selectedService },
        { headers: { Authorization: `Bearer ${token}` } }
      );

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
            navigation.reset({ index: 0, routes: [{ name: "ProviderTabs" }] }),
        },
      ]);
    } catch (error) {
      const message =
        error.response?.data?.message || "An error occurred while saving";
      Alert.alert("Error", message);
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
    </SafeAreaView>
  );
};

export default ProviderInformationScreen;

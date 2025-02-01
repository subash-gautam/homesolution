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
  Pressable,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, UrlTile } from "react-native-maps";
import * as Location from "expo-location";

const CreateServiceScreen = () => {
  const [selectedService, setSelectedService] = useState("plumbing");
  const [bio, setBio] = useState("");
  const [documentImages, setDocumentImages] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    location: "",
    latitude: null,
    longitude: null,
  });
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: 28.2096, // Latitude of Pokhara, Nepal
    longitude: 83.9856, // Longitude of Pokhara, Nepal
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [isMapModalVisible, setIsMapModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }
    })();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const searchLocations = (query) => {
    handleInputChange("location", query);
    const suggestions = [
      "Lamachour, Pokhara",
      "Batulechour, Pokhara",
      "NewRoad, Pokhara",
      "LakeSide, Pokhara",
    ].filter((location) =>
      location.toLowerCase().includes(query.toLowerCase())
    );
    setLocationSuggestions(suggestions);
  };

  const selectLocation = (location) => {
    handleInputChange("location", location);
    setShowSuggestions(false);
  };

  const handleImageUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "Sorry, we need camera roll permissions to upload images."
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setDocumentImages([...documentImages, result.assets[0].uri]);
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = documentImages.filter((_, i) => i !== index);
    setDocumentImages(updatedImages);
  };

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setFormData({
      ...formData,
      latitude,
      longitude,
      location: `Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`,
    });
    setMapRegion({
      ...mapRegion,
      latitude,
      longitude,
    });
    setIsMapModalVisible(false); // Close the modal after selecting a location
  };

  const handleUseCurrentLocation = async () => {
    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    setFormData({
      ...formData,
      latitude,
      longitude,
      location: "Current Location",
    });
    setMapRegion({
      ...mapRegion,
      latitude,
      longitude,
    });
  };

  const handleSave = () => {
    Alert.alert("Saved", "Your service details have been saved successfully!");
    console.log("Form Data:", formData);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Email Field */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your Email"
          value={formData.email}
          onChangeText={(text) => handleInputChange("email", text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Location Field */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Location</Text>
        <View style={styles.autocompleteContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your location"
            value={formData.location}
            onChangeText={searchLocations}
            onFocus={() => setShowSuggestions(true)}
          />
          {showSuggestions && locationSuggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              {locationSuggestions.map((suggestion, index) => (
                <Pressable
                  key={index}
                  style={({ pressed }) => [
                    styles.suggestionItem,
                    pressed && styles.suggestionItemPressed,
                  ]}
                  onPress={() => selectLocation(suggestion)}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
        <View style={styles.LocationContainer}>
          <View>
            <TouchableOpacity onPress={() => setIsMapModalVisible(true)}>
              <Text style={{ color: "blue" }}>Choose from Map</Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={handleUseCurrentLocation}>
              <Text style={{ color: "blue" }}>Use Current Location</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Map Modal */}
      <Modal
        visible={isMapModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setIsMapModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <MapView
            style={styles.fullScreenMap}
            initialRegion={mapRegion}
            onPress={handleMapPress}
          >
            <UrlTile
              urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maximumZ={19}
            />
            {formData.latitude && formData.longitude && (
              <Marker
                coordinate={{
                  latitude: formData.latitude,
                  longitude: formData.longitude,
                }}
                title="Selected Location"
              />
            )}
          </MapView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsMapModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Service Selection */}
      <Text style={styles.label}>Select Service</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedService}
          onValueChange={(itemValue) => setSelectedService(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Plumbing" value="plumbing" />
          <Picker.Item label="Maintenance" value="maintenance" />
          <Picker.Item label="Electrician" value="electrician" />
          <Picker.Item label="Painting" value="painting" />
          <Picker.Item label="Repairs" value="repairs" />
        </Picker>
      </View>

      {/* Document Upload */}
      <Text style={styles.label}>Upload Official Documents</Text>
      <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
        <Text style={styles.uploadButtonText}>Upload Photo</Text>
      </TouchableOpacity>

      <View style={styles.imagePreviewContainer}>
        {documentImages.map((uri, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={{ uri }} style={styles.imagePreview} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveImage(index)}
            >
              <Ionicons name="close-circle" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Bio Field */}
      <Text style={styles.label}>Bio</Text>
      <TextInput
        style={styles.bioInput}
        multiline
        numberOfLines={4}
        placeholder="Write a short bio about yourself..."
        value={bio}
        onChangeText={setBio}
      />

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    paddingTop: 40,
  },
  LocationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  autocompleteContainer: {
    position: "relative",
  },
  suggestionsContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: 5,
    zIndex: 1,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  suggestionItemPressed: {
    backgroundColor: "#f0f0f0",
  },
  suggestionText: {
    fontSize: 16,
    color: "#333",
  },
  map: {
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  coordinatesText: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 20,
    overflow: "hidden",
  },
  picker: {
    backgroundColor: "#fff",
  },
  uploadButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  imagePreviewContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  imageWrapper: {
    position: "relative",
    marginRight: 10,
    marginBottom: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeButton: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "white",
    borderRadius: 12,
  },
  bioInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 20,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenMap: {
    width: "100%",
    height: "100%",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CreateServiceScreen;

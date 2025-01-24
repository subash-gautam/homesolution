import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Location from "expo-location"; // For current location
import MapView, { Marker } from "react-native-maps"; // For map selection
import Button from "../../../../components/Button.js/Index";
const BookServiceScreen = ({ route, navigation }) => {
  const { category } = route.params;
  const [location, setLocation] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [dateTime, setDateTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [mapLocation, setMapLocation] = useState(null);

  // Current Location Logic
  const handleUseCurrentLocation = async () => {
    try {
      // Request permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      // Get current location
      let currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;

      // Reverse geocode to get address
      let addresses = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addresses.length > 0) {
        const address = addresses[0];
        setLocation(
          `${address.streetNumber || ""} ${address.street}, ${address.city}, ${
            address.region
          } ${address.postalCode}`
        );
      }
    } catch (error) {
      alert("Error getting location: " + error.message);
    }
  };

  // Map Location Selection Logic
  const handleMapLocationSelect = async (coordinate) => {
    setMapLocation(coordinate);
    setShowMapPicker(false);

    // Optional: Reverse geocode selected location
    Location.reverseGeocodeAsync(coordinate)
      .then((addresses) => {
        if (addresses.length > 0) {
          const address = addresses[0];
          setLocation(
            `${address.street}, ${address.city}, ${address.region} ${address.postalCode}`
          );
        }
      })
      .catch((error) => {
        console.error("Geocoding error:", error);
      });
  };

  // Date Time Picker Logic
  const handleDateTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateTime;
    setShowDatePicker(Platform.OS === "ios");
    setDateTime(currentDate);
  };

  // Render Map Picker
  const MapPickerModal = () => (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 28.2096, // Default to Pokhara
          longitude: 83.9856,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        onPress={(e) => handleMapLocationSelect(e.nativeEvent.coordinate)}
      >
        {mapLocation && (
          <Marker coordinate={mapLocation} title="Selected Location" />
        )}
      </MapView>
      <TouchableOpacity
        style={styles.closeMapButton}
        onPress={() => setShowMapPicker(false)}
      >
        <Text style={styles.closeMapButtonText}>Close Map</Text>
      </TouchableOpacity>
    </View>
  );
  // Handle confirmation and validation
  const handleConfirm = () => {
    navigation.navigate("Payment");
  };
  return (
    <View style={styles.container}>
      {showMapPicker ? (
        <MapPickerModal />
      ) : (
        <>
          <Text style={styles.title}>Book {category} Service</Text>

          {/* Location Input */}
          <Text style={styles.label}>Your Address</Text>
          <View style={styles.inputContainer}>
            <Icon
              name="location-outline"
              size={20}
              color="#aaa"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your address"
              placeholderTextColor="#aaa"
              value={location}
              onChangeText={setLocation}
            />
          </View>
          <View style={styles.actionsContainer}>
            <TouchableOpacity onPress={() => setShowMapPicker(true)}>
              <Text style={styles.actionText}>Choose From Map</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleUseCurrentLocation}>
              <Text style={styles.actionText}>Use Current Location</Text>
            </TouchableOpacity>
          </View>

          {/* Issue Description Input */}
          <Text style={styles.label}>Description</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { height: 100, textAlignVertical: "top" }]}
              placeholder="Enter Description"
              placeholderTextColor="#aaa"
              value={issueDescription}
              multiline
              onChangeText={setIssueDescription}
            />
            <FontAwesome
              name="pencil"
              size={20}
              color="#aaa"
              style={styles.icon}
            />
          </View>

          {/* Date and Time Input */}
          <Text style={styles.label}>Booking Date & Slot</Text>
          <TouchableOpacity
            style={styles.dateTimeContainer}
            onPress={() => setShowDatePicker(true)}
          >
            <FontAwesome
              name="calendar"
              size={20}
              color="#aaa"
              style={styles.icon}
            />
            <Text style={styles.dateTimeText}>{dateTime.toLocaleString()}</Text>
          </TouchableOpacity>

          {/* Date Picker */}
          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={dateTime}
              mode="datetime"
              is24Hour={true}
              display="default"
              onChange={handleDateTimeChange}
            />
          )}
        </>
      )}
      <View>
        <Button title="Confirm" onPress={handleConfirm} />
      </View>
    </View>
  );
};

export default BookServiceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000", // Changed text color to black
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000", // Changed text color to black
    marginVertical: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  icon: {
    marginRight: 8,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  actionText: {
    color: "#4a90e2",
    fontSize: 14,
  },
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4a90e2",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#f8f8f8",
  },
  dateTimeText: {
    flex: 1,
    fontSize: 16,
    color: "#aaa",
    marginLeft: 8,
  },
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  closeMapButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "#4a90e2",
    padding: 10,
    borderRadius: 8,
  },
  closeMapButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

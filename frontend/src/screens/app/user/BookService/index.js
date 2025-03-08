import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import Button from "../../../../components/Button.js/Index";
import { colors } from "../../../../utils/colors";

const BookService = ({ navigation, route }) => {
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [dateTime, setDateTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [mapLocation, setMapLocation] = useState(null);
  const [service, setService] = useState(route.params.service);

  useEffect(() => {
    if (route.params?.provider) {
      setService((prev) => ({ ...prev, provider: route.params.provider }));
    }
  }, [route.params?.provider]);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(dateTime.getHours());
      newDate.setMinutes(dateTime.getMinutes());
      setDateTime(newDate);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === "ios");
    if (selectedTime) {
      const newDate = new Date(dateTime);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setDateTime(newDate);
    }
  };

  const handleUseCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location permission is required");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      let addresses = await Location.reverseGeocodeAsync(location.coords);

      if (addresses.length > 0) {
        const address = addresses[0];
        setAddress(
          `${address.streetNumber || ""} ${address.street}, ${address.city}`
        );
        setMapLocation(location.coords);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to get current location");
    }
  };

  const handleChooseFromMap = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Location permission is needed to use the map."
        );
        return;
      }

      if (!mapLocation) {
        let location = await Location.getCurrentPositionAsync({});
        setMapLocation(location.coords);
        setRegion({
          ...region,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
      setShowMap(true);
    } catch (error) {
      Alert.alert("Error", "Failed to access map");
    }
  };

  const handleMapConfirm = async () => {
    if (mapLocation) {
      let addresses = await Location.reverseGeocodeAsync(mapLocation);
      if (addresses.length > 0) {
        const address = addresses[0];
        setAddress(
          `${address.streetNumber || ""} ${address.street}, ${address.city}`
        );
      }
    }
    setShowMap(false);
  };

  const handleConfirm = () => {
    if (!address) {
      Alert.alert("Error", "Please enter your address");
      return;
    }
    if (!description) {
      Alert.alert("Error", "Please enter a description");
      return;
    }

    navigation.navigate("OrderConfirmation", {
      service: service,
      bookingDetails: {
        address,
        description,
        dateTime: dateTime.toISOString(),
      },
    });
  };

  const [region, setRegion] = useState({
    latitude: 28.2096,
    longitude: 83.9856,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {showMap ? (
        <View style={styles.mapContainer}>
          {mapLocation && (
            <MapView
              style={styles.map}
              region={{
                latitude: mapLocation.latitude,
                longitude: mapLocation.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              onPress={(e) => {
                const newCoord = e.nativeEvent.coordinate;
                setMapLocation(newCoord);
              }}
            >
              <Marker coordinate={mapLocation} />
            </MapView>
          )}
          <Button
            title="Confirm Location"
            onPress={handleMapConfirm}
            style={styles.mapButton}
          />
        </View>
      ) : (
        <>
          {/* Selected Provider Section */}
          <View style={styles.providerContainer}>
            <Text style={styles.sectionTitle}>Selected Provider</Text>
            <View style={styles.providerInfo}>
              <Text style={styles.providerText}>
                {service.provider?.name || "No provider selected"}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("ProviderList")}
                style={styles.changeProviderButton}
              >
                <Text style={styles.linkText}>Change Provider</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Address Section */}
          <Text style={styles.sectionTitle}>Your Address</Text>
          <TextInput
            style={[styles.input]}
            placeholder="Enter your address"
            value={address}
            onChangeText={setAddress}
          />
          <View style={styles.locationButtons}>
            <TouchableOpacity
              style={styles.linkText}
              onPress={handleChooseFromMap}
            >
              <Text style={styles.linkText}>Choose From Map</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.linkText}
              onPress={handleUseCurrentLocation}
            >
              <Text style={styles.linkText}>Use Current Location</Text>
            </TouchableOpacity>
          </View>

          {/* Description Section */}
          <Text style={styles.sectionTitle}>Description</Text>
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Enter a description"
            multiline
            value={description}
            onChangeText={setDescription}
          />

          {/* Date/Time Section */}
          <Text style={styles.sectionTitle}>Booking Date & Slot</Text>
          <TouchableOpacity
            style={styles.dateTimeContainer}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar" size={24} color={colors.text} />
            <Text style={styles.dateTimeText}>
              {dateTime.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dateTimeContainer}
            onPress={() => setShowTimePicker(true)}
          >
            <Ionicons name="time" size={24} color={colors.text} />
            <Text style={styles.dateTimeText}>
              {dateTime.toLocaleTimeString()}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={dateTime}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={dateTime}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}

          {/* Confirm Booking Button */}
          <View style={styles.buttonContainer}>
            <Button
              title="Confirm Booking"
              onPress={handleConfirm}
              style={styles.confirmButton}
            />
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 80, // Add padding for bottom tab
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: colors.text,
  },
  input: {
    height: 50,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: "#f5f5f5",
  },
  descriptionInput: {
    height: 120,
    textAlignVertical: "top",
    paddingTop: 15,
  },
  locationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  linkText: {
    color: colors.primary,
    textDecorationLine: "underline",
    fontSize: 14,
  },
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    backgroundColor: "#f5f5f5",
  },
  dateTimeText: {
    marginLeft: 10,
    fontSize: 16,
    color: colors.text,
  },
  mapContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: "100%",
    height: "80%",
    marginBottom: 20,
  },
  mapButton: {
    width: "100%",
    marginBottom: 20,
  },
  confirmButton: {
    marginTop: 20,
    marginBottom: 20, // Ensure spacing from bottom tab
  },
  providerContainer: {
    marginBottom: 20,
  },
  providerInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginTop: 10,
  },
  providerText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  changeProviderButton: {
    marginLeft: 15,
  },
});

export default BookService;

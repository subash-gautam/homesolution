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
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import Button from "../../../../components/Button.js/Index";
import { colors } from "../../../../utils/colors";

import styles from "./styles";

const BookService = ({ navigation, route }) => {
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [dateTime, setDateTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [mapLocation, setMapLocation] = useState(null);
  const [region, setRegion] = useState({
    latitude: 28.2096,
    longitude: 83.9856,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

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

    navigation.navigate("Payment", {
      service: route.params.service, // Pass the service object from route.params
      bookingDetails: {
        address,
        description,
        dateTime: dateTime.toISOString(),
      },
    });
  };

  return (
    <View style={styles.container}>
      {showMap ? (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={region}
            onRegionChangeComplete={setRegion}
          >
            {mapLocation && (
              <Marker
                coordinate={mapLocation}
                draggable
                onDragEnd={(e) => {
                  const newCoord = e.nativeEvent.coordinate;
                  setMapLocation(newCoord);
                }}
              />
            )}
          </MapView>
          <Button
            title="Confirm Location"
            onPress={handleMapConfirm}
            style={styles.mapButton}
          />
        </View>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Your Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your address"
            value={address}
            onChangeText={setAddress}
          />

          <View style={styles.locationButtons}>
            <TouchableOpacity onPress={handleChooseFromMap}>
              <Text style={styles.linkText}>Choose From Map</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleUseCurrentLocation}>
              <Text style={styles.linkText}>Use Current Location</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Enter description"
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />

          <Text style={styles.sectionTitle}>Booking Date & Slot</Text>
          <TouchableOpacity
            style={styles.dateTimeContainer}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar" size={20} color={colors.primary} />
            <Text style={styles.dateTimeText}>
              {dateTime.toLocaleDateString()}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dateTimeContainer}
            onPress={() => setShowTimePicker(true)}
          >
            <Ionicons name="time" size={20} color={colors.primary} />
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
              minimumDate={new Date()}
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

          <Button
            title="Confirm"
            onPress={handleConfirm}
            style={styles.confirmButton}
          />
        </>
      )}
    </View>
  );
};

export default BookService;

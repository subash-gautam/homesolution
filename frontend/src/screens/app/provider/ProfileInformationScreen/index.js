import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Pressable,
  Image,
  RefreshControl,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { Picker } from "@react-native-picker/picker";
import styles from "./styles";

const ProfileInformationScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    location: "",
    bio: "",
    profileImage: null,
    selectedSkills: [],
    services: [],
    officialDocument: null,
    currentService: {
      title: "",
      description: "",
      price: "",
    },
  });

  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [availability, setAvailability] = useState({
    selectedDays: [],
    timeSlots: {},
    recurringType: "none", // none, daily, weekly, monthly
  });

  // Available time slots
  const timeSlots = [
    "6:00 AM",
    "7:00 AM",
    "8:00 AM",
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
    "7:00 PM",
    "8:00 PM",
  ];

  // Days of the week
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  // Sample locations
  const sampleLocations = [
    "Bagar, Pokhara",
    "Lamachour, Pokhara",
    "Chipledhunga, Pokhara",
    "Lakeside, Pokhara",
    "New-Road, Pokhara",
    "Hemja, Pokhara",
    "MahendraPul, Pokhara",
    "Lekhnath, Pokhara",
  ];

  // Sample skills
  const availableSkills = [
    "Plumbing",
    "Electrical",
    "Carpentry",
    "Painting",
    "Cleaning",
    "Gardening",
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  // Fix for ImagePicker error
  const pickImage = async (type) => {
    try {
      if (type === "profile") {
        const permissionResult =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
          Alert.alert(
            "Permission Denied",
            "You need to allow access to your photos."
          );
          return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images, // Fixed: Use proper enum
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });

        if (!result.canceled) {
          setFormData((prev) => ({
            ...prev,
            profileImage: result.assets[0].uri,
          }));
        }
      } else if (type === "document") {
        const result = await DocumentPicker.getDocumentAsync({
          type: "application/pdf",
          copyToCacheDirectory: true,
        });

        if (result.type === "success") {
          setFormData((prev) => ({
            ...prev,
            officialDocument: result.uri,
          }));
        }
      }
    } catch (error) {
      Alert.alert(
        "Error",
        `Failed to pick ${type === "profile" ? "image" : "document"}`
      );
      console.error("Picker Error:", error);
    }
  };
  // Toggle day selection
  const toggleDay = (day) => {
    setAvailability((prev) => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(day)
        ? prev.selectedDays.filter((d) => d !== day)
        : [...prev.selectedDays, day],
    }));
  };
  // Toggle time slot for a specific day
  const toggleTimeSlot = (day, timeSlot) => {
    setAvailability((prev) => ({
      ...prev,
      timeSlots: {
        ...prev.timeSlots,
        [day]: {
          ...prev.timeSlots[day],
          [timeSlot]: !prev.timeSlots[day]?.[timeSlot],
        },
      },
    }));
  };
  // Handle recurring type change
  const handleRecurringChange = (value) => {
    setAvailability((prev) => ({
      ...prev,
      recurringType: value,
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleServiceInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      currentService: {
        ...prev.currentService,
        [field]: value,
      },
    }));
  };
  // Render the availability section
  const renderAvailabilitySection = () => (
    <View style={styles.inputContainer}>
      <Text style={styles.sectionHeader}>Availability</Text>

      {/* Recurring Option */}
      <View style={styles.recurringContainer}>
        <Text style={styles.label}>Recurring Schedule</Text>
        <Picker
          selectedValue={availability.recurringType}
          onValueChange={handleRecurringChange}
          style={styles.picker}
        >
          <Picker.Item label="No Recurring Schedule" value="none" />
          <Picker.Item label="Daily" value="daily" />
          <Picker.Item label="Weekly" value="weekly" />
          <Picker.Item label="Monthly" value="monthly" />
        </Picker>
      </View>

      {/* Days Selection */}
      <Text style={styles.label}>Available Days</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.daysScrollContainer}
      >
        {daysOfWeek.map((day) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayButton,
              availability.selectedDays.includes(day) &&
                styles.dayButtonSelected,
            ]}
            onPress={() => toggleDay(day)}
          >
            <Text
              style={[
                styles.dayButtonText,
                availability.selectedDays.includes(day) &&
                  styles.dayButtonTextSelected,
              ]}
            >
              {day.slice(0, 3)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Time Slots */}
      {availability.selectedDays.map((day) => (
        <View key={day} style={styles.timeSlotsContainer}>
          <Text style={styles.dayHeader}>{day}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {timeSlots.map((timeSlot) => (
              <TouchableOpacity
                key={`${day}-${timeSlot}`}
                style={[
                  styles.timeSlotButton,
                  availability.timeSlots[day]?.[timeSlot] &&
                    styles.timeSlotButtonSelected,
                ]}
                onPress={() => toggleTimeSlot(day, timeSlot)}
              >
                <Text
                  style={[
                    styles.timeSlotText,
                    availability.timeSlots[day]?.[timeSlot] &&
                      styles.timeSlotTextSelected,
                  ]}
                >
                  {timeSlot}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ))}
    </View>
  );

  const toggleSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      selectedSkills: prev.selectedSkills.includes(skill)
        ? prev.selectedSkills.filter((s) => s !== skill)
        : [...prev.selectedSkills, skill],
    }));
  };

  const searchLocations = (text) => {
    handleInputChange("location", text);
    if (text.length > 0) {
      const filtered = sampleLocations.filter((loc) =>
        loc.toLowerCase().includes(text.toLowerCase())
      );
      setLocationSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setLocationSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectLocation = (selectedLocation) => {
    handleInputChange("location", selectedLocation);
    setShowSuggestions(false);
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      Alert.alert("Error", "Please enter your full name");
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return false;
    }
    if (!formData.location.trim()) {
      Alert.alert("Error", "Please select your location");
      return false;
    }
    if (formData.selectedSkills.length === 0) {
      Alert.alert("Error", "Please select at least one skill");
      return false;
    }
    return true;
  };

  const handleSaveAll = async () => {
    if (!validateForm()) return;

    // Check if there's a current service being entered
    if (
      formData.currentService.title ||
      formData.currentService.description ||
      formData.currentService.price
    ) {
      if (
        !formData.currentService.title ||
        !formData.currentService.description
      ) {
        Alert.alert(
          "Warning",
          "You have an incomplete service. Please complete or clear the service fields before saving."
        );
        return;
      }
      // Add the current service to the services array
      setFormData((prev) => ({
        ...prev,
        services: [
          ...prev.services,
          { ...prev.currentService, id: Date.now() },
        ],
        currentService: { title: "", description: "", price: "" },
      }));
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Saving profile data:", formData);
      Alert.alert(
        "Success",
        "Profile information and services saved successfully"
      );

      // Clear all fields
      setFormData({
        fullName: "",
        email: "",
        location: "",
        bio: "",
        profileImage: null,
        selectedSkills: [],
        services: [],
        officialDocument: null,
        currentService: { title: "", description: "", price: "" },
      });
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to save profile information. Please try again."
      );
      console.error("Save profile error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>Profile Information</Text>

        {/* Profile Image Section */}
        <View style={styles.imageContainer}>
          {formData.profileImage ? (
            <Image
              source={{ uri: formData.profileImage }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderText}>No Image</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.imageButton}
            onPress={() => pickImage("profile")}
          >
            <Text style={styles.imageButtonText}>
              {formData.profileImage ? "Change Photo" : "Upload Photo"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Personal Information Fields */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            value={formData.fullName}
            onChangeText={(text) => handleInputChange("fullName", text)}
            maxLength={50}
            autoCapitalize="words"
          />
        </View>

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
        </View>

        {/* Skills Section */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Skills</Text>
          <View style={styles.skillsContainer}>
            {availableSkills.map((skill) => (
              <TouchableOpacity
                key={skill}
                style={[
                  styles.skillButton,
                  formData.selectedSkills.includes(skill) &&
                    styles.skillButtonSelected,
                ]}
                onPress={() => toggleSkill(skill)}
              >
                <Text
                  style={[
                    styles.skillButtonText,
                    formData.selectedSkills.includes(skill) &&
                      styles.skillButtonTextSelected,
                  ]}
                >
                  {skill}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Service Input Section */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Add Service</Text>
          <TextInput
            style={styles.input}
            placeholder="Service Title "
            value={formData.currentService.title}
            onChangeText={(text) => handleServiceInputChange("title", text)}
          />
          {/* Add Availability Section before the Save Button */}
          {renderAvailabilitySection()}
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Service Description"
            value={formData.currentService.description}
            textAlignVertical="top"
            onChangeText={(text) =>
              handleServiceInputChange("description", text)
            }
            multiline
          />
          <TextInput
            style={styles.input}
            placeholder="Price (per Hours)"
            value={formData.currentService.price}
            onChangeText={(text) => handleServiceInputChange("price", text)}
          />
        </View>

        {/* Display existing services */}
        {formData.services.map((service) => (
          <View key={service.id} style={styles.serviceCard}>
            <Text style={styles.serviceTitle}>{service.title}</Text>
            <Text style={styles.serviceDescription}>{service.description}</Text>
            {service.price && (
              <Text style={styles.servicePrice}>
                Price: Rs. {service.price}
              </Text>
            )}
          </View>
        ))}

        {/* Bio Section */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tell us about yourself, also experience"
            value={formData.bio}
            onChangeText={(text) => handleInputChange("bio", text)}
            multiline
            maxLength={500}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{formData.bio.length}/500</Text>
        </View>
        {/* Official Document Section */}
        <View style={styles.imageContainer}>
          <Text style={styles.label}>Upload Official Document</Text>
          {formData.officialDocument ? (
            <Image
              source={{ uri: formData.officialDocument }}
              style={styles.documentImage}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderText}>No Document</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.imageButton}
            onPress={() => pickImage("document")}
          >
            <Text style={styles.imageButtonText}>
              {formData.officialDocument
                ? "Change Document"
                : "Upload Document"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, isSubmitting && styles.saveButtonDisabled]}
          onPress={handleSaveAll}
          disabled={isSubmitting}
        >
          <Text style={styles.saveButtonText}>
            {isSubmitting ? "Saving..." : "Save "}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
export default ProfileInformationScreen;

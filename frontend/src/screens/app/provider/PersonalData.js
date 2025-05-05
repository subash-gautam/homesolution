import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import backend from "../../../utils/api";
const PersonalData = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [providerData, setProviderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const navigation = useNavigation();

  const fetchProviderData = async () => {
    try {
      const token = await AsyncStorage.getItem("providerToken");
      const providerData = await AsyncStorage.getItem("providerData");

      if (!token || !providerData) {
        throw new Error("No provider data found");
      }

      const parsedData = JSON.parse(providerData);
      const providerId = parsedData.id;

      const response = await fetch(
        `${backend.backendUrl}/api/providers/${providerId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch provider data");
      }

      const data = await response.json();

      // Exclude password from the data
      const { password, ...filteredData } = data;
      setProviderData(filteredData);
      setFormData({
        name: filteredData.name || "",
        email: filteredData.email || "",
        phone: filteredData.phone || "",
        address: filteredData.address || "",
        services: filteredData.services
          ? filteredData.services.map((s) => s.name).join(", ")
          : "",
      });
    } catch (error) {
      console.error("Error fetching provider data:", error);
      Alert.alert("Error", "Failed to load personal data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviderData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProviderData();
    setRefreshing(false);
  };

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem("providerToken");
      const providerData = await AsyncStorage.getItem("providerData");
      const parsedData = JSON.parse(providerData);
      const providerId = parsedData.id;

      // Split services string back into array for API
      const servicesArray = formData.services
        ? formData.services.split(",").map((s) => s.trim())
        : [];

      const response = await fetch(
        `${backend.backendUrl}/api/providers/${providerId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            services: servicesArray,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update provider data");
      }

      const updatedData = await response.json();
      const { password, ...filteredData } = updatedData;
      setProviderData(filteredData);

      // Update AsyncStorage
      await AsyncStorage.setItem("providerData", JSON.stringify(updatedData));
      setEditing(false);
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      console.error("Error updating provider data:", error);
      Alert.alert("Error", "Failed to update profile");
    }
  };

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4299E1" />
      </View>
    );
  }

  if (!providerData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No data available</Text>
      </View>
    );
  }

  // Fields to display
  const displayFields = [
    { label: "Name", key: "name", editable: true },
    { label: "Phone", key: "phone", editable: true },
    { label: "Email", key: "email", editable: true },
    { label: "Address", key: "address", editable: true },
    { label: "Services", key: "services", editable: true },
    {
      label: "Verification Status",
      key: "verificationStatus",
      editable: false,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#4299E1"]}
          />
        }
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Personal Data</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => (editing ? handleSave() : setEditing(true))}
          >
            <Ionicons
              name={editing ? "save" : "pencil"}
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          {displayFields.map(
            (field, index) =>
              providerData[field.key] !== undefined && (
                <View key={index} style={styles.dataRow}>
                  <Text style={styles.label}>{field.label}</Text>
                  {editing && field.editable ? (
                    <TextInput
                      style={styles.input}
                      value={formData[field.key]?.toString() || ""}
                      onChangeText={(text) =>
                        handleInputChange(field.key, text)
                      }
                      placeholder={`Enter ${field.label}`}
                      multiline={field.key === "services"}
                    />
                  ) : (
                    <Text style={styles.value}>
                      {field.key === "services"
                        ? providerData[field.key]
                            ?.map((s) => s.name)
                            .join(", ") || "N/A"
                        : providerData[field.key]?.toString() || "N/A"}
                    </Text>
                  )}
                </View>
              )
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4299E1",
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  backButton: {
    padding: 8,
  },
  editButton: {
    padding: 8,
  },
  headerText: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    color: "white",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    margin: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF2F7",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2D3748",
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: "#4A5568",
    flex: 1,
    textAlign: "right",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#4A5568",
    borderWidth: 1,
    borderColor: "#CBD5E0",
    borderRadius: 8,
    padding: 8,
    textAlign: "right",
  },
  errorText: {
    fontSize: 18,
    color: "#E53E3E",
    textAlign: "center",
    marginTop: 20,
  },
});

export default PersonalData;

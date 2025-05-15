import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  TextInput,
  ActivityIndicator,
  Linking,
  Platform,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../../../../components/HomeHeader";
import { colors } from "../../../../utils/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import backend from "../../../../utils/api";

const Phome = ({ navigation }) => {
  const [availability, setAvailability] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userName, setUserName] = useState("Provider");
  const [firstLogin, setFirstLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  const stats = [
    { label: "Total Jobs", value: "125", icon: "briefcase" },
    { label: "Rating", value: "4.8", icon: "star" },
    { label: "Completed", value: "95%", icon: "checkmark-done" },
  ];

  useEffect(() => {
    const fetchDataAndCheckFirstLogin = async () => {
      try {
        const providerData = await AsyncStorage.getItem("providerData");
        if (providerData) {
          const parsedUserData = JSON.parse(providerData);
          setUserName(parsedUserData.name || "Provider");
        }

        const hasLoggedInBefore = await AsyncStorage.getItem(
          "hasLoggedInBefore"
        );
        if (hasLoggedInBefore === null) {
          setFirstLogin(true);
          await AsyncStorage.setItem("hasLoggedInBefore", "true");
        } else {
          setFirstLogin(false);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataAndCheckFirstLogin();
    fetchProviderBookings();
  }, []);

  const fetchProviderBookings = async () => {
    try {
      const userData = await AsyncStorage.getItem("providerData");
      if (!userData) throw new Error("Provider not found");

      const provider = JSON.parse(userData);
      const response = await axios.get(
        `${backend.backendUrl}/api/bookings?providerId=${provider.id}&bookingStatus=pending,confirmed`
      );
      setBookings(response.data);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      setFetchError("Failed to load bookings");
    }
  };

  const handleSeeAll = () => {
    navigation.navigate("JobHistory");
  };

  const handleNotificationPress = () => {
    navigation.navigate("Notifications");
  };

  const handleProfilePress = () => {
    navigation.navigate("Profile");
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProviderBookings();
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return colors.success;
      case "confirmed":
        return colors.warning;
      case "pending":
        return colors.accent;
      case "rejected":
        return colors.error;
      default:
        return colors.text;
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const openMap = (lat, lon, address) => {
    const scheme = Platform.OS === "ios" ? "maps:0,0?q=" : "geo:0,0?q=";
    const label = address || "Location";
    const latLng = `${lat},${lon}`;
    const url =
      Platform.OS === "ios"
        ? `${scheme}${label}@${latLng}`
        : `${scheme}${latLng}(${label})`;

    Linking.openURL(url).catch(() => {
      alert("Could not open maps.");
    });
  };

  const handleBookingAction = async (bookingId, action) => {
    try {
      const token = await AsyncStorage.getItem("providerToken");
      if (!token) throw new Error("No token found");

      const response = await axios.put(
        `${backend.backendUrl}/api/bookings/${bookingId}`,
        { bookingStatus: action },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // If completing the booking was successful, show success message
      if (action === "completed") {
        Alert.alert("Success", "Booking marked as completed successfully!", [
          { text: "OK" },
        ]);
      }

      // Update the local state to reflect the new status
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, bookingStatus: action } : b
        )
      );

      // If the booking is completed, remove it from the list after a short delay
      if (action === "completed") {
        setTimeout(() => {
          setBookings((prev) => prev.filter((b) => b.id !== bookingId));
        }, 2000);
      }
    } catch (error) {
      console.error(
        "Update booking failed:",
        error.response?.data || error.message
      );
      Alert.alert("Error", `Failed to ${action} booking. Please try again.`, [
        { text: "OK" },
      ]);
    }
  };

  const confirmComplete = (bookingId) => {
    Alert.alert(
      "Confirm Completion",
      "Are you sure you want to mark this booking as completed?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => handleBookingAction(bookingId, "completed"),
        },
      ]
    );
  };

  const renderBookingItem = ({ item }) => (
    <LinearGradient
      colors={["#ffffff", "#f5f5f5"]}
      style={styles.jobCard}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Status + Date */}
      <View style={styles.itemHeader}>
        <Text
          style={[
            styles.statusText,
            { color: getStatusColor(item.bookingStatus) },
          ]}
        >
          {item.bookingStatus.toUpperCase()}
        </Text>
        <Text style={styles.dateText}>{formatDate(item.scheduledDate)}</Text>
      </View>
      {/* category Name */}
      <View style={styles.detailRow}>
        <Ionicons name="briefcase-outline" size={16} color={colors.text} />
        <Text style={styles.detailText}>Category: {item.category}</Text>
      </View>
      {/* Service Name */}
      <View style={styles.detailRow}>
        <Ionicons name="briefcase-outline" size={16} color={colors.text} />
        <Text style={styles.detailText}>Service: {item.service}</Text>
      </View>

      {/* User Name */}
      <View style={styles.detailRow}>
        <Ionicons name="person-outline" size={16} color={colors.text} />
        <Text style={styles.detailText}>Client: {item.user}</Text>
      </View>

      {/* Address */}
      <View style={styles.detailRow}>
        <Ionicons name="location-outline" size={16} color={colors.text} />
        <Text style={styles.detailText}>
          Address: {item.address || "Not specified"}
          {item.city ? `, ${item.city}` : ""}
        </Text>
      </View>

      {/* Open in Map Button */}
      {item.lat && item.lon && (
        <TouchableOpacity
          style={styles.mapButton}
          onPress={() => openMap(item.lat, item.lon, item.address)}
        >
          <Ionicons name="navigate-outline" size={16} color={colors.primary} />
          <Text style={styles.mapButtonText}>Open in Maps</Text>
        </TouchableOpacity>
      )}

      {/* Payment + Amount */}
      <View style={styles.priceContainer}>
        <View style={styles.detailRow}>
          <MaterialIcons name="payment" size={16} color={colors.primary} />
          <Text style={styles.detailText}>
            Payment: {item.paymentStatus.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.priceText}>Amount: Rs. {item.amount || "N/A"}</Text>
      </View>

      {/* Action Buttons */}
      {item.bookingStatus === "pending" && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.declineButton]}
            onPress={() => handleBookingAction(item.id, "rejected")}
          >
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.acceptButton]}
            onPress={() => handleBookingAction(item.id, "confirmed")}
          >
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Mark as Complete Button for Confirmed Bookings */}
      {item.bookingStatus === "confirmed" && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.completeButton]}
            onPress={() => confirmComplete(item.id)}
          >
            <Text style={styles.buttonText}>Mark as Complete</Text>
          </TouchableOpacity>
        </View>
      )}
    </LinearGradient>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#f5f7fa", "#c3cfe2"]}
      style={styles.gradientContainer}
    >
      {/* Header Section */}
      <Header
        title={firstLogin ? `Welcome, ${userName}!` : `Hello, ${userName}!`}
        showSearch={false}
        showNotification={true}
        onNotificationPress={handleNotificationPress}
        showProfile={true}
        onProfilePress={handleProfilePress}
      />

      {/* Greeting Message for First Login */}
      {firstLogin && (
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>
            Welcome to our platform, {userName}!
          </Text>
        </View>
      )}

      {/* Search Section */}
      <View style={styles.searchSection}>
        <LinearGradient
          colors={["#ffffff", "#f9f9f9"]}
          style={styles.searchContainer}
        >
          <Ionicons name="search" size={20} color={colors.darkGray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search services or clients..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </LinearGradient>
      </View>

      {/* Main Content */}
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Availability Toggle */}
        <LinearGradient
          colors={["#ffffff", "#f5f5f5"]}
          style={styles.availabilityContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.availabilityText}>
            {availability ? "Available for Jobs" : "Not Available"}
          </Text>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              availability ? styles.activeToggle : styles.inactiveToggle,
            ]}
            onPress={() => setAvailability(!availability)}
          >
            <Text style={styles.toggleText}>{availability ? "ON" : "OFF"}</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Job List Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Incoming Bookings</Text>
        </View>

        {/* Bookings List */}
        {fetchError ? (
          <Text style={styles.noJobsText}>{fetchError}</Text>
        ) : bookings.length === 0 ? (
          <Text style={styles.noJobsText}>No pending bookings found.</Text>
        ) : (
          <FlatList
            data={bookings}
            renderItem={renderBookingItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        )}
      </ScrollView>
    </LinearGradient>
  );
};

export default Phome;

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  searchSection: {
    marginBottom: 20,
    paddingTop: 8,
    paddingHorizontal: 15,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
  },
  availabilityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  availabilityText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: "500",
  },
  toggleButton: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  activeToggle: {
    backgroundColor: colors.success,
  },
  inactiveToggle: {
    backgroundColor: colors.error,
  },
  toggleText: {
    color: colors.white,
    fontWeight: "bold",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    borderRadius: 12,
    padding: 16,
    width: "30%",
    alignItems: "center",
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  seeAllText: {
    color: colors.primary,
    fontWeight: "500",
  },
  jobCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  statusText: {
    fontWeight: "bold",
  },
  dateText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  detailText: {
    marginLeft: 8,
    color: colors.text,
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  mapButtonText: {
    marginLeft: 6,
    color: colors.primary,
  },
  priceContainer: {
    marginTop: 10,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.success,
    alignSelf: "flex-end",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 10,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  acceptButton: {
    backgroundColor: colors.success,
  },
  declineButton: {
    backgroundColor: colors.error,
  },
  completeButton: {
    backgroundColor: colors.primary,
    minWidth: 150,
    alignItems: "center",
  },
  buttonText: {
    color: colors.white,
    fontWeight: "500",
    textAlign: "center",
  },
  quickNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  navCard: {
    borderRadius: 12,
    padding: 16,
    width: "48%",
    alignItems: "center",
    elevation: 2,
  },
  navButton: {
    alignItems: "center",
  },
  navText: {
    marginTop: 8,
    color: colors.text,
    fontWeight: "500",
  },
  noJobsText: {
    textAlign: "center",
    color: colors.textSecondary,
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  greetingContainer: {
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  greetingText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: "500",
  },
});

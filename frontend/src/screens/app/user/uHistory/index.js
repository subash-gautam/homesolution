import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Linking,
  Platform,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "../../../../utils/colors";
import Header from "../../../../components/HomeHeader";
import styles from "./styles"; // Assuming styles.js exists for UHistory
import axios from "axios";
import backend from "../../../../utils/api";

const API_URL = `${backend.backendUrl}/api/bookings`;

// Helper function to format the price for display
const formatBookingPriceDisplay = (numericPrice) => {
  if (
    numericPrice === null ||
    numericPrice === undefined ||
    isNaN(Number(numericPrice))
  ) {
    return "Not specified";
  }
  return `Rs. ${Number(numericPrice)} onwards`;
};

const UHistory = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        if (userData) {
          const user = JSON.parse(userData);
          setUserId(user.id);
        } else {
          setError("User not found. Please login.");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error retrieving user:", error);
        setError("Failed to load user data");
        setLoading(false);
      }
    };
    getUserId();
  }, []);

  useEffect(() => {
    if (userId) fetchBookings();
  }, [userId, selectedFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      let url = `${API_URL}?userId=${userId}`;
      if (selectedFilter !== "all") {
        url += `&bookingStatus=${selectedFilter}`;
      }
      const response = await axios.get(url);
      setBookings(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch bookings");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchBookings();
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

  const filteredBookings = bookings.filter((booking) => {
    const query = searchQuery.toLowerCase();
    // Ensure booking.service and booking.provider exist and have a 'name' property or are strings
    const serviceName =
      typeof booking.service === "object" && booking.service !== null
        ? booking.service.name
        : booking.service;
    const providerName =
      typeof booking.provider === "object" && booking.provider !== null
        ? booking.provider.name
        : booking.provider;

    return (
      (serviceName || "").toLowerCase().includes(query) ||
      (providerName || "").toLowerCase().includes(query)
    );
  });

  const sections = [{ title: "Bookings", data: filteredBookings }];

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

  const renderItem = ({ item }) => {
    // Ensure item.service and item.provider exist and have a 'name' property or are strings
    const serviceName =
      typeof item.service === "object" && item.service !== null
        ? item.service.name
        : item.service;
    const providerName =
      typeof item.provider === "object" && item.provider !== null
        ? item.provider.name
        : item.provider;

    return (
      <TouchableOpacity style={styles.itemContainer}>
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

        <View style={styles.detailRow}>
          <Ionicons name="briefcase-outline" size={16} color={colors.text} />
          <Text style={styles.detailText}>Service: {serviceName || "N/A"}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="person-outline" size={16} color={colors.text} />
          <Text style={styles.detailText}>
            Provider: {(providerName || "N/A").trim()}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={16} color={colors.text} />
          <Text style={styles.detailText}>
            Address: {item.address || "Not specified"}
            {item.city ? `, ${item.city}` : ""}
          </Text>
        </View>

        {item.lat && item.lon && (
          <TouchableOpacity
            style={styles.mapButton}
            onPress={() => {
              const scheme = Platform.select({
                ios: "maps:0,0?q=",
                android: "geo:0,0?q=",
              });
              const latLng = `${item.lat},${item.lon}`;
              const label = item.address || "Location";
              const url = Platform.select({
                ios: `${scheme}${label}@${latLng}`,
                android: `${scheme}${latLng}(${label})`,
                default: `https://www.google.com/maps?q=${latLng}`,
              });
              Linking.openURL(url).catch((err) =>
                console.error("Couldn't load page", err)
              );
            }}
          >
            <Ionicons
              name="navigate-outline"
              size={16}
              color={colors.primary}
            />
            <Text style={[styles.mapButtonText, { color: colors.primary }]}>
              Open in Maps
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.priceContainer}>
          <View style={styles.detailRow}>
            <MaterialIcons name="payment" size={16} color={colors.primary} />
            <Text style={styles.detailText}>
              Payment: {item.paymentStatus.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.priceText}>
            Amount: {formatBookingPriceDisplay(item.amount)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error && !bookings.length) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchBookings} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Booking History"
        showSearch={true}
        onSearch={setSearchQuery}
        keyword={searchQuery}
        placeholder="Search by service or provider"
      />
      <View style={styles.header}>
        <View style={styles.filterContainer}>
          {["all", "pending", "confirmed", "completed", "rejected"].map(
            (filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  selectedFilter === filter && styles.activeFilter,
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedFilter === filter && styles.activeFilterText,
                  ]}
                >
                  {filter.toUpperCase()}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </View>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        renderSectionHeader={({ section }) =>
          section.data.length > 0 ? (
            <Text style={styles.sectionHeader}>{section.title}</Text>
          ) : null
        }
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.emptyText}>
              No bookings found for "{selectedFilter}" filter{" "}
              {searchQuery && `matching "${searchQuery}"`}.
            </Text>
          ) : null
        }
      />
    </View>
  );
};

export default UHistory;

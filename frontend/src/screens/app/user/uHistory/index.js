import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "../../../../utils/colors";
import Header from "../../../../components/HomeHeader";
import styles from "./styles";
import axios from "axios";
import backend from "../../../../utils/api";

const API_URL = `${backend.backendUrl}/api/bookings`;

const UHistory = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  // Get user ID from AsyncStorage
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

  // Fetch bookings when user ID or filter changes
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
    return (
      booking.service.toLowerCase().includes(query) ||
      booking.provider.toLowerCase().includes(query)
    );
  });

  const sections = [
    {
      title: "Bookings",
      data: filteredBookings,
    },
  ];

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

  const renderItem = ({ item }) => (
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
        <Ionicons name="briefcase" size={16} color={colors.text} />
        <Text style={styles.detailText}>Service: {item.service}</Text>
      </View>

      <View style={styles.detailRow}>
        <Ionicons name="person" size={16} color={colors.text} />
        <Text style={styles.detailText}>Provider: {item.provider.trim()}</Text>
      </View>

      <View style={styles.priceContainer}>
        <View style={styles.detailRow}>
          <MaterialIcons name="payment" size={16} color={colors.primary} />
          <Text style={styles.detailText}>
            Payment: {item.paymentStatus.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.priceText}>
          Amount: {item.amount || "Not specified"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchBookings}>
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
                <Text style={styles.filterText}>{filter.toUpperCase()}</Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
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
          <Text style={styles.emptyText}>No bookings found</Text>
        }
      />
    </View>
  );
};

export default UHistory;

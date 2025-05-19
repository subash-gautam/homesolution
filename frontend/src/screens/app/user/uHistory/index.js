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
  ScrollView,
  Image,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "../../../../utils/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../../components/HomeHeader";
import styles from "./styles";
import axios from "axios";
import backend from "../../../../utils/api";
import { socket } from "../../../../utils/api";
const API_URL = `${backend.backendUrl}/api/bookings`;

const formatBookingPriceDisplay = (numericPrice) => {
  if (!numericPrice || isNaN(Number(numericPrice))) return "Not specified";
  return `Rs. ${Number(numericPrice)}`;
};

const UHistory = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState("");

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        const token = await AsyncStorage.getItem("userToken");

        if (userData) {
          const user = JSON.parse(userData);
          setUserId(user.id);
          setUserToken(token);
        } else {
          setError("User not found. Please login.");
          setLoading(false);
        }
      } catch (err) {
        setError("Failed to load user data");
        setLoading(false);
      }
    };
    getUserData();
  }, []);

  useEffect(() => {
    socket.on("provider_updated_booking", (updatedBooking) => {
      fetchBookings();
    });
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
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      // Ask for confirmation before proceeding
      Alert.alert(
        "Cancel Booking",
        "Are you sure you want to cancel this booking?",
        [
          {
            text: "No",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: async () => {
              // Show loading indicator
              setLoading(true);

              // Send cancellation request to backend
              const response = await axios.put(
                `${API_URL}/${bookingId}`,
                { bookingStatus: "cancelled" },
                {
                  headers: {
                    Authorization: `Bearer ${userToken}`,
                  },
                }
              );

              // Update the booking in the state
              setBookings((prev) =>
                prev.map((booking) =>
                  booking.id === bookingId
                    ? { ...booking, bookingStatus: "cancelled" }
                    : booking
                )
              );

              // Show success message
              Alert.alert(
                "Success",
                "Your booking has been cancelled successfully",
                [{ text: "OK" }]
              );

              // Refresh bookings list
              fetchBookings();
            },
          },
        ]
      );
    } catch (err) {
      console.error("Failed to cancel booking:", err);
      Alert.alert("Error", "Failed to cancel booking. Please try again.", [
        { text: "OK" },
      ]);
    } finally {
      setLoading(false);
    }
  };
  const handleMarkAsComplete = async (bookingId) => {
    try {
      // Ask for confirmation before proceeding
      Alert.alert("Mark as Completed", "Have you completed this booking?", [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            setLoading(true);
            // Send update request to backend
            const response = await axios.put(
              `${API_URL}/${bookingId}`,
              { bookingStatus: "completed" },
              {
                headers: {
                  Authorization: `Bearer ${userToken}`,
                },
              }
            );
            // Update the booking in the state
            setBookings((prev) =>
              prev.map((booking) =>
                booking.id === bookingId
                  ? { ...booking, bookingStatus: "completed" }
                  : booking
              )
            );
            // Show success message
            Alert.alert(
              "Success",
              "This booking has been marked as completed.",
              [{ text: "OK" }]
            );
            fetchBookings();
          },
        },
      ]);
    } catch (err) {
      console.error("Failed to mark booking as complete:", err);
      Alert.alert("Error", "Failed to update status. Please try again.", [
        { text: "OK" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRatingModal = (booking) => {
    setSelectedBooking(booking);
    setRating(booking.rating || 0);
    setRatingComment(booking.ratingComment || "");
    setRatingModalVisible(true);
  };

  const handleRatingSubmit = async () => {
    if (!selectedBooking) return;

    try {
      setLoading(true);

      // Send rating to the backend
      const response = await axios.put(
        `${API_URL}/${selectedBooking.id}`,
        {
          rating: rating,
          ratingComment: ratingComment,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      // Update local state
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === selectedBooking.id
            ? { ...booking, rating: rating, ratingComment: ratingComment }
            : booking
        )
      );

      // Close modal and reset
      setRatingModalVisible(false);
      setSelectedBooking(null);

      // Show success message
      Alert.alert(
        "Rating Submitted",
        "Thank you for rating your service provider!",
        [{ text: "OK" }]
      );

      // Refresh bookings to get updated data
      fetchBookings();
    } catch (err) {
      console.error("Failed to submit rating:", err);
      Alert.alert("Error", "Failed to submit rating. Please try again.", [
        { text: "OK" },
      ]);
    } finally {
      setLoading(false);
    }
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
      case "cancelled":
        return "#E57373"; // Light red color for cancelled bookings
      default:
        return colors.text;
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const query = searchQuery.toLowerCase();
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

  const getFilterStatusMessage = () => {
    if (searchQuery && filteredBookings.length === 0) {
      return `No bookings found matching "${searchQuery}"`;
    }
    return selectedFilter === "all"
      ? "You have no bookings"
      : `You have no ${selectedFilter} bookings`;
  };

  const renderStars = (ratingValue, interactive = false) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            disabled={!interactive}
            onPress={() => interactive && setRating(star)}
          >
            <Ionicons
              name={star <= ratingValue ? "star" : "star-outline"}
              size={interactive ? 36 : 18}
              color={star <= ratingValue ? "#FFD700" : "#C0C0C0"}
              style={styles.starIcon}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderRatingModal = () => {
    if (!selectedBooking) return null;

    const providerName =
      typeof selectedBooking.provider === "object" &&
      selectedBooking.provider !== null
        ? selectedBooking.provider.name
        : selectedBooking.provider;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={ratingModalVisible}
        onRequestClose={() => setRatingModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setRatingModalVisible(false)}
            >
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Rate Your Experience</Text>
            <Text style={styles.modalSubtitle}>
              How was your service with {providerName || "this provider"}?
            </Text>

            <View style={styles.ratingValueContainer}>
              {renderStars(rating, true)}
              {rating > 0 && (
                <Text style={styles.ratingValueText}>{rating}/5</Text>
              )}
            </View>

            <TextInput
              style={styles.commentInput}
              placeholder="Leave a comment (optional)"
              value={ratingComment}
              onChangeText={setRatingComment}
              multiline={true}
              numberOfLines={3}
            />

            <TouchableOpacity
              style={[
                styles.submitButton,
                rating === 0 && styles.disabledButton,
              ]}
              disabled={rating === 0}
              onPress={handleRatingSubmit}
            >
              <Text style={styles.submitButtonText}>Submit Rating</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const renderItem = ({ item }) => {
    const serviceName =
      typeof item.service === "object" && item.service !== null
        ? item.service.name
        : item.service;
    const providerName =
      typeof item.provider === "object" && item.provider !== null
        ? item.provider.name
        : item.provider;

    const categoryName =
      typeof item.category === "object" && item.category !== null
        ? item.category.name
        : item.category;

    return (
      <TouchableOpacity style={styles.itemContainer}>
        <View style={styles.itemHeader}>
          <Text
            style={[
              styles.statusText,
              { color: getStatusColor(item.bookingStatus) },
            ]}
          >
            {item.bookingStatus === "cancelled"
              ? "CANCELLED"
              : item.bookingStatus === "rejected"
              ? "REJECTED"
              : item.bookingStatus.toUpperCase()}
          </Text>
          <Text style={styles.dateText}>{formatDate(item.scheduledDate)}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="briefcase-outline" size={16} color={colors.text} />
          <Text style={styles.detailText}>
            Category: {categoryName || "N/A"}
          </Text>
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
                console.error("Couldn't load map:", err)
              );
            }}
          >
            <Ionicons
              name="navigate-outline"
              size={16}
              color={colors.primary}
            />
            <Text style={styles.mapButtonText}>Open in Maps</Text>
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

        {/* Action Buttons Section */}
        <View style={styles.actionButtons}>
          {/* Cancel Button for Pending Bookings */}
          {item.bookingStatus === "pending" && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleCancelBooking(item.id)}
            >
              <Text style={styles.cancelButtonText}>Cancel Booking</Text>
            </TouchableOpacity>
          )}
          {/* Mark as Complete Button for Confirmed Bookings */}
          {item.bookingStatus === "confirmed" && (
            <TouchableOpacity
              style={styles.markCompleteButton}
              onPress={() => handleMarkAsComplete(item.id)}
            >
              <MaterialIcons name="done-all" size={16} color={colors.white} />
              <Text style={styles.markCompleteButtonText}>
                Mark as Complete
              </Text>
            </TouchableOpacity>
          )}
          {/* Rating Section for Completed Bookings */}
          {item.bookingStatus === "completed" && (
            <View style={styles.ratingSection}>
              {item.rating ? (
                <View style={styles.ratingDisplayContainer}>
                  <Text style={styles.ratedText}>
                    You rated: {item.rating}/5
                  </Text>
                  {renderStars(item.rating)}
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.rateButton}
                  onPress={() => handleOpenRatingModal(item)}
                >
                  <Ionicons name="star" size={16} color={colors.white} />
                  <Text style={styles.rateButtonText}>Rate Provider</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyComponent = () => {
    const message = getFilterStatusMessage();
    return (
      <View style={styles.emptyContainer}>
        <Image
          source={require("../../../../assets/no-bookings.png")}
          style={styles.emptyImage}
        />
        <Text style={styles.emptyText}>{message}</Text>
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContent}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error && !bookings.length) {
    return (
      <View style={styles.centerContent}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchBookings} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Booking History"
        showSearch={true}
        onSearch={setSearchQuery}
        keyword={searchQuery}
        placeholder="Search by service or provider"
      />

      <View style={styles.header}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          {[
            "all",
            "pending",
            "confirmed",
            "completed",
            "rejected",
            "cancelled",
          ].map((filter) => (
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
          ))}
        </ScrollView>
      </View>

      <SectionList
        sections={[{ title: "Bookings", data: filteredBookings }]}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        renderSectionHeader={({ section }) =>
          section.data.length > 0 ? (
            <Text style={styles.sectionHeader}>{section.title}</Text>
          ) : null
        }
        contentContainerStyle={
          filteredBookings.length === 0 ? styles.centerContent : {}
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={renderEmptyComponent}
      />

      {renderRatingModal()}
    </SafeAreaView>
  );
};

export default UHistory;

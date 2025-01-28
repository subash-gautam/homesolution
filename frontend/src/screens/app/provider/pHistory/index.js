import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../../../utils/colors";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

// Mock data
const mockHistoryData = [
  {
    id: "1",
    service: "Home Cleaning",
    client: "Arun Singh",
    date: "2023-08-15",
    price: 85,
    status: "Completed",
    duration: "2 hours",
    details: {
      address: "Batulechour",
      clientPhone: "111111111",
      cancellationReason: null,
      recurring: true,
    },
  },
  {
    id: "2",
    service: "Furniture Assembly",
    client: "Sarita Dhami",
    date: "2023-08-14",
    price: 120,
    status: "Cancelled",
    duration: "3 hours",
    details: {
      address: "Bagar Pokhara",
      clientPhone: "1 345 678 901",
      cancellationReason: "Client schedule conflict",
      recurring: false,
    },
  },
];

const recurringClientsMock = [
  { id: "1", name: "Prakash Joshi", bookings: 5, rating: 4.8 },
  { id: "2", name: "Deepak Dhami", bookings: 3, rating: 4.9 },
  { id: "3", name: "Sima Devkota", bookings: 7, rating: 4.7 },
];

const HistoryScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [taskFilter, setTaskFilter] = useState("all");
  const [earningFilter, setEarningFilter] = useState("all");
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [refreshing, setRefreshing] = useState(false); // State for refresh control
  const tabBarHeight = useBottomTabBarHeight(); // Get the bottom tab bar height

  // Simulate a refresh action
  const onRefresh = () => {
    setRefreshing(true);
    // Simulate fetching new data (replace with actual API call)
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const toggleItem = (itemId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const renderDetails = (details) => (
    <View style={styles.detailsContainer}>
      <View style={styles.detailRow}>
        <Ionicons name="location" size={16} color={colors.darkGray} />
        <Text style={styles.detailText}>{details.address}</Text>
      </View>
      <View style={styles.detailRow}>
        <Ionicons name="call" size={16} color={colors.darkGray} />
        <Text style={styles.detailText}>{details.clientPhone}</Text>
      </View>
      {details.cancellationReason && (
        <View style={styles.detailRow}>
          <Ionicons name="warning" size={16} color={colors.error} />
          <Text style={[styles.detailText, { color: colors.error }]}>
            Cancellation Reason: {details.cancellationReason}
          </Text>
        </View>
      )}
    </View>
  );

  const renderStatusIndicator = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return (
          <Ionicons name="checkmark-circle" size={20} color={colors.success} />
        );
      case "pending":
        return (
          <Ionicons name="time-outline" size={20} color={colors.warning} />
        );
      case "cancelled":
        return <Ionicons name="close-circle" size={20} color={colors.error} />;
      default:
        return <Ionicons name="help-circle" size={20} color={colors.gray} />;
    }
  };

  const renderHistoryItem = ({ item }) => (
    <Pressable onPress={() => toggleItem(item.id)}>
      <LinearGradient
        colors={["#ffffff", "#f9f9f9"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.historyItem}
      >
        <View style={styles.itemHeader}>
          <Text style={styles.serviceName}>{item.service}</Text>
          {renderStatusIndicator(item.status)}
        </View>
        <Text style={styles.clientText}>{item.client}</Text>
        <View style={styles.itemFooter}>
          <Text style={styles.dateText}>{item.date}</Text>
          <Text style={styles.priceText}>${item.price}</Text>
        </View>
        {expandedItems.has(item.id) && renderDetails(item.details)}
      </LinearGradient>
    </Pressable>
  );

  const renderRecurringClient = ({ item }) => (
    <LinearGradient
      colors={["#6a11cb", "#2575fc"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.clientCard}
    >
      <Text style={styles.clientName}>{item.name}</Text>
      <View style={styles.clientStats}>
        <Ionicons name="star" size={16} color={colors.warning} />
        <Text style={styles.clientRating}>{item.rating}</Text>
      </View>
      <Text style={styles.clientBookings}>{item.bookings} bookings</Text>
    </LinearGradient>
  );

  const FilterButton = ({ title, value, type, activeFilter, onPress }) => (
    <Pressable
      style={[
        styles.filterButton,
        activeFilter === value && styles.activeFilter,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.filterText,
          activeFilter === value && styles.activeFilterText,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: tabBarHeight + 20, // Add padding for the tab bar
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <LinearGradient colors={["#f5f7fa", "#c3cfe2"]} style={styles.gradient}>
        {/* Section 1: Search Field */}
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

        {/* Section 2: Task Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tasks</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterContainer}
          >
            <FilterButton
              title="All"
              value="all"
              type="task"
              activeFilter={taskFilter}
              onPress={() => setTaskFilter("all")}
            />
            <FilterButton
              title="Completed"
              value="completed"
              type="task"
              activeFilter={taskFilter}
              onPress={() => setTaskFilter("completed")}
            />
            <FilterButton
              title="Pending"
              value="pending"
              type="task"
              activeFilter={taskFilter}
              onPress={() => setTaskFilter("pending")}
            />
            <FilterButton
              title="Cancelled"
              value="cancelled"
              type="task"
              activeFilter={taskFilter}
              onPress={() => setTaskFilter("cancelled")}
            />
          </ScrollView>
          <FlatList
            data={mockHistoryData}
            renderItem={renderHistoryItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="file-tray-outline"
                  size={60}
                  color={colors.gray}
                />
                <Text style={styles.emptyText}>No tasks found</Text>
              </View>
            }
            scrollEnabled={false} // Disable scrolling for nested FlatList
          />
        </View>

        {/* Section 3: Earning Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Earnings</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterContainer}
          >
            <FilterButton
              title="Total Earnings"
              value="all"
              type="earning"
              activeFilter={earningFilter}
              onPress={() => setEarningFilter("all")}
            />
            <FilterButton
              title="This Week"
              value="week"
              type="earning"
              activeFilter={earningFilter}
              onPress={() => setEarningFilter("week")}
            />
            <FilterButton
              title="This Month"
              value="month"
              type="earning"
              activeFilter={earningFilter}
              onPress={() => setEarningFilter("month")}
            />
          </ScrollView>
          <FlatList
            data={mockHistoryData.filter((item) => item.status === "Completed")}
            renderItem={renderHistoryItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="file-tray-outline"
                  size={60}
                  color={colors.gray}
                />
                <Text style={styles.emptyText}>No earnings found</Text>
              </View>
            }
            scrollEnabled={false} // Disable scrolling for nested FlatList
          />
        </View>

        {/* Section 4: Recurring Clients */}
        {/* Section 4: Recurring Clients */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recurring Clients</Text>
          <FlatList
            horizontal
            data={recurringClientsMock}
            renderItem={renderRecurringClient}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.clientsContainer}
            showsHorizontalScrollIndicator={false} // Disable scrollbar for better UI
          />
        </View>
      </LinearGradient>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingTop: 50, // Add padding to avoid notification bar
    paddingHorizontal: 16,
  },
  searchSection: {
    marginBottom: 20,
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  filterContainer: {
    marginBottom: 10,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: "#f0f0f0",
  },
  activeFilter: {
    backgroundColor: "#6a11cb",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  activeFilterText: {
    color: "#fff",
  },
  historyItem: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  clientText: {
    fontSize: 14,
    color: colors.darkGray,
    marginVertical: 4,
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateText: {
    fontSize: 12,
    color: colors.gray,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  detailsContainer: {
    marginTop: 10,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    marginLeft: 4,
  },
  clientCard: {
    padding: 16,
    borderRadius: 10,
    marginRight: 10,
    width: 150,
  },
  clientName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.white,
  },
  clientStats: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  clientRating: {
    fontSize: 14,
    color: colors.white,
    marginLeft: 4,
  },
  clientBookings: {
    fontSize: 12,
    color: colors.white,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 16,
    color: colors.gray,
    marginTop: 10,
  },
  exportButton: {
    marginVertical: 20,
  },
  exportGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 10,
  },
  exportText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.white,
    marginRight: 10,
  },
});

export default HistoryScreen;

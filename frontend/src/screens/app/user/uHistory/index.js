import React, { useState } from "react";
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../../../utils/colors";
import Header from "../../../../components/HomeHeader";
import styles from "./styles";
const mockHistoryData = {
  tasks: [
    {
      id: "1",
      type: "completed",
      title: "Deep Cleaning",
      date: "2023-03-15",
      provider: "Rita Rijal ",
      price: "Rs.2500",
      rating: 4.8,
    },
    {
      id: "2",
      type: "ongoing",
      title: "Plumbing Repair",
      date: "2023-03-20",
      provider: "Ram Bhatta",
      price: "Rs.1500",
      status: "In Progress",
    },
    {
      id: "3",
      type: "cancelled",
      title: "Electrician",
      date: "2023-03-18",
      provider: "Hari Joshi",
      price: "Rs.2000",
    },
  ],
  transactions: [
    {
      id: "t1",
      type: "payment",
      amount: "Rs.2500",
      date: "2023-03-15",
      method: "Credit Card",
    },
    {
      id: "t2",
      type: "refund",
      amount: "Rs.500",
      date: "2023-03-17",
      method: "Wallet",
    },
  ],
};

const UHistory = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate API call with timeout
    setTimeout(() => {
      // In real app, you would fetch new data here
      setRefreshing(false);
    }, 2000);
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return colors.success;
      case "ongoing":
        return colors.warning;
      case "cancelled":
        return colors.error;
      default:
        return colors.text;
    }
  };

  const filteredTasks =
    selectedFilter === "all"
      ? mockHistoryData.tasks
      : mockHistoryData.tasks.filter((task) => task.type === selectedFilter);

  // Apply search filter
  const searchFilteredTasks = filteredTasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const searchFilteredTransactions = mockHistoryData.transactions.filter(
    (transaction) =>
      transaction.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.amount.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sections = [
    {
      title: "Tasks",
      data: searchFilteredTasks,
    },
    {
      title: "Transactions",
      data: searchFilteredTransactions,
    },
  ];

  const renderItem = ({ item, section }) => {
    switch (section.title) {
      case "Tasks":
        return (
          <TouchableOpacity style={styles.itemContainer}>
            <View style={styles.itemHeader}>
              <Text
                style={[
                  styles.statusText,
                  { color: getStatusColor(item.type) },
                ]}
              >
                {item.type.toUpperCase()}
              </Text>
              <Text style={styles.dateText}>{item.date}</Text>
            </View>
            <Text style={styles.titleText}>{item.title}</Text>
            {item.provider && (
              <View style={styles.providerContainer}>
                <Ionicons name="person" size={16} color={colors.text} />
                <Text style={styles.providerText}>{item.provider}</Text>
              </View>
            )}
            <View style={styles.priceContainer}>
              <Text style={styles.priceText}>{item.price}</Text>
              {item.rating && (
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color={colors.accent} />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        );
      case "Transactions":
        return (
          <TouchableOpacity style={styles.itemContainer}>
            <View style={styles.transactionHeader}>
              <MaterialIcons
                name={item.type === "payment" ? "payment" : "money-off"}
                size={24}
                color={colors.primary}
              />
              <Text style={styles.transactionAmount}>{item.amount}</Text>
            </View>
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionMethod}>{item.method}</Text>
              <Text style={styles.dateText}>{item.date}</Text>
            </View>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="History"
        showSearch={true}
        onSearch={(query) => setSearchQuery(query)}
        keyword={searchQuery}
        placeholder="Search for history"
      />

      <View style={styles.header}>
        <View style={styles.filterContainer}>
          {["all", "completed", "ongoing", "cancelled"].map((filter) => (
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
          ))}
        </View>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />
    </View>
  );
};

export default UHistory;

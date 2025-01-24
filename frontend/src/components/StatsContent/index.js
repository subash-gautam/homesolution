import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Reusable Card Component
const Card = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

// Reusable Section Header Component
const SectionHeader = ({ title, onPress }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {onPress && (
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.seeAll}>See All</Text>
      </TouchableOpacity>
    )}
  </View>
);

// Quick Stats Component
const QuickStats = ({ stats }) => (
  <Card>
    <SectionHeader title="Quick Stats" />
    <View style={styles.statsContainer}>
      {stats.map((stat, index) => (
        <View key={index} style={styles.statItem}>
          <Text style={styles.statValue}>{stat.value}</Text>
          <Text style={styles.statLabel}>{stat.label}</Text>
        </View>
      ))}
    </View>
  </Card>
);

// Earnings Overview Component
const EarningsOverview = ({ earnings, onPress }) => (
  <Card>
    <SectionHeader title="Earnings Overview" onPress={onPress} />
    <View style={styles.earningsContainer}>
      <View style={styles.earningItem}>
        <Text style={styles.earningValue}>Rs.{earnings.today}</Text>
        <Text style={styles.earningLabel}>Today</Text>
      </View>
      <View style={styles.earningItem}>
        <Text style={styles.earningValue}>Rs.{earnings.weekly}</Text>
        <Text style={styles.earningLabel}>This Week</Text>
      </View>
      <View style={styles.earningItem}>
        <Text style={styles.earningValue}>Rs.{earnings.monthly}</Text>
        <Text style={styles.earningLabel}>This Month</Text>
      </View>
    </View>
  </Card>
);

// StatsComponent Component
const StatsComponent = ({ stats, earnings, onJobPress }) => {
  return (
    <View>
      <QuickStats stats={stats} />

      <EarningsOverview earnings={earnings} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  seeAll: {
    color: "#007AFF",
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  jobItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 12,
  },
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  jobPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  jobTime: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  jobLocation: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  earningsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  earningItem: {
    alignItems: "center",
  },
  earningValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
  },
  earningLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
});

export default StatsComponent;

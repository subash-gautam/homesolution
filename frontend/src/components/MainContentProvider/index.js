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

// Upcoming Jobs Component
const UpcomingJobs = ({ jobs, onJobPress }) => (
  <Card>
    <SectionHeader title="Upcoming Jobs" onPress={() => onJobPress("all")} />
    {jobs.map((job, index) => (
      <TouchableOpacity
        key={index}
        style={styles.jobItem}
        onPress={() => onJobPress(job.id)}
      >
        <View style={styles.jobHeader}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.jobPrice}>Rs. {job.price}</Text>
        </View>
        <Text style={styles.jobTime}>{job.datetime}</Text>
        <Text style={styles.jobLocation}>{job.location}</Text>
      </TouchableOpacity>
    ))}
  </Card>
);

// MainContent Component
const MainContent = ({ jobs, onJobPress, onSeeAll }) => {
  return (
    <View>
      <UpcomingJobs jobs={jobs} onJobPress={onJobPress} />
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

export default MainContent;

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  TextInput,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../../../../components/HomeHeader";
import { colors } from "../../../../utils/colors";

const Phome = ({ navigation }) => {
  const [availability, setAvailability] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Sample data states
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "Plumbing Repair",
      price: "1500",
      datetime: "Today, 2:00 PM",
      location: "Lakeside, Pokhara",
      status: "pending",
      duration: "2-3 hrs",
    },
    {
      id: 2,
      title: "Pipe Fixing",
      price: "2000",
      datetime: "Tomorrow, 10:00 AM",
      location: "Bagar, Pokhara",
      status: "accepted",
      duration: "4-5 hrs",
    },
  ]);

  const stats = [
    { label: "Total Jobs", value: "125", icon: "briefcase" },
    { label: "Rating", value: "4.8", icon: "star" },
    { label: "Completed", value: "95%", icon: "checkmark-done" },
  ];

  const handleJobAction = (jobId, action) => {
    const updatedJobs = jobs.map((job) => {
      if (job.id === jobId) {
        return { ...job, status: action };
      }
      return job;
    });
    setJobs(updatedJobs);
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

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => setRefreshing(false), 1000);
  };

  const renderJobItem = ({ item }) => (
    <LinearGradient
      colors={["#ffffff", "#f5f5f5"]}
      style={styles.jobCard}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.jobHeader}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        <Text style={styles.jobStatus(item.status)}>
          {item.status.toUpperCase()}
        </Text>
      </View>

      <View style={styles.jobDetails}>
        <Ionicons name="time" size={16} color={colors.text} />
        <Text style={styles.jobText}>{item.datetime}</Text>

        <Ionicons
          name="location"
          size={16}
          color={colors.text}
          style={styles.iconSpacing}
        />
        <Text style={styles.jobText}>{item.location}</Text>
      </View>

      <View style={styles.jobFooter}>
        <Text style={styles.jobPrice}>Rs. {item.price}</Text>

        {item.status === "pending" && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.button, styles.declineButton]}
              onPress={() => handleJobAction(item.id, "declined")}
            >
              <Text style={styles.buttonText}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.acceptButton]}
              onPress={() => handleJobAction(item.id, "accepted")}
            >
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
          </View>
        )}

        {item.status === "accepted" && (
          <TouchableOpacity
            style={[styles.button, styles.completeButton]}
            onPress={() => handleJobAction(item.id, "completed")}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Mark Complete</Text>
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );

  // Filter jobs based on search query
  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <LinearGradient
      colors={["#f5f7fa", "#c3cfe2"]}
      style={styles.gradientContainer}
    >
      <Header
        title="Provider Dashboard"
        showSearch={false}
        showNotification={true}
        onNotificationPress={handleNotificationPress}
        showProfile={true}
        onProfilePress={handleProfilePress}
      />

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

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <LinearGradient
              key={index}
              colors={["#ffffff", "#f0f0f0"]}
              style={styles.statCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name={stat.icon} size={24} color={colors.primary} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </LinearGradient>
          ))}
        </View>

        {/* Job List Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Jobs</Text>
          <TouchableOpacity onPress={handleSeeAll}>
            <Text style={styles.seeAllText}>See All →</Text>
          </TouchableOpacity>
        </View>

        {/* Jobs List */}
        <FlatList
          data={filteredJobs} // Show filtered jobs based on search query
          renderItem={renderJobItem}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          ListEmptyComponent={
            <Text style={styles.noJobsText}>No jobs found</Text>
          }
        />

        {/* Quick Navigation */}
        <View style={styles.quickNav}>
          <LinearGradient
            colors={["#ffffff", "#f0f0f0"]}
            style={styles.navCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigation.navigate("Schedule")}
            >
              <MaterialIcons name="schedule" size={28} color={colors.primary} />
              <Text style={styles.navText}>Schedule</Text>
            </TouchableOpacity>
          </LinearGradient>

          <LinearGradient
            colors={["#ffffff", "#f0f0f0"]}
            style={styles.navCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigation.navigate("Earnings")}
            >
              <Ionicons name="wallet" size={28} color={colors.success} />
              <Text style={styles.navText}>Earnings</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

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
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  jobStatus: (status) => ({
    color:
      status === "pending"
        ? colors.warning
        : status === "accepted"
        ? colors.success
        : colors.error,
    fontWeight: "600",
  }),
  jobDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  jobText: {
    marginLeft: 4,
    marginRight: 16,
    color: colors.text,
  },
  iconSpacing: {
    marginLeft: 12,
  },
  jobFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  jobPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.success,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
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
  },
  buttonText: {
    color: colors.white,
    fontWeight: "500",
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
});

export default Phome;

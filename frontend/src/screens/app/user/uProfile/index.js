import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ProfileHeader from "../../../../components/ProfileHeader";

const Uprofile = () => {
  // Simulate signed-in user data
  const user = {
    name: "Hari Joshi",
    designation: "Plumber",
    image: require("../../../../assets/profile.png"), // Replace with the correct image path
  };

  // State for pull-to-refresh
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a refresh action (e.g., API call)
    setTimeout(() => {
      setRefreshing(false);
    }, 2000); // Simulate 2 seconds refresh
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="arrow-back" size={24} color="#3B5998" />
          </TouchableOpacity>
          <Text style={styles.headerText}>My Profile</Text>
        </View>

        {/* Reusable Profile Section */}
        <ProfileHeader
          name={user.name}
          designation={user.designation}
          image={user.image}
        />

        {/* Menu Options */}
        <View style={styles.menu}>
          <MenuItem icon="document-text" text="Personal Data" />
          <MenuItem icon="settings" text="Settings" />

          <MenuItem icon="document-lock" text="Privacy Policy" />
          <MenuItem icon="help-circle" text="Help & Support" />
          <MenuItem icon="document-text" text="Terms & Condition" />
          <MenuItem icon="information-circle" text="About App" />

          <MenuItem icon="log-out" text="LogOut" />
        </View>
      </ScrollView>
    </View>
  );
};

const MenuItem = ({ icon, text }) => (
  <TouchableOpacity style={styles.menuItem}>
    <Ionicons name={icon} size={20} color="#333" />
    <Text style={styles.menuText}>{text}</Text>
    <Ionicons name="chevron-forward" size={20} color="#C4C4C4" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 90,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  headerText: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  menu: {
    marginTop: 30,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F4F4F4",
  },
  menuText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 15,
    flex: 1,
  },
});

export default Uprofile;

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import ProfileHeader from "../../../../components/ProfileHeader";

const Pprofile = () => {
  const user = {
    name: "Ram Nath",
    designation: "Electrician",
    image: require("../../../../assets/profile.png"),
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  return (
    <LinearGradient
      colors={["#6B46C1", "#4299E1"]}
      style={styles.gradientContainer}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#fff"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerText}>My Profile</Text>
        </View>

        {/* Profile Section */}
        <LinearGradient
          colors={["rgba(255,255,255,0.9)", "rgba(245,245,255,0.9)"]}
          style={styles.profileCard}
        >
          <ProfileHeader
            name={user.name}
            designation={user.designation}
            image={user.image}
          />
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>4.9</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>127</Text>
              <Text style={styles.statLabel}>Jobs</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>5★</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Menu Options */}
        <View style={styles.menu}>
          {[
            { icon: "document-text", text: "Personal Data" },
            { icon: "settings", text: "Settings" },
            { icon: "grid", text: "Dashboard" },
            { icon: "card", text: "Billing Details" },
            { icon: "document-lock", text: "Privacy Policy" },
            { icon: "help-circle", text: "Help & Support" },
            { icon: "document-text", text: "Terms & Condition" },
            { icon: "information-circle", text: "About App" },
            { icon: "star", text: "My Reviews" },
            { icon: "log-out", text: "LogOut" },
          ].map((item, index) => (
            <LinearGradient
              key={index}
              colors={["rgba(255,255,255,0.95)", "rgba(245,245,255,0.95)"]}
              style={styles.menuItem}
            >
              <TouchableOpacity style={styles.menuButton}>
                <Ionicons name={item.icon} size={22} color="#6B46C1" />
                <Text style={styles.menuText}>{item.text}</Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="rgba(107,70,193,0.5)"
                />
              </TouchableOpacity>
            </LinearGradient>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
  },
  backButton: {
    padding: 8,
  },
  headerText: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: "white",
    marginRight: 32,
  },
  profileCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D3748",
  },
  statLabel: {
    fontSize: 14,
    color: "#718096",
    marginTop: 4,
  },
  menu: {
    paddingHorizontal: 15,
  },
  menuItem: {
    borderRadius: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  menuButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
  },
  menuText: {
    fontSize: 16,
    color: "#2D3748",
    marginLeft: 15,
    flex: 1,
    fontWeight: "500",
  },
});

export default Pprofile;

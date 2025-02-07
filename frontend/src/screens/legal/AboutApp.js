import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // Import from react-native-safe-area-context
import { Ionicons } from "@expo/vector-icons"; // For the back arrow icon

const AboutApp = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Home Solution</Text>
      </View>
      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Welcome to Home Solution</Text>

        <Text style={styles.paragraph}>
          Home Solution is a one-stop platform connecting customers with skilled
          service providers for home maintenance, repairs, and more. Whether you
          need a plumber, electrician, cleaner, or handyman, our app makes it
          easy to find verified professionals near you. With a user-friendly
          interface, Home Solution allows customers to browse services, check
          provider ratings, schedule appointments, and make secure payments.
          Service providers can showcase their skills, get bookings, and grow
          their business.
        </Text>

        <Text style={styles.paragraph}>
          Customers can easily find professionals, book appointments, and make
          secure payments. Service providers can showcase their skills and
          receive bookings.
        </Text>

        <Text style={styles.subtitle}>Our Mission:</Text>
        <Text style={styles.paragraph}>
          We aim to simplify home services by offering a seamless, trustworthy,
          and efficient platform for both customers and service providers. We
          prioritize convenience, reliability, and safety, ensuring all
          professionals undergo verification before listing their services.
        </Text>

        <Text style={styles.subtitle}>Why Choose Us?</Text>
        <View style={styles.listContainer}>
          <Text style={styles.listItem}>✓ Verified Professionals</Text>
          <Text style={styles.listItem}>✓ Easy Bookings</Text>
          <Text style={styles.listItem}>✓ Secure Payments</Text>
          <Text style={styles.listItem}>✓ Hassle-free Service</Text>
        </View>

        <Text style={styles.paragraph}>
          Join Home Solution today and experience hassle-free home services at
          your fingertips!
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9f9", // Light background for contrast
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff", // Header background
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
    marginTop: 15,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24, // Improved readability
    marginBottom: 15,
  },
  listContainer: {
    marginLeft: 10,
    marginBottom: 20,
  },
  listItem: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
});

export default AboutApp;

import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const PrivacyPolicy = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.title}>Privacy Policy</Text>

        {/* Introduction */}
        <Text style={styles.paragraph}>
          Your privacy is important to us. This policy explains how Home
          Solution collects, uses, and protects your information.
        </Text>

        {/* Privacy Terms */}
        <View style={styles.termsContainer}>
          <Text style={styles.termItem}>
            1. <Text style={styles.boldText}>Data Collection:</Text> We collect
            personal details like name, contact, and preferences.
          </Text>
          <Text style={styles.termItem}>
            2. <Text style={styles.boldText}>Usage:</Text> Data is used to
            connect customers with providers and improve services.
          </Text>
          <Text style={styles.termItem}>
            3. <Text style={styles.boldText}>No Data Selling:</Text> We do not
            sell or rent user information.
          </Text>
          <Text style={styles.termItem}>
            4. <Text style={styles.boldText}>Security:</Text> Security measures
            protect your data, but no system is 100% secure.
          </Text>
          <Text style={styles.termItem}>
            5. <Text style={styles.boldText}>Cookies & Analytics:</Text> We use
            cookies and analytics for a better experience.
          </Text>
          <Text style={styles.termItem}>
            6. <Text style={styles.boldText}>Third-Party Links:</Text> External
            links in the app have separate privacy policies.
          </Text>
          <Text style={styles.termItem}>
            7. <Text style={styles.boldText}>Policy Updates:</Text> Changes will
            be notified in the app.
          </Text>
        </View>

        {/* Contact Section */}
        <Text style={styles.contact}>
          For queries, contact us at support@example.com.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
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
  paragraph: {
    fontSize: 14,
    color: "#444",
    lineHeight: 22,
    marginBottom: 20,
  },
  termsContainer: {
    marginBottom: 20,
  },
  termItem: {
    fontSize: 14,
    color: "#444",
    lineHeight: 22,
    marginBottom: 12,
  },
  boldText: {
    fontWeight: "bold",
    color: "#333",
  },
  contact: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007BFF",
    textAlign: "center",
    marginTop: 20,
  },
});

export default PrivacyPolicy;

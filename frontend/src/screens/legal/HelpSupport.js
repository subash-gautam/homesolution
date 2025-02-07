import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const HelpSupport = ({ navigation }) => {
  const openEmail = () => {
    Linking.openURL("mailto:support@example.com");
  };

  const openPhone = () => {
    Linking.openURL("tel:+9779869404451");
  };

  const openWhatsApp = () => {
    Linking.openURL("https://wa.me/9765645686");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* Header with Back Arrow */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Help & Support</Text>

        <Text style={styles.subtitle}>Common Issues & FAQs</Text>
        <View style={styles.faqContainer}>
          <Text style={styles.faqItem}>
            • How do I book a service?{"\n"}Browse, select a provider, and
            confirm your booking.
          </Text>
          <Text style={styles.faqItem}>
            • How do I cancel a booking?{"\n"}Go to "My Bookings" and follow the
            cancellation steps.
          </Text>
          <Text style={styles.faqItem}>
            • What if a provider doesn’t show up?{"\n"}Contact the provider or
            report in the Support section.
          </Text>
          <Text style={styles.faqItem}>
            • Is my payment secure?{"\n"}Yes, we use encrypted payment gateways.
          </Text>
        </View>

        <Text style={styles.subtitle}>Contact Support</Text>
        <View style={styles.contactContainer}>
          <Text style={styles.contactLabel}>📧 Email: </Text>
          <TouchableOpacity onPress={openEmail}>
            <Text style={styles.linkText}>support@example.com</Text>
          </TouchableOpacity>

          <Text style={styles.contactLabel}>📞 Phone: </Text>
          <TouchableOpacity onPress={openPhone}>
            <Text style={styles.linkText}>+977-9869404451</Text>
          </TouchableOpacity>

          <Text style={styles.contactLabel}>💬 WhatsApp: </Text>
          <TouchableOpacity onPress={openWhatsApp}>
            <Text style={styles.linkText}>9765645686</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>Report an Issue</Text>
        <Text style={styles.paragraph}>
          If you experience an issue, report it through the Help Center. We’re
          here to assist you!
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
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
    marginTop: 15,
    marginBottom: 10,
  },
  faqContainer: {
    marginBottom: 20,
  },
  faqItem: {
    fontSize: 14,
    color: "#444",
    lineHeight: 22,
    marginBottom: 12,
  },
  contactContainer: {
    marginBottom: 20,
  },
  contactLabel: {
    fontSize: 14,
    color: "#444",
    marginTop: 5,
  },
  linkText: {
    fontSize: 14,
    color: "#007BFF",
    textDecorationLine: "underline",
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    color: "#444",
    lineHeight: 22,
  },
});

export default HelpSupport;

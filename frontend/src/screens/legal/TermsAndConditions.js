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

const TermsAndConditions = ({ navigation }) => {
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
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.title}>Terms & Conditions</Text>

        {/* Introduction */}
        <Text style={styles.paragraph}>
          Welcome to Home Solution! By using our app, you agree to the following
          terms:
        </Text>

        {/* Terms List */}
        <View style={styles.termsContainer}>
          <Text style={styles.termItem}>
            1. <Text style={styles.boldText}>User Accounts:</Text> You must
            provide accurate details during signup.
          </Text>
          <Text style={styles.termItem}>
            2. <Text style={styles.boldText}>Service Usage:</Text> We connect
            users with service providers but do not guarantee service quality.
          </Text>
          <Text style={styles.termItem}>
            3. <Text style={styles.boldText}>Payments:</Text> Transactions are
            handled between the customer and provider.
          </Text>
          <Text style={styles.termItem}>
            4. <Text style={styles.boldText}>Cancellations & Refunds:</Text>{" "}
            Depend on provider policies.
          </Text>
          <Text style={styles.termItem}>
            5. <Text style={styles.boldText}>Conduct:</Text> Fraudulent
            activities will lead to suspension.
          </Text>
          <Text style={styles.termItem}>
            6. <Text style={styles.boldText}>Liability:</Text> We are not
            responsible for damages or service failures.
          </Text>
          <Text style={styles.termItem}>
            7. <Text style={styles.boldText}>Changes:</Text> Terms may be
            updated periodically.
          </Text>
        </View>

        {/* Acceptance Statement */}
        <Text style={styles.acceptanceStatement}>
          By using Home Solution, you accept these terms.
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
  acceptanceStatement: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginTop: 20,
  },
});

export default TermsAndConditions;

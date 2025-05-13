import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../utils/colors";
import backend from "../../utils/api";

const ProviderProfileScreen = ({ route, navigation }) => {
  const { providerId, service: selectedService } = route.params;
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const providerResponse = await fetch(
          `${backend.backendUrl}/api/providers/${providerId}`,
          { signal: abortController.signal }
        );

        if (!providerResponse.ok) {
          throw new Error(`HTTP error! Status: ${providerResponse.status}`);
        }

        const providerData = await providerResponse.json();

        if (!abortController.signal.aborted) {
          setProvider({
            ...providerData,
            ratePerHr: Number(providerData.ratePerHr) || 0,
          });
          setLoading(false);
        }
      } catch (err) {
        if (!abortController.signal.aborted) {
          setError(err.message);
          console.error("Fetch error:", err);
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => abortController.abort();
  }, [providerId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading provider...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            setError(null);
          }}
        >
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!provider) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Provider not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>{provider.name}'s Profile</Text>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.profileSection}>
            <Image
              source={
                provider.profile
                  ? { uri: `${backend.backendUrl}/uploads/${provider.profile}` }
                  : require("../../assets/profile.png")
              }
              style={styles.profileImage}
            />

            <Text style={styles.providerName}>{provider.name}</Text>
            <Text style={styles.bioText}>{provider.bio}</Text>

            <View style={styles.infoRow}>
              <Ionicons name="cash-outline" size={20} color={colors.grey} />
              <Text style={styles.infoText}>
                Rs. {provider.ratePerHr} per hour
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color={colors.grey} />
              <Text style={styles.infoText}>{provider.address}</Text>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={styles.contactInfo}>
              {provider.phone ? (
                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel:${provider.phone}`)}
                >
                  <View style={styles.contactRow}>
                    <Ionicons
                      name="call-outline"
                      size={20}
                      color={colors.primary}
                    />
                    <Text style={styles.contactText}>{provider.phone}</Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <View style={styles.contactRow}>
                  <Ionicons
                    name="call-outline"
                    size={20}
                    color={colors.primary}
                  />
                  <Text style={styles.contactText}>Not available</Text>
                </View>
              )}

              {provider.email ? (
                <TouchableOpacity
                  onPress={() => Linking.openURL(`mailto:${provider.email}`)}
                >
                  <View style={styles.contactRow}>
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color={colors.primary}
                    />
                    <Text style={styles.contactText}>{provider.email}</Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <View style={styles.contactRow}>
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={colors.primary}
                  />
                  <Text style={styles.contactText}>Not provided</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.bookNowButton}
            onPress={() =>
              navigation.navigate("BookService", {
                service: selectedService,
                provider: provider,
              })
            }
          >
            <Text style={styles.bookNowText}>Book This Provider</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: colors.danger,
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 16,
    color: colors.text,
  },
  content: {
    flex: 1,
    marginBottom: 70,
  },
  profileSection: {
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  providerName: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  bioText: {
    fontSize: 14,
    color: colors.grey,
    textAlign: "center",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    width: "100%",
    paddingHorizontal: 20,
  },
  infoText: {
    marginLeft: 12,
    fontSize: 14,
    color: colors.text,
    flexShrink: 1,
  },
  sectionContainer: {
    backgroundColor: "#fff",
    padding: 16,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: colors.text,
  },
  contactInfo: {
    marginTop: 4,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  contactText: {
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bookNowButton: {
    backgroundColor: colors.accent,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 8,
  },
  bookNowText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    marginRight: 8,
  },
  retryButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
  retryText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loadingText: {
    marginTop: 10,
    color: colors.grey,
    fontSize: 14,
  },
});

export default ProviderProfileScreen;

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../../utils/colors";
import backend from "../../../../utils/api";

const ServiceDetailScreen = ({ route, navigation }) => {
  const { service } = route.params;
  const [providers, setProviders] = React.useState([]);
  const [selectedProvider, setSelectedProvider] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch(
          `${backend.backendUrl}/api/providerServices/providers/${service.id}`
        );

        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        const formattedProviders = data.map((item) => ({
          id: item.provider.id,
          name: item.provider.name,
          bio: item.provider.bio,
          profile: item.provider.profile,
          phone: item.provider.phone,
          email: item.provider.email,
          ratePerHr: item.provider.ratePerHr,
          address: item.provider.address,
          services: item.provider.services, // Include services if needed
        }));

        setProviders(formattedProviders);
        setSelectedProvider(formattedProviders[0] || null);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching providers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [service.id]);

  const handleBookNow = (provider = selectedProvider) => {
    if (!provider) return;
    navigation.navigate("BookService", { service, provider });
  };

  const handleViewProfile = (provider) => {
    navigation.navigate("ProviderProfileScreen", {
      providerId: provider.id,
      service: service,
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>Loading providers...</Text>
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
            setError(null);
            setLoading(true);
            fetchProviders();
          }}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
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
          <Text style={styles.title}>{service.title}</Text>
        </View>

        <ScrollView style={styles.content}>
          <Image source={service.image} style={styles.serviceImage} />

          <View style={styles.detailsContainer}>
            <Text style={styles.serviceTitle}>{service.title}</Text>
            <Text style={styles.description}>{service.description}</Text>

            <View style={styles.infoRow}>
              <Ionicons name="time" size={20} color={colors.grey} />
              <Text style={styles.infoText}>{service.duration}</Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="pricetag" size={20} color={colors.accent} />
              <Text style={styles.price}>{service.price}</Text>
            </View>
          </View>

          <View style={styles.providersSection}>
            <Text style={styles.sectionTitle}>Available Providers</Text>

            {providers.length > 0 ? (
              providers.map((provider) => (
                <View key={provider.id} style={styles.providerCard}>
                  <Image
                    source={
                      provider.profile
                        ? { uri: provider.profile }
                        : require("../../../../assets/profile.png")
                    }
                    style={styles.providerImage}
                  />

                  <View style={styles.providerDetails}>
                    <Text style={styles.providerName}>{provider.name}</Text>
                    <Text style={styles.providerBio}>{provider.bio}</Text>
                  </View>

                  <View style={styles.buttonGroup}>
                    <TouchableOpacity
                      style={styles.viewProfileButton}
                      onPress={() => handleViewProfile(provider)}
                    >
                      <Text style={styles.viewProfileText}>View Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.contactButton}
                      onPress={() => handleBookNow(provider)}
                    >
                      <Text style={styles.contactText}>Book</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noProviders}>No providers available</Text>
            )}
          </View>
        </ScrollView>

        {providers.length > 0 && (
          <View style={styles.bottomContainer}>
            <TouchableOpacity
              style={styles.bookNowButton}
              onPress={() => handleBookNow()}
            >
              <Text style={styles.bookNowText}>Book Now</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
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
    marginBottom: 70, // Space for the bottom button
  },
  serviceImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  detailsContainer: {
    backgroundColor: "#fff",
    padding: 16,
    margin: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  serviceTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: colors.grey,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 16,
    color: colors.text,
  },
  price: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: "600",
    color: colors.accent,
  },
  providersSection: {
    padding: 16,
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12,
    marginTop: 0,
    marginBottom: 32,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: colors.text,
  },
  providerCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#eee",
  },
  providerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    alignSelf: "center",
  },
  providerDetails: {
    marginVertical: 8,
  },
  providerName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    textAlign: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  rating: {
    marginLeft: 4,
    color: colors.accent,
    fontWeight: "bold",
  },
  reviewCount: {
    color: colors.grey,
    fontSize: 12,
    marginLeft: 4,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  viewProfileButton: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    marginRight: 8,
    alignItems: "center",
  },
  viewProfileText: {
    color: colors.primary,
    fontWeight: "600",
  },
  contactButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: "center",
  },
  contactText: {
    color: "#fff",
    fontWeight: "600",
  },
  noProviders: {
    textAlign: "center",
    color: colors.grey,
    fontSize: 16,
    paddingVertical: 16,
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

  providerBio: {
    fontSize: 14,
    color: colors.grey,
    marginTop: 8,
    textAlign: "center",
  },
});
export default ServiceDetailScreen;

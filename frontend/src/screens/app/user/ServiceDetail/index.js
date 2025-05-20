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
  Dimensions,
  Image as RNImage,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../../utils/colors";
import backend from "../../../../utils/api";

const ServiceDetailScreen = ({ route, navigation }) => {
  const { service } = route.params;
  const { width: screenWidth } = Dimensions.get("window");

  const [imageHeight, setImageHeight] = React.useState(200);
  const [providers, setProviders] = React.useState([]);
  const [selectedProvider, setSelectedProvider] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [showFullDescription, setShowFullDescription] = React.useState(false);

  const normalizedService = React.useMemo(() => {
    return {
      ...service,
      title: service.title || service.name || "Unnamed Service",
      description: service.description || "",
      price:
        service.price ||
        service.minimumCharge ||
        service.minimum_charge ||
        "N/A",
    };
  }, [service]);

  React.useEffect(() => {
    if (service?.image) {
      RNImage.getSize(
        service.image,
        (width, height) => {
          const ratio = height / width;
          setImageHeight(screenWidth * ratio);
        },
        (error) => {
          console.log("Image getSize error:", error);
          setImageHeight(250); // fallback
        }
      );
    }
  }, [service?.image]);

  const fetchProviders = React.useCallback(async () => {
    try {
      const response = await fetch(
        `${backend.backendUrl}/api/providerServices/providers/${service.id}`
      );

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();

      const formattedProviders = data
        .filter((item) => item.provider.verificationStatus === "verified")
        .map((item) => ({
          id: item.provider.id,
          name: item.provider.name,
          bio: item.provider.bio,
          profile: item.provider.profile,
          phone: item.provider.phone,
          email: item.provider.email,
          ratePerHr: item.provider.ratePerHr,
          address: item.provider.address,
          averageRating: item.provider.averageRating || 0,
        }));

      setProviders(formattedProviders);
      setSelectedProvider(null);
      setError(null);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching providers:", error);
    } finally {
      setLoading(false);
    }
  }, [service.id]);
  React.useEffect(() => {
    fetchProviders(); // Initial fetch

    const interval = setInterval(() => {
      fetchProviders();
    }, 5000); // 5 seconds

    return () => clearInterval(interval); // Cleanup
  }, [fetchProviders]);

  const handleBookNow = (provider = selectedProvider) => {
    if (!provider) {
      // Pass an empty provider object with a flag to indicate no selection
      return navigation.navigate("BookService", {
        service: normalizedService,
        provider: { id: null, name: "Select Provider" },
        isProviderNotSelected: true,
      });
    }

    // Pass the selected provider along with a flag
    navigation.navigate("BookService", {
      service: normalizedService,
      provider,
      isProviderNotSelected: false,
    });
  };

  const handleViewProfile = (provider) => {
    navigation.navigate("ProviderProfileScreen", {
      providerId: provider.id,
      service: normalizedService,
    });
  };

  const getServiceImageSource = () => {
    if (service?.image) {
      return { uri: service.image };
    }
    return require("../../../../assets/placeholder-image.png");
  };

  const getProviderImageSource = (profile) => {
    if (profile) {
      return { uri: `${backend.backendUrl}/uploads/${profile}` };
    }
    return require("../../../../assets/profile.png");
  };

  // Renders a star rating UI with filled, half-filled and empty stars
  const renderStarRating = (rating) => {
    const maxStars = 5;
    const starRating = rating || 0;

    const renderStars = () => {
      const stars = [];

      for (let i = 1; i <= maxStars; i++) {
        if (i <= Math.floor(starRating)) {
          // Full star
          stars.push(
            <Ionicons
              key={`star-${i}`}
              name="star"
              size={16}
              color="#FFD700"
              style={styles.starIcon}
            />
          );
        } else if (i === Math.ceil(starRating) && starRating % 1 !== 0) {
          // Half star
          stars.push(
            <Ionicons
              key={`star-${i}`}
              name="star-half"
              size={16}
              color="#FFD700"
              style={styles.starIcon}
            />
          );
        } else {
          // Empty star
          stars.push(
            <Ionicons
              key={`star-${i}`}
              name="star-outline"
              size={16}
              color="#FFD700"
              style={styles.starIcon}
            />
          );
        }
      }

      return stars;
    };

    return (
      <View style={styles.starRatingContainer}>
        {renderStars()}
        <Text style={styles.ratingText}>
          ({rating ? rating.toFixed(1) : "0.0"})
        </Text>
      </View>
    );
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
          <Text style={styles.title}>{normalizedService.title}</Text>
        </View>

        <ScrollView style={styles.content}>
          <Image
            source={getServiceImageSource()}
            style={{
              width: screenWidth,
              height: imageHeight,
              backgroundColor: "#eee",
            }}
            resizeMode="contain"
            onError={(e) => console.log("Image Error:", e.nativeEvent.error)}
          />

          <View style={styles.detailsContainer}>
            <Text style={styles.serviceTitle}>{normalizedService.title}</Text>
            <Text style={styles.description}>
              {showFullDescription || normalizedService.description.length <= 50
                ? normalizedService.description
                : `${normalizedService.description.slice(0, 50)}... `}
              {normalizedService.description.length > 50 && (
                <Text
                  style={styles.viewMoreText}
                  onPress={() => setShowFullDescription(!showFullDescription)}
                >
                  {showFullDescription ? " View Less" : " View More"}
                </Text>
              )}
            </Text>
            <View style={styles.infoRow}>
              <Ionicons name="time" size={20} color={colors.grey} />
              <Text style={styles.infoText}>Varies</Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="pricetag" size={20} color={colors.accent} />
              <Text style={styles.price}>
                Inspection charge: {normalizedService.price}
              </Text>
            </View>
            <Text style={styles.note}>
              *This is only the inspection charge. The actual work charge will
              be determined after the inspection. *
            </Text>
          </View>

          <View style={styles.providersSection}>
            <Text style={styles.sectionTitle}>Available Providers</Text>

            {providers.length > 0 ? (
              providers.map((provider) => (
                <View key={provider.id} style={styles.providerCard}>
                  <Image
                    source={getProviderImageSource(provider.profile)}
                    style={styles.providerImage}
                  />

                  <View style={styles.providerDetails}>
                    <Text style={styles.providerName}>{provider.name}</Text>
                    <Text style={styles.providerBio}>{provider.bio}</Text>
                    {renderStarRating(provider.averageRating)}
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
  viewMoreText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  note: {
    fontSize: 12,
    color: "gray",
    marginTop: 4,
    marginLeft: 24, // to align with text after the icon
    fontStyle: "italic",
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
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
    alignSelf: "center",
  },
  providerDetails: {
    marginVertical: 8,
    alignItems: "center",
  },
  providerName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  providerBio: {
    fontSize: 14,
    color: colors.grey,
    marginTop: 4,
    textAlign: "center",
  },
  starRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    justifyContent: "center",
  },
  starIcon: {
    marginHorizontal: 1,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: colors.accent,
    fontWeight: "600",
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: colors.text,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
  },
  retryText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default ServiceDetailScreen;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
  Alert,
} from "react-native";
import Button from "../../../../components/Button.js/Index";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  serviceItem: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 16,
  },
  serviceImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 16,
    marginBottom: 8,
    color: "#666",
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  providerItem: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 8,
  },
  providerName: {
    fontSize: 16,
    fontWeight: "500",
  },
  providerRating: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  noProvidersText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 16,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
  primaryButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
});

const ServiceDetailScreen = ({ route, navigation }) => {
  // Add default empty object for route.params
  const params = route?.params || {};
  const service = params.service || null;

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if service exists before fetching
    if (!service || !service.id) {
      setError("Service information is missing");
      setLoading(false);
      return;
    }

    const fetchProviders = async () => {
      try {
        const response = await fetch(
          `http://192.168.1.6:3000/api/providerServices/providers/${service.id}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProviders(data);
      } catch (error) {
        setError(error.message);
        Alert.alert(
          "Error",
          "Failed to fetch providers. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [service]);

  // Handle case where no service data is available
  if (!service) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No service information available</Text>
        <Button
          title="Go Back"
          onPress={() => navigation.goBack()}
          style={styles.primaryButton}
        />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Button
          title="Try Again"
          onPress={() => {
            setLoading(true);
            setError(null);
            // This will trigger the useEffect again
            navigation.replace("ServiceList", { service });
          }}
          style={styles.primaryButton}
        />
      </View>
    );
  }

  const handleBooking = () => {
    if (!providers.length) {
      Alert.alert("Error", "No providers available for booking");
      return;
    }
    navigation.navigate("BookService", { service, providers });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Service Details</Text>
      <View style={styles.serviceItem}>
        {service.service_image && (
          <Image
            source={{
              uri: `http://192.168.1.6:3000/uploads/${service.service_image}`,
            }}
            style={styles.serviceImage}
            defaultSource={require("../../../../assets/profile.png")}
          />
        )}
        <Text style={styles.serviceName}>
          {service.name || "Unnamed Service"}
        </Text>
        <Text style={styles.serviceDescription}>
          {service.description || "No description available"}
        </Text>
        <Text style={styles.servicePrice}>
          Minimum Charge: ${service.minimumCharge || "0"}
        </Text>
        <Text style={styles.servicePrice}>
          Avg Rate Per Hour: ${service.avgRatePerHr || "0"}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Providers</Text>
      {providers.length > 0 ? (
        <FlatList
          data={providers}
          keyExtractor={(item) =>
            item?.provider?.id
              ? item.provider.id.toString()
              : `provider-${Math.random()}`
          }
          renderItem={({ item }) => (
            <View style={styles.providerItem}>
              <Text style={styles.providerName}>
                {item?.provider?.name || "Unnamed Provider"}
              </Text>
              <Text style={styles.providerRating}>
                Rating: {item?.provider?.rating || "N/A"} ★
              </Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noProvidersText}>
          No providers available for this service
        </Text>
      )}

      {providers.length > 0 && (
        <Button
          title="Proceed to Booking"
          onPress={handleBooking}
          style={styles.primaryButton}
        />
      )}
    </View>
  );
};

export default ServiceDetailScreen;

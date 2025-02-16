import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import styles from "./styles";

const ServiceListScreen = ({ route, navigation }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("http://192.168.1.6:3000/api/services");
        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }
        const data = await response.json();
        setServices(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Render a separator between service items
  const renderSeparator = () => {
    return <View style={styles.separator} />;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>All Services</Text>
      <FlatList
        data={services}
        keyExtractor={(item) => (item?.id ? item.id.toString() : "defaultKey")}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ServiceProviders", { service: item })
            }
          >
            <View style={styles.serviceItem}>
              {item.service_image && (
                <Image
                  source={{
                    uri: `http://192.168.1.6:3000/uploads/${item.service_image}`,
                  }}
                  style={styles.serviceImage}
                  defaultSource={require("../../../../assets/profile.png")}
                />
              )}
              <Text style={styles.serviceName}>{item.name}</Text>
              <Text style={styles.serviceDescription}>{item.description}</Text>
              <Text style={styles.servicePrice}>
                Minimum Charge: ${item.minimumCharge}
              </Text>
              <Text style={styles.servicePrice}>
                Avg Rate Per Hour: ${item.avgRatePerHr}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={renderSeparator} // Add separator between items
      />
    </View>
  );
};

export default ServiceListScreen;

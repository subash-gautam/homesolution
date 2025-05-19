import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  Platform,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../../utils/colors";
import backend from "../../../../utils/api";
const CategoryScreen = ({ route, navigation }) => {
  const { category } = route.params;
  const [subCategories, setSubCategories] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [imageError, setImageError] = React.useState(false);
  const [expandedItems, setExpandedItems] = React.useState({});

  const fetchServices = async () => {
    try {
      const response = await fetch(`${backend.backendUrl}/api/services`);
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      const filtered = data.filter(
        (service) => service.categoryId === category.id
      );
      const processed = filtered.map((service) => ({
        id: service.id,
        title: service.name,
        description: service.description,
        duration: service.duration || "Varies",
        price: `Rs. ${service.minimumCharge} `,
        image: `${backend.backendUrl}/uploads/${service.service_image}`,
        avgRatePerHr: service.avgRatePerHr,
      }));
      setSubCategories(processed);
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load services. Check your connection.");
      setSubCategories([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchServices();
  }, [category]);

  const renderItem = ({ item }) => {
    const isExpanded = expandedItems[item.id];

    const toggleDescription = () => {
      setExpandedItems((prev) => ({
        ...prev,
        [item.id]: !prev[item.id],
      }));
    };

    const truncatedDescription =
      item.description.length > 75
        ? item.description.substring(0, 75) + "..."
        : item.description;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("ServiceDetail", { service: item })}
      >
        <Image
          source={
            imageError
              ? require("../../../../assets/placeholder-image.png")
              : { uri: item.image }
          }
          style={styles.image}
          resizeMode="cover"
          onError={() => setImageError(true)}
        />
        <View style={styles.details}>
          <Text style={styles.title}>{item.title}</Text>

          <View style={styles.descriptionRow}>
            <Text style={styles.description}>
              {isExpanded
                ? item.description
                : `${item.description.substring(0, 75)}... `}
              {item.description.length > 75 && (
                <Text style={styles.toggleText} onPress={toggleDescription}>
                  {isExpanded ? "View Less" : "View More"}
                </Text>
              )}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="time" size={16} color={colors.grey} />
            <Text style={styles.infoText}>{item.duration}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="pricetag" size={16} color={colors.accent} />
            <Text style={styles.price}>{item.price}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {category ? category.name : "Category"}
          </Text>
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.loadingText}>Loading services...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="warning" size={48} color={colors.danger} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={fetchServices}
            >
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading && !error && subCategories.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="alert-circle-outline"
              size={48}
              color={colors.grey}
            />
            <Text style={styles.emptyText}>
              No services found for this category
            </Text>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>Go back to home</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading && !error && subCategories.length > 0 && (
          <FlatList
            data={subCategories}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
          />
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
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 16,
    color: colors.text,
  },
  card: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12,
    flexDirection: "row",
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  descriptionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginTop: 4,
  },
  toggleText: {
    color: colors.primary,
    fontWeight: "600",
    marginLeft: 6,
  },

  image: {
    width: 120,
    height: 120,
  },
  details: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  description: {
    fontSize: 14,
    color: colors.grey,
    marginTop: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  infoText: {
    marginLeft: 8,
    color: colors.grey,
  },
  price: {
    marginLeft: 8,
    color: colors.accent,
    fontWeight: "600",
  },
  listContent: {
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: colors.grey,
    textAlign: "center",
    marginTop: 16,
  },
  backButton: {
    marginTop: 24,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: colors.grey,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.danger,
    textAlign: "center",
    marginVertical: 16,
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default CategoryScreen;

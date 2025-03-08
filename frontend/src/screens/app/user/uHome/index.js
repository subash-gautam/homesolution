import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  SafeAreaView,
  Image,
  ActivityIndicator,
  StatusBar,
  Platform,
  Dimensions,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../../../utils/colors";
import backend from "../../../../utils/api";
const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

const Uhome = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories from API
        const categoryResponse = await fetch(
          `${backend.backendUrl}/api/categories`
        );
        if (!categoryResponse.ok) throw new Error("Failed to fetch categories");
        const categoryData = await categoryResponse.json();

        // Format category images with full URL
        const formattedCategories = categoryData.map((category) => ({
          ...category,
          image: `${backend.backendUrl}/uploads/${category.image}`,
        }));
        setCategories(formattedCategories);

        // Fetch popular services
        const serviceResponse = await fetch(
          `${backend.backendUrl}/api/services/popular`
        );
        if (!serviceResponse.ok) throw new Error("Failed to fetch services");
        const serviceData = await serviceResponse.json();
        const formattedServices = serviceData.map((service) => ({
          ...service,
          image: service.service_image
            ? `${backend.backendUrl}/uploads/${service.service_image}`
            : null, // Handle missing images
        }));
        setServices(formattedServices);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderHeader = () => (
    <SafeAreaView style={styles.headerContainer}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search services..."
          placeholderTextColor={colors.grey}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => navigation.navigate("Notifications")}
        >
          <Ionicons name="notifications" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.categoryCard, { width: CARD_WIDTH }]}
      onPress={() => navigation.navigate("Category", { category: item })}
    >
      <View style={styles.categoryImageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.categoryImage}
          resizeMode="cover"
        />
      </View>
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderServiceItem = ({ item }) => (
    <TouchableOpacity
      style={styles.serviceCard}
      onPress={() => navigation.navigate("ServiceDetail", { service: item })}
    >
      <View style={styles.serviceImageContainer}>
        <Image
          source={item.image}
          style={styles.serviceImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.serviceDetails}>
        <Text style={styles.serviceTitle}>{item.title}</Text>
        <Text style={styles.servicePrice}>{item.price}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color={colors.accent} />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Categories Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categories</Text>
            {error && <Text style={styles.errorText}>{error}</Text>}
            {loading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <FlatList
                data={categories}
                renderItem={renderCategoryItem}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                contentContainerStyle={styles.categoryGrid}
                columnWrapperStyle={styles.columnWrapper}
                scrollEnabled={false}
              />
            )}
          </View>

          {/* Popular Services Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Services</Text>
            {loading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <FlatList
                data={services}
                renderItem={renderServiceItem}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d9d9d9",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 80,
  },
  headerContainer: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchBar: {
    flex: 1,
    marginRight: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    fontSize: 14,
  },
  notificationButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: colors.text,
  },
  categoryGrid: {
    justifyContent: "space-between",
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  categoryCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  categoryImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    marginBottom: 8,
    backgroundColor: "#f5f5f5",
  },
  categoryImage: {
    width: "100%",
    height: "100%",
  },
  categoryText: {
    fontSize: 14,
    color: colors.text,
    textAlign: "center",
    marginTop: 4,
  },
  serviceCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  serviceImageContainer: {
    width: "30%",
    aspectRatio: 1,
    overflow: "hidden",
  },
  serviceImage: {
    width: "100%",
    height: "100%",
  },
  serviceDetails: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  servicePrice: {
    fontSize: 14,
    color: colors.accent,
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  ratingText: {
    marginLeft: 4,
    color: colors.accent,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginVertical: 8,
  },
});

export default Uhome;

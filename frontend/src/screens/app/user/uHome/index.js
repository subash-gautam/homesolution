import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "react-native-vector-icons";
import { useNavigation } from "@react-navigation/native";
import HomeHeader from "../../../../components/HomeHeader";
import Button from "../../../../components/Button.js/Index.js";
import styles from "./styles.js";
import { colors } from "../../../../utils/colors";
import backend from "../../../../utils/api.js";

// Sub-services data (unchanged)
const subServices = {
  Cleaning: [
    { id: 1, title: "Regular Cleaning", price: "Rs.30/hr", rating: 4.7 },
    { id: 2, title: "Deep Cleaning", price: "Rs.50/hr", rating: 4.9 },
    { id: 3, title: "Window Cleaning", price: "Rs.40/hr", rating: 4.5 },
  ],
  Repairs: [
    { id: 4, title: "Furniture Repairs", price: "Rs.45/hr", rating: 4.6 },
    { id: 5, title: "Appliance Repairs", price: "Rs.60/hr", rating: 4.8 },
  ],
  Electricity: [
    { id: 6, title: "Wiring", price: "Rs.55/hr", rating: 4.7 },
    { id: 7, title: "Fixture Installation", price: "Rs.65/hr", rating: 4.8 },
  ],
  Painting: [
    { id: 8, title: "Wall Painting", price: "Rs.70/hr", rating: 4.6 },
    { id: 9, title: "Furniture Painting", price: "Rs.60/hr", rating: 4.5 },
  ],
  Plumbing: [
    { id: 10, title: "Pipe Repair", price: "Rs.45/hr", rating: 4.7 },
    { id: 11, title: "Faucet Installation", price: "Rs.50/hr", rating: 4.8 },
  ],
};

const Uhome = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [firstLogin, setFirstLogin] = useState(false);
  const [userName, setUserName] = useState("");
  const [categories, setCategories] = useState([]); // State for fetched categories
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch user data and check first login (unchanged)
  useEffect(() => {
    const fetchDataAndCheckFirstLogin = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          setUserName(parsedUserData.name || "User");
        }

        const hasLoggedInBefore = await AsyncStorage.getItem(
          "hasLoggedInBefore"
        );
        if (hasLoggedInBefore === null) {
          setFirstLogin(true);
          await AsyncStorage.setItem("hasLoggedInBefore", "true");
        } else {
          setFirstLogin(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataAndCheckFirstLogin();
  }, []);

  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${backend.backendUrl}/categories`);
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data); // Update state with fetched categories
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError(error.message); // Set error state
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchCategories();
  }, []);

  // Updated mock data with local images (unchanged)
  const allServices = [
    {
      id: 1,
      title: "Deep Cleaning",
      price: "Rs.50/hr",
      rating: 4.9,
      image: require("../../../../assets/cleaning.png"),
      description:
        "Comprehensive cleaning service including deep scrubbing of all surfaces",
      category: "Cleaning",
    },
    {
      id: 2,
      title: "Maintenance",
      price: "Rs.35/hr",
      image: require("../../../../assets/maintenance.jpg"),
      rating: 4.8,
      description: "Regular maintenance and checkup for home appliances",
      category: "Repairs",
    },
  ];

  // Navigation handlers (unchanged)
  const handleCategoryPress = (category) => {
    navigation.navigate("Category", {
      categoryName: category.name,
      subcategories: subServices[category.name] || [],
    });
  };

  const handleServicePress = (service) => {
    navigation.navigate("ServiceDetail", {
      service,
    });
  };

  const handleBookService = () => {
    navigation.navigate("categories", { service: null });
  };

  // Filter functions (unchanged)
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredServices = allServices.filter((service) =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sections = [
    { type: "ongoing" },
    { type: "categories", data: filteredCategories },
    { type: "popular", data: filteredServices },
  ];

  const renderItem = ({ item }) => {
    switch (item.type) {
      case "ongoing":
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ongoing Tasks</Text>
            <LinearGradient
              colors={["#6a11cb", "#2575fc"]}
              style={styles.ongoingCard}
            >
              <Text style={styles.ongoingText}>No ongoing tasks</Text>
              <Button
                title="Book New Service"
                onPress={handleBookService}
                style={styles.bookButton}
              />
            </LinearGradient>
          </View>
        );

      case "categories":
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categories</Text>
            {loading ? (
              <ActivityIndicator size="large" color={colors.accent} />
            ) : error ? (
              <Text style={styles.errorText}>Error: {error}</Text>
            ) : (
              <FlatList
                data={item.data}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item: category }) => (
                  <TouchableOpacity
                    style={styles.categoryCard}
                    onPress={() => handleCategoryPress(category)}
                  >
                    <Image
                      source={{
                        uri: `http://192.168.1.8:3000/uploads/${category.image}`, // Prepend the base URL
                      }}
                      style={styles.categoryImage}
                    />
                    <Text style={styles.categoryName}>{category.name}</Text>
                  </TouchableOpacity>
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            )}
          </View>
        );
      case "popular":
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Services</Text>
            <FlatList
              data={item.data}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item: service }) => (
                <TouchableOpacity
                  style={styles.serviceCard}
                  onPress={() => handleServicePress(service)}
                >
                  <Image source={service.image} style={styles.serviceImage} />
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceTitle}>{service.title}</Text>
                    <Text style={styles.servicePrice}>{service.price}</Text>
                    <View style={styles.ratingContainer}>
                      <Text style={styles.serviceRating}>{service.rating}</Text>
                      <Ionicons name="star" size={16} color={colors.accent} />
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.noResultsText}>No services found</Text>
              }
            />
          </View>
        );
    }
  };

  return (
    <LinearGradient colors={["#f5f7fa", "#c3cfe2"]} style={styles.container}>
      <HomeHeader
        title={
          firstLogin ? `Welcome back, ${userName}!` : `Welcome , ${userName}!`
        }
        showNotification={true}
        showSearch={true}
        onNotificationPress={() => navigation.navigate("Notifications")}
        onSearch={(query) => setSearchQuery(query)}
        onSearchToggle={(visible) => {
          setIsSearchVisible(visible);
          if (!visible) setSearchQuery("");
        }}
        keyword={searchQuery}
      />

      <FlatList
        data={sections}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </LinearGradient>
  );
};

export default Uhome;

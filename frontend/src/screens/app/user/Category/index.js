import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../../utils/colors";

const CategoryScreen = ({ route, navigation }) => {
  const { categoryName, subcategories } = route.params;
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionName) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  const renderSubcategory = ({ item }) => (
    <View style={styles.subcategoryContainer}>
      <TouchableOpacity
        style={styles.subcategoryHeader}
        onPress={() => toggleSection(item.name)}
      >
        <View style={styles.subcategoryInfo}>
          <Image source={item.image} style={styles.subcategoryImage} />
          <View style={styles.subcategoryText}>
            <Text style={styles.subcategoryTitle}>{item.name}</Text>
            <Text style={styles.subcategoryDescription} numberOfLines={2}>
              {item.description}
            </Text>
          </View>
        </View>
        <Ionicons
          name={expandedSections[item.name] ? "chevron-up" : "chevron-down"}
          size={24}
          color={colors.text}
        />
      </TouchableOpacity>

      {expandedSections[item.name] && (
        <FlatList
          data={item.services}
          keyExtractor={(service) => service.id.toString()}
          renderItem={({ item: service }) => (
            <TouchableOpacity
              style={styles.serviceItem}
              onPress={() => navigation.navigate("ServiceDetail", { service })}
            >
              <Text style={styles.serviceTitle}>{service.title}</Text>
              <View style={styles.serviceDetails}>
                <Text style={styles.servicePrice}>{service.price}</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color={colors.accent} />
                  <Text style={styles.serviceRating}>{service.rating}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Back Arrow and Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.categoryHeader}>{categoryName}</Text>
      </View>

      {/* Subcategories List */}
      <FlatList
        data={subcategories}
        keyExtractor={(item) => item.name}
        renderItem={renderSubcategory}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
    marginTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 16,
  },
  categoryHeader: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
  },
  subcategoryContainer: {
    marginBottom: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: "hidden",
  },
  subcategoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.lightGray,
  },
  subcategoryInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  subcategoryImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  subcategoryText: {
    flex: 1,
  },
  subcategoryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  subcategoryDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  serviceItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  serviceTitle: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  serviceDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  servicePrice: {
    fontSize: 14,
    color: colors.accent,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  serviceRating: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});

export default CategoryScreen;

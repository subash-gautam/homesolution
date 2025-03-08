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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../../utils/colors";

const CategoryScreen = ({ route, navigation }) => {
  const { category } = route.params;
  const [subCategories, setSubCategories] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Debug logs
    console.log("Route params:", route.params);
    console.log("Category object:", category);

    // Mock data - Replace with API call or data structure
    const data = {
      Cleaning: [
        {
          id: 1,
          title: "Full House Cleaning",
          description: "Complete home deep cleaning service",
          duration: "4-6 hours",
          price: "Rs. 2000",
          image: require("../../../../assets/cleaning.png"),
        },
        {
          id: 2,
          title: "Water Tank Cleaning",
          description: "Professional water tank sanitization",
          duration: "2-3 hours",
          price: "Rs. 800",
          image: require("../../../../assets/S.png"),
        },
      ],
      Repairs: [
        {
          id: 1,
          title: "Furniture Repair",
          description: "Fix broken furniture and fittings",
          duration: "2-4 hours",
          price: "Rs. 1200",
          image: require("../../../../assets/maintenance.jpg"),
        },
        {
          id: 2,
          title: "Wall Painting",
          description: "Professional painting services",
          duration: "6-8 hours",
          price: "Rs. 3000",
          image: require("../../../../assets/maintenance.jpg"),
        },
      ],
      Electricity: [
        {
          id: 1,
          title: "New Installation",
          description: "Electrical system installation",
          duration: "3-5 hours",
          price: "Rs. 1500",
          image: require("../../../../assets/electrician.png"),
        },
        {
          id: 2,
          title: "Maintenance",
          description: "Routine electrical maintenance",
          duration: "1-2 hours",
          price: "Rs. 500",
          image: require("../../../../assets/maintenance.jpg"),
        },
      ],
      Plumbing: [
        {
          id: 1,
          title: "Pipe Fitting",
          description: "Installation and repair of pipes",
          duration: "2-4 hours",
          price: "Rs. 1200",
          image: require("../../../../assets/plumber.png"),
        },
        {
          id: 2,
          title: "Seepage Repair",
          description: "Water leakage detection and repair",
          duration: "3-5 hours",
          price: "Rs. 1800",
          image: require("../../../../assets/S.png"),
        },
      ],
    };

    if (category && category.name && data[category.name]) {
      setSubCategories(data[category.name]);
    } else {
      console.log("No matching category found in data");
      setSubCategories([]);
    }

    setLoading(false);
  }, [category]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("ServiceDetail", { service: item })}
    >
      <Image source={item.image} style={styles.image} resizeMode="cover" />
      <View style={styles.details}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
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

        {loading ? (
          <View style={styles.loadingContainer}>
            <Ionicons name="hourglass" size={24} color={colors.primary} />
            <Text style={styles.loadingText}>Loading services...</Text>
          </View>
        ) : subCategories.length > 0 ? (
          <FlatList
            data={subCategories}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
          />
        ) : (
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    //paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
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
});

export default CategoryScreen;

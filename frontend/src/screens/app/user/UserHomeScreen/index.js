import React from "react";
import { View, Text, Alert } from "react-native";
import Header from "../../../../components/HomeHeader";
import ProductCategories from "../../../../components/ProductCategories";
import BottomTab from "../../../../components/BottomTabs";
import styles from "./styles";
const categories = [
  {
    id: 1,
    name: "Electrical",
    icon: require("../../../../assets/splash_image.png"),
  },
  {
    id: 2,
    name: "Gardening",
    icon: require("../../../../assets/splash_image.png"),
  },
  {
    id: 3,
    name: "Plumbing",
    icon: require("../../../../assets/splash_image.png"),
  },
  {
    id: 4,
    name: "Cleaning",
    icon: require("../../../../assets/splash_image.png"),
  },
  {
    id: 5,
    name: "Old Care",
    icon: require("../../../../assets/splash_image.png"),
  },
];

const UserHome = () => {
  const handleSearch = (text) => console.log("Search keyword:", text);
  const handleCategoryPress = (category) => {
    Alert.alert("Category Selected", `You selected ${category.name}`);
  };
  return (
    <View style={styles.container}>
      {/* Header */}
      <Header
        title="User Home Screen"
        showBack={false}
        showSearch={true}
        onSearch={handleSearch}
        showLogout={false}
        showProfile={true}
        showNotification={true}
        onNotificationPress={() => console.log("notification clicked")}
        onProfilePress={() => console.log("profile clicked")}
      />

      {/* Product Categories */}
      <View style={styles.categoriesContainer}>
        <ProductCategories
          categories={categories}
          onCategoryPress={handleCategoryPress}
        />
      </View>

      {/* Bottom Tab */}
      <BottomTab style={styles.bottomTab} />
    </View>
  );
};

export default UserHome;

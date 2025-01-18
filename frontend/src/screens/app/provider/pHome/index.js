import React from "react";
import { View, Alert } from "react-native";
import Header from "../../../../components/HomeHeader";
import ProductCategories from "../../../../components/ProductCategories";
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

const Phome = () => {
  const handleSearch = (text) => console.log("Search keyword:", text);
  const handleCategoryPress = (category) => {
    Alert.alert("Category Selected", `You selected ${category.name}`);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Provider Home Screen"
        showBack={false}
        showSearch={true}
        onSearch={handleSearch}
        showLogout={false}
        showProfile={true}
        showNotification={true}
        onNotificationPress={() => console.log("Notification clicked")}
        onProfilePress={() => console.log("Profile clicked")}
      />

      <View style={styles.categoriesContainer}>
        <ProductCategories
          categories={categories}
          onCategoryPress={handleCategoryPress}
        />
      </View>
    </View>
  );
};

export default Phome;

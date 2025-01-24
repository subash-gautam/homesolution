import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Header from "../../../../components/HomeHeader";
const Uhome = ({ navigation }) => {
  const categories = ["Cleaning", "Repair", "Maintenance"];
  const handleSearch = (text) => {
    console.log("Searching:", text);
  };

  const handleJobPress = (jobId) => {
    console.log("Job pressed:", jobId);
  };

  const handleSeeAll = () => {
    console.log("See all pressed");
  };
  const handleProfilePress = () => {
    navigation.navigate("profile");
  };
  const handleNotificationPress = () => {
    // Handle notification press
  };

  return (
    <View style={styles.container}>
      <Header
        title="User Home Screen"
        showBack={false}
        showSearch={true}
        onSearch={handleSearch}
        showNotification={true}
        onNotificationPress={handleNotificationPress}
        showProfile={true}
        onProfilePress={handleProfilePress}
        showLogout={false}
      />
      <Text style={styles.title}>Service Categories</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.categoryItem}
            onPress={() =>
              navigation.navigate("ServiceDetail", { category: item })
            }
          >
            <Text style={styles.categoryText}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Uhome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  categoryItem: {
    backgroundColor: "#f8f8f8",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  categoryText: {
    fontSize: 18,
  },
});

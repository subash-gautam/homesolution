import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "../../../../components/HomeHeader";

const Phome = ({ navigation }) => {
  const handleSearch = () => {
    // Implement search functionality
  };

  const handleNotificationPress = () => {
    // Handle notification press
  };

  const handleProfilePress = () => {
    navigation.navigate("profile");
  };

  return (
    <View style={styles.container}>
      <Header
        title="Provider Home Screen"
        showBack={false}
        showSearch={true}
        onSearch={handleSearch}
        showNotification={true}
        onNotificationPress={handleNotificationPress}
        showProfile={true}
        onProfilePress={handleProfilePress}
        showLogout={false}
      />
      <Text>This Is Provider HomeScreen</Text>
      <View style={styles.content}>
        {
          /* Main content components */
          <Text>Welcome to the platform Gem!!!</Text>
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    padding: 16,
  },
});

export default Phome;

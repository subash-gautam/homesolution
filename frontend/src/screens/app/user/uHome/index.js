// src/screens/app/user/uHome.js
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Header from "../../../../components/HomeHeader";
import BottomTabs from "../../../../components/BottomTabs";
const Uhome = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("home");

  const handleSearch = () => {
    // Implement search functionality
  };

  const handleNotificationPress = () => {
    // Handle notification press
  };

  const handleProfilePress = () => {
    navigation.navigate("Uprofile");
  };

  const handleTabPress = (tabKey) => {
    setActiveTab(tabKey);

    // Navigation logic for user tabs
    switch (tabKey) {
      case "home":
        navigation.navigate("Uhome");
        break;
      case "history":
        navigation.navigate("Uhistory");
        break;
      case "profile":
        navigation.navigate("Uprofile");
        break;
      default:
        console.warn("Unknown tab:", tabKey);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        showBack={false}
        showSearch={true}
        onSearch={handleSearch}
        showNotification={true}
        onNotificationPress={handleNotificationPress}
        showProfile={true}
        onProfilePress={handleProfilePress}
        showLogout={false}
      />

      <View style={styles.content}>{/* Main content components */}</View>

      <BottomTabs
        role="user"
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />
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

export default Uhome;

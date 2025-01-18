import React from "react";
import Header from "../../../../components/HomeHeader";
import { View, Text, Button, StyleSheet } from "react-native";
import Udetails from "../uDetails/Udetails";
const Uhome = ({ navigation }) => {
  const handleSearch = () => {
    console.log("Searched");
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
      <Text style={styles.text}>Welcome to the Home Screen!</Text>

      <Button
        title="Go to Details"
        onPress={() => navigation.navigate("Udetails")} // Navigate to Details screen
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Uhome;

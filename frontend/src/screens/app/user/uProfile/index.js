import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "../../../../components/HomeHeader";

const Uprofile = () => {
  return (
    <View style={styles.container}>
      <Header title="User Profile" showBack={true} showLogout={true} />
      <View style={styles.content}>
        <Text>User Profile Screen Content</Text>
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

export default Uprofile;

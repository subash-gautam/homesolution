import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "../../../../components/HomeHeader";

const Pprofile = () => {
  return (
    <View style={styles.container}>
      <Header title="Profile" showBack={true} showLogout={true} />
      <View style={styles.content}>
        <Text>Profile Screen Content</Text>
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

export default Pprofile;

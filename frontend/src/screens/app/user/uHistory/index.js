import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "../../../../components/HomeHeader";

const Uhistory = () => {
  return (
    <View style={styles.container}>
      <Header title="History" showBack={true} showSearch={true} />
      <View style={styles.content}>
        <Text>History Screen Content</Text>
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

export default Uhistory;

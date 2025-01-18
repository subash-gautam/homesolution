import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const Udetails = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is the Details Screen!</Text>
      <Button
        title="Go Back"
        onPress={() => navigation.goBack()} // Go back to the previous screen
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Udetails;

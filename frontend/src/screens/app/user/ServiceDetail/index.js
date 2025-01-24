import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Button from "../../../../components/Button.js/Index";
const ServiceDetailScreen = ({ route, navigation }) => {
  const { category } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category} Services</Text>
      <Text style={styles.description}>
        Here is a detailed description of the {category} service.
      </Text>

      <Button
        title="Book Now"
        onPress={() => navigation.navigate("BookService", { category })}
      />
    </View>
  );
};

export default ServiceDetailScreen;

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
  description: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  addonText: {
    fontSize: 16,
    marginBottom: 4,
  },
});

import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import Button from "../../../../components/Button.js/Index";
import styles from "./styles";
const ServiceDetailScreen = ({ route, navigation }) => {
  const { service } = route.params;

  const handleBookNow = () => {
    navigation.navigate("BookService", {
      service,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{service.title}</Text>
      <Text style={styles.price}>{service.price}</Text>
      <Text style={styles.rating}>{service.rating} ★</Text>

      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.description}>{service.description}</Text>

      <Button
        title="Proceed to Booking"
        onPress={handleBookNow}
        style={styles.primaryButton}
      />
    </View>
  );
};

export default ServiceDetailScreen;

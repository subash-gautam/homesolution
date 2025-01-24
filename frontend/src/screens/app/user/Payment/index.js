import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Button from "../../../../components/Button.js/Index";
const PaymentScreen = ({ navigation }) => {
  const paymentOptions = ["Khalti", "At the Spot"];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Options</Text>
      {paymentOptions.map((option, index) => (
        <Text key={index} style={styles.paymentOption}>
          - {option}
        </Text>
      ))}
      <Button
        title="Confirm Payment"
        onPress={() => alert("Payment Successful!\nBooking Confirmed.")}
      />
    </View>
  );
};

export default PaymentScreen;

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
  paymentOption: {
    fontSize: 18,
    marginBottom: 8,
  },
});

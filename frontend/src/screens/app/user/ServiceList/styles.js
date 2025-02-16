import { StyleSheet } from "react-native";
import { colors } from "../../../../utils/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  serviceItem: {
    marginBottom: 16,
  },
  serviceImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  serviceDescription: {
    fontSize: 14,
    color: "#666",
  },
  servicePrice: {
    fontSize: 16,
    color: "#333",
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 8, // Adjust spacing as needed
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
});

export default styles;

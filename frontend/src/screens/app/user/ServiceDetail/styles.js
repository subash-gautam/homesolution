import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  serviceItem: {
    marginBottom: 20,
    alignItems: "center",
  },
  serviceImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    color: "#333",
  },
  serviceDescription: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 5,
    color: "#666",
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    color: "#007bff",
  },
  providerItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  providerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  providerRating: {
    fontSize: 16,
    color: "#007bff",
  },
  noProvidersText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
  primaryButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
    color: "#ff0000",
  },
});

export default styles;

import { StyleSheet, StatusBar, Platform } from "react-native";
import { colors } from "../../../../utils/colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 50,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: colors.text,
    marginLeft: 15,
  },
  ongoingCard: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    marginHorizontal: 15,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  ongoingText: {
    fontSize: 16,
    color: colors.white,
    marginBottom: 10,
  },
  bookButton: {
    width: "100%",
    backgroundColor: colors.accent,
    borderRadius: 15,
    paddingVertical: 10,
    alignItems: "center",
  },
  categoryCard: {
    alignItems: "center",
    marginRight: 15,
    backgroundColor: "linear-gradient(to right, #f5f7fa, #c3cfe2)",
    borderRadius: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    resizeMode: "cover",
  },
  categoryName: {
    marginTop: 5,
    fontSize: 14,
    color: colors.text,
    fontWeight: "600",
  },
  serviceCard: {
    backgroundColor: "#F9F9F9",
    padding: 15,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginHorizontal: 15,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  serviceImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
    resizeMode: "cover",
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },
  servicePrice: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  serviceRating: {
    fontSize: 14,
    color: colors.accent,
    marginRight: 5,
  },
  noResultsText: {
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
    marginTop: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
});

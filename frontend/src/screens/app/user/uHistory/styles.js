import { StyleSheet } from "react-native";
import { colors } from "../../../../utils/colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingBottom: 70,
  },
  header: {
    padding: 16,
    backgroundColor: colors.white,
  },
  searchInput: {
    height: 40,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  filterButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.lightGray,
  },
  activeFilter: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 12,
    color: colors.text,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    padding: 16,
    backgroundColor: colors.background,
  },
  itemContainer: {
    backgroundColor: colors.white,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  dateText: {
    fontSize: 12,
    color: colors.gray,
  },
  titleText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  providerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  providerText: {
    marginLeft: 8,
    color: colors.text,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 4,
    color: colors.accent,
  },
  transactionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
    marginLeft: 8,
  },
  transactionDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  transactionMethod: {
    color: colors.gray,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  detailText: {
    marginLeft: 8,
    color: colors.text,
    fontSize: 14,
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
    textAlign: "center",
  },
  retryText: {
    color: colors.primary,
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
  emptyText: {
    textAlign: "center",
    color: colors.textSecondary,
    marginTop: 20,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
});

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
    paddingVertical: 10,
    paddingHorizontal: 15,
    gap: 10,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: colors.lightGray,
  },
  activeFilter: {
    backgroundColor: colors.primary,
  },
  activeFilterText: {
    color: colors.white,
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
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
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
  retryButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingTop: 100,
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
    resizeMode: "contain",
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    fontWeight: "500",
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  mapButtonText: {
    marginLeft: 6,
    fontSize: 14,
  },
});

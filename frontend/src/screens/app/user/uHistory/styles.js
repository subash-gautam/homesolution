import { StyleSheet } from "react-native";
import { colors } from "../../../../utils/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  header: {
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
    paddingBottom: 10,
  },
  filterContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "#F0F0F0",
  },
  activeFilter: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 12,
    color: colors.text,
  },
  activeFilterText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#F9F9F9",
  },
  itemContainer: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statusText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  dateText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.text,
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  mapButtonText: {
    marginLeft: 6,
    color: colors.primary,
    fontSize: 14,
  },
  priceContainer: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 8,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.success,
    alignSelf: "flex-end",
    marginTop: 4,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
    opacity: 0.7,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  // New styles for cancel button
  actionButtons: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 12,
    alignItems: "flex-end",
  },
  cancelButton: {
    backgroundColor: colors.error,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontWeight: "500",
    fontSize: 14,
  },
});

export default styles;

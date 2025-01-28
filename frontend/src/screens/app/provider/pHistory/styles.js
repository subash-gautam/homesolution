import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: "#f0f0f0", // Default background color
    justifyContent: "center",
    alignItems: "center",
  },
  activeFilter: {
    backgroundColor: "#6a11cb", // Active background color
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333", // Default text color
  },
  activeFilterText: {
    color: "#fff", // Active text color
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  clientsContainer: {
    paddingVertical: 8,
  },
  clientCard: {
    padding: 16,
    borderRadius: 10,
    marginRight: 10,
    width: 150,
    elevation: 3,
  },
  clientName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  clientStats: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  clientRating: {
    marginLeft: 4,
    color: "#fff",
  },
  clientBookings: {
    marginTop: 8,
    color: "#fff",
  },
  historyItem: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  clientText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  dateText: {
    fontSize: 14,
    color: "#666",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  detailsContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  exportButton: {
    marginTop: 16,
    borderRadius: 10,
    overflow: "hidden",
  },
  exportGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  exportText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
});

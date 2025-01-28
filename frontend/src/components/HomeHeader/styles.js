import { StyleSheet } from "react-native";

export default StyleSheet.create({
  mainContainer: {
    backgroundColor: "#fff",
    padding: 10,
    paddingTop: 40,
    borderBottomColor: "#ddd",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
    marginHorizontal: 5,
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  leftIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  spacer: {
    width: 40,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#ddd",

    marginHorizontal: 5,
    marginRight: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
    position: "absolute",
    left: 0,
    right: 0,
  },
  spacer: {
    width: 24,
  },
  searchInput: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
    color: "#333",
  },
});

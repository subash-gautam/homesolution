import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5", // Light gray background for the entire page
  },
  categoriesContainer: {
    flex: 1,
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  bottomTab: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});

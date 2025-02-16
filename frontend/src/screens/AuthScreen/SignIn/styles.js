import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    padding: 24,
    marginTop: 30,
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: "contain",
  },
  headerBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 16,
  },
  imageView: {
    marginBottom: 30,
    alignItems: "center",
  },
  image: {
    width: 300,
    height: 150,
    resizeMode: "contain",
  },
  footerContainer: {
    marginTop: 20,
    width: "100%",
  },
  footerItem: {
    marginVertical: 10,
    alignItems: "center",
  },
});

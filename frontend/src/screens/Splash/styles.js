import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    padding: 24,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  image: {
    width: "100%",
    height: 200,
  },
  titleContainer: {
    marginVertical: 54,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    padding: 10,
  },
  innerTitle: {
    fontSize: 30,
    color: "orange",
    textAlign: "center",
  },

  buttonCont: { width: "100%", flexDirection: "column" },
});

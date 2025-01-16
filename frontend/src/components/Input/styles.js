import { StyleSheet } from "react-native";

export default StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 14,
    padding: 10,
    marginBottom: 20,
  },
  icon: {
    width: 24,
    height: 24,
    marginHorizontal: 11,
  },
  input: {
    flex: 1,

    fontSize: 16,
    color: "#333",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -5,
    marginBottom: 10,
  },
});

import { StyleSheet } from "react-native";
import { colors } from "../../../../utils/colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.primary,
    marginVertical: 15,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: "top",
  },
  locationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  linkText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateTimeText: {
    marginLeft: 10,
    fontSize: 16,
    color: colors.textPrimary,
  },
  confirmButton: {
    marginTop: 30,
    backgroundColor: colors.primary,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  mapButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
  },
});

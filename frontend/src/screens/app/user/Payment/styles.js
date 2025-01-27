import { StyleSheet } from "react-native";
import { colors } from "../../../../utils/colors";

export default StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.background,
    minHeight: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 30,
    textAlign: "center",
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 15,
  },
  detailText: {
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.success,
    marginTop: 10,
  },
  methodButton: {
    backgroundColor: colors.lightPrimary,
    marginVertical: 10,
    borderRadius: 8,
  },
  khaltiButton: {
    backgroundColor: "#5C2D91",
  },
  confirmButton: {
    backgroundColor: colors.success,
    marginTop: 30,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  animation: {
    width: 150,
    height: 150,
  },
  successText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.success,
    marginTop: 20,
  },
  successSubText: {
    fontSize: 16,
    color: colors.textPrimary,
    marginTop: 10,
    textAlign: "center",
  },
});

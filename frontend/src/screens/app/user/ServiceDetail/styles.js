import { StyleSheet } from "react-native";
import { colors } from "../../../../utils/colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 10,
  },
  price: {
    fontSize: 22,
    color: colors.success,
    marginBottom: 8,
  },
  rating: {
    fontSize: 18,
    color: colors.warning,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.textPrimary,
    marginVertical: 15,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    marginTop: 30,
  },
});

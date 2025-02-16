import { StyleSheet } from "react-native";

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 16,
    color: "#000",
  },
  container: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  serviceContainer: {
    marginVertical: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  locationButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  locationButton: {
    padding: 10,
  },
  locationButtonText: {
    color: "#FF5722",
    fontWeight: "500",
  },
  uploadButton: {
    backgroundColor: "#FF5722",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  imagePreviewContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  imageWrapper: {
    position: "relative",
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeButton: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  bioInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    height: 120,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#FF5722",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 30,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    position: "relative",
  },
  fullScreenMap: {
    flex: 1,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  closeButtonText: {
    color: "#000",
    fontWeight: "500",
  },
});

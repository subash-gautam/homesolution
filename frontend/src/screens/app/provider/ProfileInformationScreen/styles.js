import { StyleSheet } from "react-native";

export default StyleSheet.create({
  // Existing styles remain the same
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    marginTop: 25,
  },
  scrollContainer: {
    padding: 20,
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#333",
  },
  // Image styles
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#e1e1e1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  imagePlaceholderText: {
    color: "#666",
  },
  imageButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  imageButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  // Skills styles
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
  },
  skillButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    margin: 5,
  },
  skillButtonSelected: {
    backgroundColor: "#4CAF50",
  },
  skillButtonText: {
    color: "#4CAF50",
    fontSize: 14,
  },
  skillButtonTextSelected: {
    color: "#fff",
  },
  // Service styles
  serviceForm: {
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  serviceCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  serviceDescription: {
    color: "#666",
    marginBottom: 5,
  },
  servicePrice: {
    color: "#4CAF50",
    fontWeight: "600",
  },
  removeButton: {
    color: "#ff4444",
    fontSize: 24,
    fontWeight: "bold",
  },

  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 10,
  },

  suggestionsContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
    zIndex: 2,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  suggestionItemPressed: {
    backgroundColor: "#f0f0f0",
  },
  suggestionText: {
    fontSize: 16,
    color: "#333",
  },
  textArea: {
    height: 120,
    paddingTop: 12,
  },
  charCount: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonDisabled: {
    backgroundColor: "#a5d6a7",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  recurringContainer: {
    marginBottom: 20,
  },
  picker: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginTop: 5,
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  daysScrollContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  dayButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    marginRight: 10,
    minWidth: 100,
    alignItems: "center",
  },
  dayButtonSelected: {
    backgroundColor: "#007AFF",
  },
  dayButtonText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "500",
  },
  dayButtonTextSelected: {
    color: "#FFFFFF",
  },
  timeSlotsContainer: {
    marginVertical: 10,
  },
  dayHeader: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  timeSlotButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    marginRight: 10,
    marginBottom: 10,
  },
  timeSlotButtonSelected: {
    backgroundColor: "#007AFF",
  },
  timeSlotText: {
    color: "#333",
    fontSize: 14,
  },
  timeSlotTextSelected: {
    color: "#FFFFFF",
  },
});

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./styles";

const AuthHeader = ({ title, onBackPress, showBackButton = true }) => {
  return (
    <View style={styles.headerContainer}>
      {/* Conditionally render the back button */}
      {showBackButton && (
        <TouchableOpacity
          onPress={onBackPress}
          style={styles.backButton}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <Text style={styles.backButtonText}>{"<"}</Text>
        </TouchableOpacity>
      )}

      {/* Title */}
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
};

export default AuthHeader;

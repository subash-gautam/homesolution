import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./styles";
const AuthHeader = ({ title, onBackPress }) => (
  <View style={styles.headerContainer}>
    <TouchableOpacity
      onPress={onBackPress}
      style={styles.backButton}
      hitSlop={20}
    >
      <Text style={styles.backButtonText}>{"<"}</Text>
    </TouchableOpacity>
    <Text style={styles.headerTitle}>{title}</Text>
  </View>
);

export default AuthHeader;

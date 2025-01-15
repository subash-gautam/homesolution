import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./styles";

const Footer = ({ text, linkText, onLinkPress }) => (
  <View style={styles.footerContainer}>
    <Text style={styles.footerText}>{text}</Text>
    <TouchableOpacity onPress={onLinkPress}>
      <Text style={styles.footerLink}>{linkText}</Text>
    </TouchableOpacity>
  </View>
);

export default Footer;

import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const ProfileHeader = ({ name, designation, image }) => {
  return (
    <View style={styles.profileSection}>
      <Image
        source={image} // Pass the image as a prop
        style={styles.profileImage}
      />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.subtitle}>{designation}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  profileSection: {
    alignItems: "center",
    marginTop: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
  },
});

export default ProfileHeader;

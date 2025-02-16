import React, { useState } from "react";
import {
  Text,
  Image,
  View,
  Pressable,
  Modal,
  TouchableOpacity,
} from "react-native";
import Button from "../../../components/Button.js/Index";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";

const Splash = () => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true); // To track if it's a signup or signin flow

  // Open modal and set the flow (signup or signin)
  const openModal = (isSignUpFlow) => {
    setIsSignUp(isSignUpFlow); // Set whether it's signup or signin
    setModalVisible(true); // Show the modal
  };

  // Handle navigation based on user selection
  const handleNavigation = (userType) => {
    setModalVisible(false); // Close the modal
    if (isSignUp) {
      // Navigate to the respective signup screen
      if (userType === "user") {
        navigation.navigate("UserSignUp");
      } else if (userType === "provider") {
        navigation.navigate("ProviderSignUp");
      }
    } else {
      // Navigate to the respective signin screen
      if (userType === "user") {
        navigation.navigate("UserSignIn");
      } else if (userType === "provider") {
        navigation.navigate("ProviderSignIn");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image
        resizeMode="contain"
        style={styles.image}
        source={require("../../../assets/SplashHome.png")}
      />

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Welcome To HomeSolution</Text>
        <Text style={styles.innerTitle}>You'll Find All you need</Text>
      </View>

      {/* Sign Up Button */}
      <View style={styles.buttonCont}>
        <Button onPress={() => openModal(true)} title="Sign Up" />
      </View>

      {/* Sign In Button */}
      <View style={styles.buttonCont}>
        <Button onPress={() => openModal(false)} title="Sign In" />
      </View>

      {/* Modal for User/Provider Selection */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isSignUp ? "Sign Up as:" : "Sign In as:"}
            </Text>

            {/* User Button */}
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleNavigation("user")}
            >
              <Text style={styles.modalButtonText}>User</Text>
            </TouchableOpacity>

            {/* Service Provider Button */}
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleNavigation("provider")}
            >
              <Text style={styles.modalButtonText}>Service Provider</Text>
            </TouchableOpacity>

            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default React.memo(Splash);

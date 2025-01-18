import React from "react";
import { Text, Image, View, Pressable } from "react-native";
import Button from "../../../components/Button.js/Index";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";
const Splash = () => {
  const navigation = useNavigation();
  const onSignup = () => {
    navigation.navigate("SignUp");
  };

  const onSignin = () => {
    navigation.navigate("SignIn");
  };

  return (
    <View style={styles.container}>
      <Image
        resizeMode="contain"
        style={styles.image}
        source={require("../../../assets/splash_image.png")}
      />

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Welcome To HomeSolution</Text>
        <Text style={styles.innerTitle}>You'll Find All you need</Text>
      </View>

      <View style={styles.buttonCont}>
        <Button onPress={onSignup} title="Sign Up" />
      </View>

      <View style={styles.buttonCont}>
        <Button onPress={onSignin} title="Sign In" />
      </View>
    </View>
  );
};

export default React.memo(Splash);

import { View, Text } from "react-native";
import React from "react";
import Splash from "./src/screens/Splash";
import SignUp from "./src/screens/SignUp/styles";
import SignIn from "./src/screens/SignIn";

const App = () => {
  return (
    <View>
      <Text style={{ padding: 50 }}>Hello Grish</Text>;
      <Splash />;
      <SignUp />
      <SignIn />
    </View>
  );
};

export default App;

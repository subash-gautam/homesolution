import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import StackNavigator from "./src/screens/navigator/StackNavigator";
import AppNavigator from "./src/screens/navigator/AppNavigator";
const App = () => {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
};

export default App;

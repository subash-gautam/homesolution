import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./src/components/AuthContext";
import StackNavigator from "./src/screens/navigator/StackNavigator";
import AppNavigator from "./src/screens/navigator/AppNavigator";
const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;

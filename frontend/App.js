// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./src/components/AuthContext";
import { ThemeProvider } from "./src/context/ThemeContext"; // Import ThemeProvider
import StackNavigator from "./src/screens/navigator/StackNavigator";

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Splash from "../AuthScreen/Splash";
import SignUp from "../AuthScreen/SignUp";
import SignIn from "../AuthScreen/SignIn";
import UserHome from "../app/user/UserHomeScreen";
const Stack = createStackNavigator();
const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen
        name="Splash"
        component={Splash}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserHome"
        component={UserHome}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;

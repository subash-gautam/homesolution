import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Splash from "../AuthScreen/Splash";
import SignUp from "../AuthScreen/SignUp";
import SignIn from "../AuthScreen/SignIn";
import Uhome from "../app/user/uHome";
import Uprofile from "../app/user/uProfile";
import Uhistory from "../app/user/uHistory";
import Phistory from "../app/provider/pHistory";
import Phome from "../app/provider/pHome";
import Stats from "../app/provider/Stats";
import Pprofile from "../app/provider/pProfile";
import BottomTabs from "../../components/BottomTabs";
import Udetails from "../app/user/uDetails/Udetails";
const Stack = createStackNavigator();
const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Uhome">
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
        name="Uhome"
        component={Uhome}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Udetails"
        component={Udetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Uprofile"
        component={Uprofile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Uhistory"
        component={Uhistory}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Phome"
        component={Phome}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Phistory"
        component={Phistory}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserTabs"
        component={BottomTabs} // Using the reusable BottomTabNavigator
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Pprofile"
        component={Pprofile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Stats"
        component={Stats}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;

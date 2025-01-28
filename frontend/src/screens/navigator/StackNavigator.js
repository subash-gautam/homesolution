import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Splash from "../AuthScreen/Splash";
import SignUp from "../AuthScreen/SignUp";
import SignIn from "../AuthScreen/SignIn";
import Udetails from "../app/user/uDetails/Udetails";
import AppNavigator from "./AppNavigator";
import ProfileInformationScreen from "../app/provider/ProfileInformationScreen";
import ServiceDetailScreen from "../app/user/ServiceDetail";
import BookServiceScreen from "../app/user/BookService";
import PaymentScreen from "../app/user/Payment";
import CategoryScreen from "../app/user/Category";
import JobHistory from "../app/provider/JobHistory";

const Stack = createStackNavigator();

// Create separate components for the tab navigators
const ProviderTabsScreen = () => <AppNavigator role="provider" />;
const UserTabsScreen = () => <AppNavigator role="user" />;

// Memoize the components to prevent unnecessary re-renders
const MemoizedProviderTabs = React.memo(ProviderTabsScreen);
const MemoizedUserTabs = React.memo(UserTabsScreen);

const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="ProviderTabs">
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
        name="Category"
        component={CategoryScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfileInformationScreen"
        component={ProfileInformationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Udetails"
        component={Udetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProviderTabs"
        component={MemoizedProviderTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserTabs"
        component={MemoizedUserTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
      <Stack.Screen name="BookService" component={BookServiceScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen
        name="JobHistory"
        component={JobHistory}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;

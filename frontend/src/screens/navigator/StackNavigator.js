import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Splash from "../AuthScreen/Splash";

import Udetails from "../app/user/uDetails/Udetails";
import AppNavigator from "./AppNavigator";
import ProfileInformationScreen from "../app/provider/ProfileInformationScreen";
import ServiceDetailScreen from "../app/user/ServiceDetail";
import BookServiceScreen from "../app/user/BookService";
import PaymentScreen from "../app/user/Payment";
import CategoryScreen from "../app/user/Category";
import JobHistory from "../app/provider/JobHistory";
import ProviderSignUp from "../AuthScreen/SignUp/ProviderSignUp";
import UserSignUp from "../AuthScreen/SignUp/UserSignUp";
import ProviderSignIn from "../AuthScreen/SignIn/ProviderSignIn";
import UserSignIn from "../AuthScreen/SignIn/UserSignIn";
import ServiceCreationScreen from "../app/provider/CreateService";
import AboutApp from "../legal/AboutApp";
import TermsAndConditions from "../legal/TermsAndConditions";
import PrivacyPolicy from "../legal/PrivacyPolicy";
import HelpSupport from "../legal/HelpSupport";
import CreateServiceScreen from "../app/provider/CreateService";

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
        name="CreateServiceScreen"
        component={CreateServiceScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Category"
        component={CategoryScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ProviderSignUp"
        component={ProviderSignUp}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserSignUp"
        component={UserSignUp}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserSignIn"
        component={UserSignIn}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProviderSignIn"
        component={ProviderSignIn}
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
      <Stack.Screen
        name="ServiceCreationScreen"
        component={ServiceCreationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HelpSupport"
        component={HelpSupport}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="About"
        component={AboutApp}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Terms"
        component={TermsAndConditions}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Splash from "../AuthScreen/Splash";
import UserMessageScreen from "../app/UserMessageScreen";
import Udetails from "../app/user/uDetails/Udetails";
import AppNavigator from "./AppNavigator";
import ProfileInformationScreen from "../app/provider/ProfileInformationScreen";
import ServiceDetailScreen from "../app/user/ServiceDetail";
import Notifications from "../../utils/Notifications";
import BookServiceScreen from "../app/user/BookService";
import PaymentScreen from "../app/user/Payment";
import CategoryScreen from "../app/user/Category";
import JobHistory from "../app/provider/JobHistory";
import ProviderSignUp from "../AuthScreen/SignUp/ProviderSignUp";
import UserSignUp from "../AuthScreen/SignUp/UserSignUp";
import ProviderSignIn from "../AuthScreen/SignIn/ProviderSignIn";
import UserSignIn from "../AuthScreen/SignIn/UserSignIn";
//import ServiceCreationScreen from "../app/provider/CreateService";
import ProviderMessageScreen from "../app/ProviderMessageScreen";
import AboutApp from "../legal/AboutApp";
import ProviderProfileScreen from "../app/ProviderProfileScreen";
import OrderConfirmationScreen from "../app/OrderConfirmationScreen";
import TermsAndConditions from "../legal/TermsAndConditions";
import PrivacyPolicy from "../legal/PrivacyPolicy";
import HelpSupport from "../legal/HelpSupport";
import ProviderInformationScreen from "../app/provider/ProviderInformation";
import ServiceListScreen from "../app/user/ServiceList";
import OTPScreen from "../OTP";
import PersonalData from "../app/provider/PersonalData";
import ForgotPasswordScreen from "../ForgotPasswordScreen";
import ResetPasswordScreen from "../ResetPasswordScreen";
import OTPVerificationScreen from "../OTPVerificationScreen";
import PaymentFailureScreen from "../PaymentFailureScreen";
import PaymentSuccessScreen from "../PaymentSuccessScreen";
import PaymentS from "../PaymentScreen";
const Stack = createStackNavigator();

// Create separate components for the tab navigators
const ProviderTabsScreen = () => <AppNavigator role="provider" />;
const UserTabsScreen = () => <AppNavigator role="user" />;

// Memoize the components to prevent unnecessary re-renders
const MemoizedProviderTabs = React.memo(ProviderTabsScreen);
const MemoizedUserTabs = React.memo(UserTabsScreen);

const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen
        name="Splash"
        component={Splash}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProviderInformation"
        component={ProviderInformationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PersonalData"
        component={PersonalData}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OrderConfirmation"
        component={OrderConfirmationScreen}
        options={{ title: "Confirm Booking" }}
      />
      <Stack.Screen
        name="ProviderProfileScreen"
        component={ProviderProfileScreen}
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
        name="UserMessageScreen"
        component={UserMessageScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ProviderMessage"
        component={ProviderMessageScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Payment"
        component={PaymentS}
        options={{ title: "eSewa Payment" }}
      />
      <Stack.Screen
        name="PaymentSuccess"
        component={PaymentSuccessScreen}
        options={{ title: "Payment Successful", headerBackVisible: false }}
      />
      <Stack.Screen
        name="PaymentFailure"
        component={PaymentFailureScreen}
        options={{ title: "Payment Failed", headerBackVisible: false }}
      />
      <Stack.Screen
        name="Notifications"
        component={Notifications}
        options={{ title: "Notifications" }}
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
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ title: "Forgot Password" }}
      />
      <Stack.Screen
        name="OTPVerification"
        component={OTPVerificationScreen}
        options={{ title: "Verify OTP" }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{ title: "Reset Password" }}
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
      <Stack.Screen
        name="ServiceDetail"
        component={ServiceDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ServiceList"
        component={ServiceListScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen name="BookService" component={BookServiceScreen} />

      <Stack.Screen
        name="JobHistory"
        component={JobHistory}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="HelpSupport"
        component={HelpSupport}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OTP"
        component={OTPScreen}
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

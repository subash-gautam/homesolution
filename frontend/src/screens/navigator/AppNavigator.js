import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Phome from "../app/provider/pHome";
import Phistory from "../app/provider/pHistory";
import Pprofile from "../app/provider/pProfile";
import Stats from "../app/provider/Stats";
import Uhome from "../app/user/uHome";
import Uhistory from "../app/user/uHistory";
import Uprofile from "../app/user/uProfile";
import BottomTabs from "../../components/BottomTabs";
import Umessage from "../app/user/Umessage";
const Tab = createBottomTabNavigator();

const UserTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomTabs {...props} role="user" />}
    >
      <Tab.Screen name="home" component={Uhome} />
      <Tab.Screen name="history" component={Uhistory} />
      <Tab.Screen name="message" component={Umessage} />
      <Tab.Screen name="profile" component={Uprofile} />
    </Tab.Navigator>
  );
};

const ProviderTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomTabs {...props} role="provider" />}
    >
      <Tab.Screen name="home" component={Phome} />
      <Tab.Screen name="history" component={Phistory} />
      <Tab.Screen name="stats" component={Stats} />
      <Tab.Screen name="profile" component={Pprofile} />
    </Tab.Navigator>
  );
};

const AppNavigator = ({ role }) => {
  return role === "provider" ? <ProviderTabs /> : <UserTabs />;
};

export default AppNavigator;

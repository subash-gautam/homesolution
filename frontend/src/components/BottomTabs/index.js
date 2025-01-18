import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";

// Import all the components
import Uhome from "../../screens/app/user/uHome";
import Uhistory from "../../screens/app/user/uHistory";
import Uprofile from "../../screens/app/user/uProfile";
import Phome from "../../screens/app/provider/pHome";
import Phistory from "../../screens/app/provider/pHistory";
import Stats from "../../screens/app/provider/Stats";
import Pprofile from "../../screens/app/provider/pProfile";

const Tab = createBottomTabNavigator();

const BottomTabs = ({ role }) => {
  // Define role-specific tabs inside BottomTabs
  const roleTabs = {
    user: [
      { name: "Home", component: Uhome, icon: "home" },
      { name: "History", component: Uhistory, icon: "time" },
      { name: "Profile", component: Uprofile, icon: "person" },
    ],
    serviceProvider: [
      { name: "Home", component: Phome, icon: "home" },
      { name: "History", component: Phistory, icon: "time" },
      { name: "Stats", component: Stats, icon: "stats-chart" },
      { name: "Profile", component: Pprofile, icon: "person" },
    ],
  };

  // Select tabs based on the role
  const tabs = roleTabs[role] || [];

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 0.5,
          borderTopColor: "#ccc",
        },
        tabBarIcon: ({ focused, color, size }) => {
          const tab = tabs.find((tab) => tab.name === route.name);
          const iconName = focused ? tab.icon : `${tab.icon}-outline`;
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007BFF",
        tabBarInactiveTintColor: "#aaa",
      })}
    >
      {tabs.map((tab) => (
        <Tab.Screen key={tab.name} name={tab.name} component={tab.component} />
      ))}
    </Tab.Navigator>
  );
};

export default BottomTabs;

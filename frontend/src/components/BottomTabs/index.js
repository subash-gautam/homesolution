import React from "react";
import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const BottomTabs = ({ state, descriptors, navigation, role }) => {
  const tabs = {
    user: [
      { key: "home", icon: "home", label: "Home" },
      { key: "history", icon: "time", label: "History" },
      { key: "message", icon: "chatbubbles", label: "Message" },

      { key: "profile", icon: "person", label: "Profile" },
    ],
    provider: [
      { key: "home", icon: "home", label: "Home" },
      { key: "history", icon: "time", label: "History" },
      { key: "stats", icon: "stats-chart", label: "Stats" },
      { key: "profile", icon: "person", label: "Profile" },
    ],
  };

  const currentTabs = tabs[role] || tabs.user;

  return (
    <View style={styles.footer}>
      {currentTabs.map((tab, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: state.routes[index].key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(state.routes[index].name);
          }
        };

        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, isFocused && styles.activeTab]}
            onPress={onPress}
          >
            <Ionicons
              name={isFocused ? `${tab.icon}` : `${tab.icon}-outline`}
              size={24}
              color={isFocused ? "#007AFF" : "#666"}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    height: 60,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 8, // for Android shadow
    shadowColor: "#000", // for iOS shadow
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: "#007AFF",
    backgroundColor: "#f8f9fa",
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    color: "#666",
  },
  activeTabLabel: {
    color: "#007AFF",
  },
  tabIcon: {
    marginBottom: 2,
  },
  tabContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  activeTabContainer: {
    backgroundColor: "#f8f9fa",
  },
  // Optional: Add ripple effect container for Android
  rippleContainer: {
    overflow: "hidden",
    borderRadius: 8,
  },
  // Optional: Add safe area padding for iOS devices with home indicator
  safeAreaPadding: {
    paddingBottom: Platform.OS === "ios" ? 20 : 0,
  },
});

export default BottomTabs;

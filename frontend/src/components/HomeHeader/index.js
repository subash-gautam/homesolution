import React, { useState } from "react";
import { Pressable, Text, View, Image, TextInput } from "react-native";
import styles from "./styles";

const Header = ({
  title,
  onBackPress,
  onLogout,
  onProfilePress,
  onNotificationPress,
  onSearch,
  onSearchToggle,
  showLogout = false,
  showSearch = false,
  showBack = false,
  showProfile = false,
  showNotification = false,
  profileImage = "",
  keyword = "",
  placeholder = "Search for Service....",
}) => {
  const [showSearchInput, setShowSearchInput] = useState(false);

  const toggleSearchInput = () => {
    setShowSearchInput((prev) => {
      if (onSearchToggle) {
        onSearchToggle(!prev);
      }
      return !prev;
    });
  };

  return (
    <View style={styles.mainContainer}>
      {/* Header Row */}
      <View style={styles.headerContainer}>
        {/* Left Icons: Back, Search, Profile */}
        <View style={styles.leftIcons}>
          {showBack && (
            <Pressable onPress={onBackPress} hitSlop={20}>
              <Image
                style={styles.icon}
                source={require("../../assets/back.png")}
              />
            </Pressable>
          )}
          {showSearch && (
            <Pressable onPress={toggleSearchInput} hitSlop={20}>
              <Image
                style={styles.icon}
                source={require("../../assets/search.png")}
              />
            </Pressable>
          )}
          {showProfile && (
            <Pressable onPress={onProfilePress}>
              <Image
                style={styles.profileImage}
                source={
                  profileImage
                    ? { uri: profileImage }
                    : require("../../assets/profile.png")
                }
              />
            </Pressable>
          )}
        </View>

        {/* Title in the Center */}
        <Text style={styles.title}>{title}</Text>

        {/* Right Icons: Notification, Logout */}
        <View style={styles.rightIcons}>
          {showNotification && (
            <Pressable onPress={onNotificationPress} hitSlop={20}>
              <Image
                style={styles.icon}
                source={require("../../assets/notification.png")}
              />
            </Pressable>
          )}
          {showLogout && (
            <Pressable onPress={onLogout} hitSlop={20}>
              <Image
                style={styles.icon}
                source={require("../../assets/logout.png")}
              />
            </Pressable>
          )}
        </View>
      </View>

      {/* Search Input */}
      {showSearchInput && (
        <TextInput
          style={styles.searchInput}
          onChangeText={onSearch}
          value={keyword}
          placeholder={placeholder}
          placeholderTextColor="#aaa"
        />
      )}
    </View>
  );
};

export default Header;

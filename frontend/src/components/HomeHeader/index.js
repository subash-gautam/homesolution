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
  showLogout = false,
  showSearch = false,
  showBack = false,
  showProfile = false,
  showNotification = false,
  profileImage = "",
  keyword = "",
}) => {
  const [showSearchInput, setShowSearchInput] = useState(false);

  const toggleSearchInput = () => setShowSearchInput((prev) => !prev);

  return (
    <View style={styles.mainContainer}>
      {/* Top Header Section */}
      <View style={styles.headerContainer}>
        {/* Back or Search Icon */}
        {showBack ? (
          <Pressable onPress={onBackPress} hitSlop={20}>
            <Image
              style={styles.icon}
              source={require("../../assets/back.png")}
            />
          </Pressable>
        ) : showSearch ? (
          <Pressable onPress={toggleSearchInput} hitSlop={20}>
            <Image
              style={styles.icon}
              source={require("../../assets/search.png")}
            />
          </Pressable>
        ) : (
          <View style={styles.spacer} />
        )}

        {/* Title */}
        <Text style={styles.title}>{title}</Text>

        {/* Profile, Notification, or Logout */}
        <View style={styles.rightIcons}>
          {showNotification && (
            <Pressable onPress={onNotificationPress} hitSlop={20}>
              <Image
                style={styles.icon}
                source={require("../../assets/notification.png")}
              />
            </Pressable>
          )}

          {showProfile ? (
            <Pressable onPress={onProfilePress}>
              <Image
                style={styles.profileImage}
                source={
                  profileImage
                    ? { uri: profileImage }
                    : require("../../assets/profile.png") // Fallback image
                }
              />
            </Pressable>
          ) : showLogout ? (
            <Pressable onPress={onLogout}>
              <Image
                style={styles.icon}
                source={require("../../assets/logout.png")}
              />
            </Pressable>
          ) : null}
        </View>
      </View>

      {/* Search Input */}
      {showSearchInput && (
        <TextInput
          style={styles.searchInput}
          onChangeText={onSearch}
          value={keyword}
          placeholder="Search for Service...."
          placeholderTextColor="#aaa"
        />
      )}
    </View>
  );
};
export default Header;

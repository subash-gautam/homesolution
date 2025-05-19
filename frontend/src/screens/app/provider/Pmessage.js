import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import backend from "../../../utils/api";
import { colors } from "../../../utils/colors";

const Pmessage = ({ navigation }) => {
  const [providerId, setProviderId] = useState(null);
  const [providerToken, setProviderToken] = useState(null);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch provider ID and token from AsyncStorage
  useEffect(() => {
    const getProviderData = async () => {
      try {
        const providerData = await AsyncStorage.getItem("providerData");
        const token = await AsyncStorage.getItem("providerToken");
        if (providerData) {
          const parsedData = JSON.parse(providerData);
          setProviderId(parsedData.id);
          if (token) {
            setProviderToken(token);
          }
        }
      } catch (error) {
        console.error("Error fetching provider data:", error);
        setError("Failed to load provider data");
        setLoading(false);
      }
    };

    getProviderData();
  }, []);

  // Define fetchUserList at component level for reuse in retry button
  const fetchUserList = async () => {
    if (!providerToken) return;

    try {
      setLoading(true);
      setError(null);

      // Log the request for debugging
      console.log(
        "Fetching users list from:",
        `${backend.backendUrl}/api/messages/chatList`
      );

      const response = await fetch(
        `${backend.backendUrl}/api/messages/chatList`,
        {
          headers: {
            Authorization: `Bearer ${providerToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response data:", data);
      setUserList(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error details:", err.message);
      setError("Failed to load users list");
      setLoading(false);
    }
  };

  // Use the fetchUserList function in the useEffect
  useEffect(() => {
    if (providerToken) {
      fetchUserList();
    }
  }, [providerToken]);

  // Render each user item
  const renderUserItem = ({ item }) => {
    // For debugging - log the item structure
    console.log("User item:", item);

    return (
      <TouchableOpacity
        style={styles.userContainer}
        onPress={() =>
          navigation.navigate("UserMessageScreen", {
            userId: item.userId,
            userName: item.name,
            userProfile: item.profile,
          })
        }
      >
        <Image
          source={
            item.profile
              ? { uri: `${backend.backendUrl}/Uploads/${item.profile}` }
              : require("../../../assets/profile.png")
          }
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.recipientName}>{item.name || "Unknown"}</Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            Tap to start a conversation
          </Text>
        </View>
        <View style={styles.timeContainer}>
          <Ionicons name="chevron-forward" size={20} color={colors.grey} />
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading users...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              fetchUserList();
            }}
          >
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Users</Text>
      </View>
      <FlatList
        data={userList}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.userId.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={50} color={colors.grey} />
            <Text style={styles.emptyText}>No users available</Text>
            <Text style={styles.emptySubText}>Check back later for users</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
  },
  listContainer: {
    padding: 10,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  recipientName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  lastMessage: {
    fontSize: 14,
    color: colors.grey,
    marginTop: 4,
  },
  timeContainer: {
    alignItems: "flex-end",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: colors.grey,
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: colors.danger,
    fontSize: 16,
  },
  retryButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
  retryText: {
    color: "#fff",
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 18,
    color: colors.grey,
    fontWeight: "500",
  },
  emptySubText: {
    marginTop: 5,
    fontSize: 14,
    color: colors.grey,
    textAlign: "center",
  },
});

export default Pmessage;

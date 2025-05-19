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

const Umessage = ({ navigation }) => {
  const [userId, setUserId] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null); // Added to store user profile
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user ID, token, and profile from AsyncStorage
  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        const token = await AsyncStorage.getItem("userToken");
        if (userData) {
          const parsedData = JSON.parse(userData);
          setUserId(parsedData.id);
          setUserProfile(parsedData.profile || null); // Assuming profile is stored in userData
          setUserToken(token);
        } else {
          throw new Error("No user data found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user data");
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  // Fetch chat list from backend
  const fetchChatList = async () => {
    if (!userToken || !userId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${backend.backendUrl}/api/messages/chatList`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setChatList(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      console.error("Fetch chat list error:", err.message);
      setError("Failed to load providers list");
      setLoading(false);
    }
  };

  // Create a new chat with a provider
  const createChat = async (providerId) => {
    if (!userToken || !userId) return null;

    try {
      const response = await fetch(
        `${backend.backendUrl}/api/messages/createChat`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            providerId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Error creating chat:", err.message);
      setError("Failed to start a new conversation");
      return null;
    }
  };

  // Handle chat press
  const handleChatPress = async (providerId, providerName, providerProfile) => {
    try {
      // Check if chat exists
      const chat = await fetch(
        `${backend.backendUrl}/api/messages/chat?userId=${userId}&providerId=${providerId}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (!chat.ok) {
        // If chat doesn't exist, create a new one
        const newChat = await createChat(providerId);
        if (!newChat) throw new Error("Failed to create chat");
      }

      console.log("Navigating with userProfile:", userProfile); // Debug log
      navigation.navigate("ProviderMessage", {
        userId,
        providerId,
        providerName,
        providerProfile,
        userProfile, // Pass userProfile to ProviderMessageScreen
      });
    } catch (error) {
      console.error("Chat navigation error:", error);
      setError("Failed to open chat");
    }
  };

  useEffect(() => {
    if (userToken && userId) {
      fetchChatList();
    }
  }, [userToken, userId]);

  const renderChatItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.chatContainer}
        onPress={() =>
          handleChatPress(item.providerId, item.name, item.profile)
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
        <View style={styles.chatInfo}>
          <Text style={styles.recipientName}>{item.name || "Unknown"}</Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage || "Tap to start a conversation"}
          </Text>
        </View>
        <View style={styles.timeContainer}>
          {item.lastMessageTime && (
            <Text style={styles.lastMessageTime}>
              {new Date(item.lastMessageTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          )}
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unreadCount}</Text>
            </View>
          )}
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
          <Text style={styles.loadingText}>Loading providers...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchChatList}>
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
        <Text style={styles.headerTitle}>Service Providers</Text>
      </View>
      <FlatList
        data={chatList}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.providerId.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={50} color={colors.grey} />
            <Text style={styles.emptyText}>No providers available</Text>
            <Text style={styles.emptySubText}>
              Check back later for service providers
            </Text>
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
  chatContainer: {
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
    width: 20,
    height: 20,
    borderRadius: 25,
    marginRight: 12,
  },
  chatInfo: {
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
  lastMessageTime: {
    fontSize: 12,
    color: colors.grey,
    marginBottom: 4,
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  unreadCount: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
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

export default Umessage;

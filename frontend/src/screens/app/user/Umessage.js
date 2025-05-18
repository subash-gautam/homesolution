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
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user ID and token from AsyncStorage
  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        const token = await AsyncStorage.getItem("userToken");
        if (userData) {
          const parsedData = JSON.parse(userData);
          setUserId(parsedData.id);
          if (token) {
            setUserToken(token);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user data");
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  // Fetch providers with whom the user has chatted
  useEffect(() => {
    const fetchProviders = async () => {
      if (!userId || !userToken) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${backend.backendUrl}/api/messages/providers?userId=${userId}`,
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
        setProviders(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load providers");
        console.error("Fetch error:", err);
        setLoading(false);
      }
    };

    fetchProviders();
  }, [userId, userToken]);

  // Render each provider item
  const renderProviderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.providerContainer}
        onPress={() =>
          navigation.navigate("ProviderProfileScreen", {
            providerId: item.id,
            service: item.service || {}, // Pass service if available, or empty object
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
        <View style={styles.providerInfo}>
          <Text style={styles.providerName}>{item.name}</Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage?.message || "No messages yet"}
          </Text>
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.lastMessageTime}>
            {item.lastMessage?.SentAt
              ? new Date(item.lastMessage.SentAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}
          </Text>
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
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setLoading(true);
              setError(null);
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
        <Text style={styles.headerTitle}>Messages</Text>
      </View>
      <FlatList
        data={providers}
        renderItem={renderProviderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={50}
              color={colors.grey}
            />
            <Text style={styles.emptyText}>No conversations yet</Text>
            <Text style={styles.emptySubText}>
              Start a chat with a provider to see them here
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
  providerContainer: {
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
  providerInfo: {
    flex: 1,
  },
  providerName: {
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

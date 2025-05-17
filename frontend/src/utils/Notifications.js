import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { socket } from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Notifications = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to fetch notifications

    const fetchNotifications = async () => {
      try {
        setLoading(true);

        // Get token and provider from AsyncStorage
        const token = await AsyncStorage.getItem("token");
        const provider = await AsyncStorage.getItem("provider");

        console.log("🔑 Token:", token);
        console.log("👤 Provider:", provider);

        if (socket && socket.connected) {
          // Emit with token and provider (if your server expects them)
          socket.emit("get-notifications", { token, provider });

          // Listen for response
          socket.once("notifications-list", (data) => {
            console.log("📬 Received notifications:", data);
            setNotifications(data || []);
            // Optionally save to AsyncStorage
            // await AsyncStorage.setItem("notifications", JSON.stringify(data));
            setLoading(false);
          });
        } else {
          console.log("Socket not connected, can't fetch notifications");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setLoading(false);
      }
    };

    fetchNotifications();

    // Listen for new notifications while on this screen
    const handleNewNotification = (notification) => {
      console.log("📩 New notification received:", notification);
      setNotifications((prev) => [notification, ...prev]);
    };

    socket.on("new-notification", handleNewNotification);

    // Clean up
    return () => {
      socket.off("new-notification", handleNewNotification);
    };
  }, []);

  const markAsRead = (notificationId) => {
    // Mark notification as read locally
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === notificationId ? { ...item, read: true } : item
      )
    );

    // Inform server
    if (socket && socket.connected) {
      socket.emit("notification-read", { notificationId });
    }
  };

  const handleNotificationPress = (notification) => {
    // Mark as read
    markAsRead(notification.id);

    // Navigate based on notification type
    if (notification.data && notification.data.type) {
      switch (notification.data.type) {
        case "message":
          navigation.navigate("Chat", { id: notification.data.id });
          break;
        case "order":
          navigation.navigate("OrderDetails", { id: notification.data.id });
          break;
        // Add more navigation cases based on your app's needs
        default:
          // Default navigation or action
          break;
      }
    }
  };

  const renderNotification = ({ item }) => {
    return (
      <TouchableOpacity
        style={[
          styles.notificationItem,
          !item.read && styles.unreadNotification,
        ]}
        onPress={() => handleNotificationPress(item)}
      >
        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationBody}>{item.message}</Text>
          <Text style={styles.notificationTime}>
            {new Date(item.timestamp).toLocaleString()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>

      {loading ? (
        <View style={styles.centered}>
          <Text>Loading notifications...</Text>
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.centered}>
          <Text>No notifications yet</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 15,
    marginHorizontal: 10,
  },
  notificationItem: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadNotification: {
    borderLeftWidth: 5,
    borderLeftColor: "#3498db",
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  notificationBody: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  notificationTime: {
    fontSize: 12,
    color: "#999",
    alignSelf: "flex-end",
  },
  listContent: {
    paddingBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Notifications;

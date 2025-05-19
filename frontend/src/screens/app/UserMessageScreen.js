import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import backend from "../../utils/api";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../utils/colors";
const UserMessageScreen = ({ route, navigation }) => {
  const { userId, userName, userProfile } = route.params;

  const [providerId, setProviderId] = useState(null);
  const [providerToken, setProviderToken] = useState(null);
  const [messages, setMessages] = useState([]);
  const [providerProfile, setProviderProfile] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);

  const scrollViewRef = useRef();

  // Get provider data
  useEffect(() => {
    const getProviderData = async () => {
      try {
        const providerData = await AsyncStorage.getItem("providerData");
        const token = await AsyncStorage.getItem("providerToken");

        if (providerData) {
          const parsed = JSON.parse(providerData);

          // Log full provider data
          console.log("Provider Data:", parsed);

          // Log only the profile field to verify
          console.log("Provider Profile in AsyncStorage:", parsed.profile);

          setProviderId(parsed.id);

          if (parsed.profile) {
            setProviderProfile(parsed.profile);
          } else {
            console.warn("Provider profile not found in storage");
          }
        }

        if (token) {
          setProviderToken(token);
        }
      } catch (err) {
        console.error("Error fetching provider data:", err);
      }
    };

    getProviderData();
  }, []);

  // Fetch chat history
  const fetchMessages = async (showLoading = true) => {
    if (!userId || !providerId || !providerToken) return;
    try {
      if (showLoading) setChatLoading(true);
      const response = await fetch(
        `${backend.backendUrl}/api/messages/chat?providerId=${providerId}&userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${providerToken}`,
          },
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      if (showLoading) setLoading(false);
      setChatLoading(false);
    }
  };

  useEffect(() => {
    if (providerToken && userId && providerId) {
      fetchMessages();
    }
  }, [providerToken, userId, providerId]);

  // Poll for new messages every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (userId && providerId && providerToken) {
        fetchMessages(false);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [userId, providerId, providerToken]);

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const tempId = `temp-${Date.now()}`;
    const messageToSend = {
      id: tempId,
      message: newMessage,
      providerId,
      userId,
      senderType: "provider",
      SentAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, messageToSend]);
    setNewMessage("");

    try {
      const response = await fetch(`${backend.backendUrl}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${providerToken}`,
        },
        body: JSON.stringify({
          userId,
          message: newMessage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      fetchMessages(false); // Refresh latest messages
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Render message item
  const renderMessageItem = ({ item }) => {
    const isFromProvider = item.sender === "provider";
    return (
      <View
        style={[
          styles.messageContainer,
          isFromProvider ? styles.userMessage : styles.providerMessage,
        ]}
      >
        {!isFromProvider && (
          <Image
            source={
              userProfile
                ? { uri: `${backend.backendUrl}/Uploads/${userProfile}` }
                : require("../../assets/profile.png")
            }
            style={styles.avatar}
          />
        )}
        <View
          style={[
            styles.messageBubble,
            isFromProvider ? styles.providerBubble : styles.userBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isFromProvider ? styles.providerText : styles.userText,
            ]}
          >
            {item.message}
          </Text>
          <Text
            style={[
              styles.messageTime,
              isFromProvider ? styles.providerTime : styles.userTime,
            ]}
          >
            {new Date(item.SentAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
        {isFromProvider && (
          <Image
            source={
              providerProfile
                ? { uri: `${backend.backendUrl}/Uploads/${providerProfile}` }
                : require("../../assets/profile.png")
            }
            style={styles.avatar}
          />
        )}
      </View>
    );
  };
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading messages...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.chatContainer}
        keyboardVerticalOffset={60}
      >
        {/* Chat Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{userName}</Text>
        </View>

        {/* Messages List */}
        {chatLoading ? (
          <View style={styles.chatLoadingContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={messages}
            renderItem={renderMessageItem}
            keyExtractor={(item) =>
              item.id?.toString() || Math.random().toString()
            }
            contentContainerStyle={styles.messagesContainer}
            ref={scrollViewRef}
            onContentSizeChange={() =>
              scrollViewRef.current?.scrollToEnd({ animated: true })
            }
            ListEmptyComponent={
              <View style={styles.emptyChat}>
                <Ionicons
                  name="chatbubble-outline"
                  size={50}
                  color={colors.grey}
                />
                <Text style={styles.emptyChatText}>No messages yet</Text>
                <Text style={styles.emptyChatSubText}>
                  Tap below to start a conversation
                </Text>
              </View>
            }
          />
        )}

        {/* Message Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !newMessage.trim() && styles.sendButtonDisabled,
            ]}
            onPress={sendMessage}
            disabled={!newMessage.trim()}
          >
            <Ionicons name="send" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  chatContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 16,
    color: colors.text,
  },
  messagesContainer: {
    padding: 10,
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 4,
  },
  providerMessage: {
    justifyContent: "flex-start",
  },
  userMessage: {
    justifyContent: "flex-end",
  },
  messageBubble: {
    maxWidth: "70%",
    borderRadius: 20,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  providerBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
    marginLeft: 10,
  },
  userBubble: {
    backgroundColor: "#ffffff",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginRight: 10,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  providerText: {
    color: "#fff",
  },
  userText: {
    color: "#333",
  },
  messageTime: {
    fontSize: 11,
    marginTop: 6,
  },
  providerTime: {
    color: "#fff",
    opacity: 0.9,
    alignSelf: "flex-end",
  },
  userTime: {
    color: "#666",
    alignSelf: "flex-end",
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 8,
  },
  inputContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: 30,
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#cccccc",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: colors.grey,
  },
  emptyChat: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  emptyChatText: {
    marginTop: 10,
    fontSize: 18,
    color: colors.grey,
    fontWeight: "500",
  },
  emptyChatSubText: {
    marginTop: 5,
    fontSize: 14,
    color: colors.grey,
    textAlign: "center",
  },
});
export default UserMessageScreen;

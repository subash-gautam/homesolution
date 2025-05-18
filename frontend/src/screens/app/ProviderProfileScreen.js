import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Linking,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../utils/colors";
import backend from "../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProviderProfileScreen = ({ route, navigation }) => {
  const { providerId, service: selectedService } = route.params;
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userToken, setUserToken] = useState(null);

  // Chat related states
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const scrollViewRef = useRef();

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
      }
    };

    getUserData();
  }, []);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const providerResponse = await fetch(
          `${backend.backendUrl}/api/providers/${providerId}`,
          { signal: abortController.signal }
        );

        if (!providerResponse.ok) {
          throw new Error(`HTTP error! Status: ${providerResponse.status}`);
        }

        const providerData = await providerResponse.json();

        if (!abortController.signal.aborted) {
          setProvider({
            ...providerData,
            ratePerHr: Number(providerData.ratePerHr) || 0,
          });
          setLoading(false);
        }
      } catch (err) {
        if (!abortController.signal.aborted) {
          setError(err.message);
          console.error("Fetch error:", err);
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => abortController.abort();
  }, [providerId]);

  // Fetch chat messages when chat is opened
  useEffect(() => {
    if (showChat && userId && providerId) {
      fetchMessages();
    }
  }, [showChat, userId, providerId]);

  // Setup real-time message update (polling)
  useEffect(() => {
    let intervalId;

    if (showChat && userId && providerId) {
      intervalId = setInterval(() => {
        fetchMessages(false); // false means don't show loading indicator
      }, 5000); // Poll every 5 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [showChat, userId, providerId]);

  const fetchMessages = async (showLoading = true) => {
    if (!userId || !providerId || !userToken) return;

    try {
      if (showLoading) setChatLoading(true);

      const response = await fetch(
        `${backend.backendUrl}/api/messages/chat?userId=${userId}&providerId=${providerId}`,
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
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      if (showLoading) setChatLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !userId || !providerId || !userToken) return;

    try {
      const response = await fetch(`${backend.backendUrl}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          providerId: providerId,
          message: message.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();

      // Add message to the list immediately for better UX
      const newMessage = {
        id: responseData.id || Date.now().toString(), // Use returned ID or fallback to timestamp
        userId: userId,
        providerId: providerId,
        message: message.trim(),
        sender: "user",
        SentAt: responseData.SentAt || new Date().toISOString(),
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage("");

      // Fetch latest messages to ensure consistency
      fetchMessages(false);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading provider...</Text>
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

  if (!provider) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Provider not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Renders a star rating UI with filled, half-filled and empty stars
  const renderStarRating = (rating) => {
    const maxStars = 5;
    const starRating = rating || 0;

    const renderStars = () => {
      const stars = [];

      for (let i = 1; i <= maxStars; i++) {
        if (i <= Math.floor(starRating)) {
          // Full star
          stars.push(
            <Ionicons
              key={`star-${i}`}
              name="star"
              size={16}
              color="#FFD700"
              style={styles.starIcon}
            />
          );
        } else if (i === Math.ceil(starRating) && starRating % 1 !== 0) {
          // Half star
          stars.push(
            <Ionicons
              key={`star-${i}`}
              name="star-half"
              size={16}
              color="#FFD700"
              style={styles.starIcon}
            />
          );
        } else {
          // Empty star
          stars.push(
            <Ionicons
              key={`star-${i}`}
              name="star-outline"
              size={16}
              color="#FFD700"
              style={styles.starIcon}
            />
          );
        }
      }

      return stars;
    };

    return (
      <View style={styles.starRatingContainer}>
        {renderStars()}
        <Text style={styles.ratingText}>
          ({rating ? rating.toFixed(1) : "0.0"})
        </Text>
      </View>
    );
  };

  // Render Chat UI
  const renderChatUI = () => {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.chatContainer}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 30}
      >
        <View style={styles.chatHeader}>
          <TouchableOpacity onPress={() => setShowChat(false)}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.chatHeaderTitle}>Chat with {provider.name}</Text>
        </View>

        {chatLoading ? (
          <View style={styles.chatLoadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading messages...</Text>
          </View>
        ) : (
          <FlatList
            data={messages}
            ref={scrollViewRef}
            style={styles.messagesList}
            contentContainerStyle={styles.messagesContainer}
            keyExtractor={(item) => item.id.toString()}
            onContentSizeChange={() => {
              scrollViewRef.current?.scrollToEnd({ animated: true });
            }}
            renderItem={({ item }) => {
              const isUser = item.sender === "user";
              return (
                <View
                  style={[
                    styles.messageBubble,
                    isUser ? styles.userMessage : styles.providerMessage,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      isUser
                        ? styles.userMessageText
                        : styles.providerMessageText,
                    ]}
                  >
                    {item.message}
                  </Text>
                  <Text style={styles.messageTime}>
                    {new Date(item.SentAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
              );
            }}
            ListEmptyComponent={
              <View style={styles.emptyChat}>
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={50}
                  color={colors.grey}
                />
                <Text style={styles.emptyChatText}>No messages yet</Text>
                <Text style={styles.emptyChatSubText}>
                  Send a message to start the conversation
                </Text>
              </View>
            }
          />
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !message.trim() && styles.sendButtonDisabled,
            ]}
            onPress={sendMessage}
            disabled={!message.trim()}
          >
            <Ionicons name="send" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {showChat ? (
        renderChatUI()
      ) : (
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={colors.primary} />
            </TouchableOpacity>
            <Text style={styles.title}>{provider.name}'s Profile</Text>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.profileSection}>
              <Image
                source={
                  provider.profile
                    ? {
                        uri: `${backend.backendUrl}/uploads/${provider.profile}`,
                      }
                    : require("../../assets/profile.png")
                }
                style={styles.profileImage}
              />

              <Text style={styles.providerName}>{provider.name}</Text>
              <Text style={styles.bioText}>{provider.bio}</Text>
              {renderStarRating(provider.averageRating)}

              <View style={styles.infoRow}>
                <Ionicons name="cash-outline" size={20} color={colors.grey} />
                <Text style={styles.infoText}>
                  Rs. {provider.ratePerHr} per hour
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons
                  name="location-outline"
                  size={20}
                  color={colors.grey}
                />
                <Text style={styles.infoText}>{provider.address}</Text>
              </View>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              <View style={styles.contactInfo}>
                {provider.phone ? (
                  <TouchableOpacity
                    onPress={() => Linking.openURL(`tel:${provider.phone}`)}
                    style={styles.contactRow}
                  >
                    <View style={styles.contactIcon}>
                      <Ionicons
                        name="call-outline"
                        size={20}
                        color={colors.primary}
                      />
                    </View>
                    <Text style={styles.contactText}>{provider.phone}</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.contactRow}>
                    <View style={styles.contactIcon}>
                      <Ionicons
                        name="call-outline"
                        size={20}
                        color={colors.primary}
                      />
                    </View>
                    <Text style={styles.contactText}>Not available</Text>
                  </View>
                )}

                {provider.email ? (
                  <TouchableOpacity
                    onPress={() => Linking.openURL(`mailto:${provider.email}`)}
                    style={styles.contactRow}
                  >
                    <View style={styles.contactIcon}>
                      <Ionicons
                        name="mail-outline"
                        size={20}
                        color={colors.primary}
                      />
                    </View>
                    <Text style={styles.contactText}>{provider.email}</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.contactRow}>
                    <View style={styles.contactIcon}>
                      <Ionicons
                        name="mail-outline"
                        size={20}
                        color={colors.primary}
                      />
                    </View>
                    <Text style={styles.contactText}>Not provided</Text>
                  </View>
                )}

                {/* Chat button */}
                <TouchableOpacity
                  style={styles.contactRow}
                  onPress={() => setShowChat(true)}
                >
                  <View style={styles.contactIcon}>
                    <Ionicons
                      name="chatbubble-outline"
                      size={20}
                      color={colors.primary}
                    />
                  </View>
                  <Text style={styles.contactText}>Chat with provider</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <View style={styles.bottomContainer}>
            <TouchableOpacity
              style={styles.bookNowButton}
              onPress={() =>
                navigation.navigate("BookService", {
                  service: selectedService,
                  provider: provider,
                })
              }
            >
              <Text style={styles.bookNowText}>Book This Provider</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  starRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    justifyContent: "center",
  },
  starIcon: {
    marginHorizontal: 1,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: colors.accent,
    fontWeight: "600",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 16,
    color: colors.text,
  },
  content: {
    flex: 1,
    marginBottom: 70,
  },
  profileSection: {
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  providerName: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  bioText: {
    fontSize: 14,
    color: colors.grey,
    textAlign: "center",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    width: "100%",
    paddingHorizontal: 20,
  },
  infoText: {
    marginLeft: 12,
    fontSize: 14,
    color: colors.text,
    flexShrink: 1,
  },
  sectionContainer: {
    backgroundColor: "#fff",
    padding: 16,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: colors.text,
  },
  contactInfo: {
    marginTop: 4,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  contactIcon: {
    width: 30,
  },
  contactText: {
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bookNowButton: {
    backgroundColor: colors.accent,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 8,
  },
  bookNowText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    marginRight: 8,
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
  loadingText: {
    marginTop: 10,
    color: colors.grey,
    fontSize: 14,
  },

  // Chat UI styles
  chatContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  chatHeaderTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 16,
    color: colors.text,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  messagesContainer: {
    padding: 10,
    paddingBottom: 15,
  },
  messageBubble: {
    maxWidth: "75%",
    borderRadius: 16,
    padding: 12,
    marginVertical: 5,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: colors.primary,
  },
  providerMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#e5e5e5",
  },
  messageText: {
    fontSize: 16,
  },
  userMessageText: {
    color: "#fff",
  },
  providerMessageText: {
    color: colors.text,
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: "flex-end",
    opacity: 0.7,
    color: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: 30,
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  sendButtonDisabled: {
    backgroundColor: "#cccccc",
  },
  chatLoadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  },
});

export default ProviderProfileScreen;

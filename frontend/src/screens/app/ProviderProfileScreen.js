import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../utils/colors";

const ProviderProfileScreen = ({ route, navigation }) => {
  const { provider, service } = route.params;

  // Mock reviews data
  const reviews = [
    {
      id: 1,
      user: "Raj Kumar",
      rating: 5,
      comment:
        "Excellent service, very professional and thorough in their work.",
      date: "12 Feb 2025",
    },
    {
      id: 2,
      user: "Priya Singh",
      rating: 4,
      comment: "Good service overall. Came on time and did a decent job.",
      date: "28 Jan 2025",
    },
    {
      id: 3,
      user: "Amit Patel",
      rating: 5,
      comment: "Outstanding work! Will definitely hire again for my next job.",
      date: "15 Jan 2025",
    },
  ];

  const renderReview = ({ item }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.userInfo}>
          <View style={styles.userInitial}>
            <Text style={styles.initialText}>{item.user.charAt(0)}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{item.user}</Text>
            <Text style={styles.reviewDate}>{item.date}</Text>
          </View>
        </View>
        <View style={styles.reviewRating}>
          {[...Array(5)].map((_, index) => (
            <Ionicons
              key={index}
              name={index < item.rating ? "star" : "star-outline"}
              size={16}
              color={colors.accent}
            />
          ))}
        </View>
      </View>
      <Text style={styles.reviewComment}>{item.comment}</Text>
    </View>
  );

  const renderStars = (rating) => {
    return (
      <View style={styles.starsContainer}>
        {[...Array(5)].map((_, index) => (
          <Ionicons
            key={index}
            name={
              index < Math.floor(rating)
                ? "star"
                : index < rating
                ? "star-half"
                : "star-outline"
            }
            size={20}
            color={colors.accent}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Provider Profile</Text>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.profileSection}>
            <Image source={provider.image} style={styles.profileImage} />
            <Text style={styles.providerName}>{provider.name}</Text>
            <View style={styles.ratingMainContainer}>
              {renderStars(provider.rating)}
              <Text style={styles.ratingText}>
                {provider.rating} ({provider.reviews} reviews)
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons
                name="briefcase-outline"
                size={20}
                color={colors.grey}
              />
              <Text style={styles.infoText}>
                Experience: {provider.experience}
              </Text>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Services Offered</Text>
            <View style={styles.servicesList}>
              {provider.services.map((item, index) => (
                <View key={index} style={styles.serviceItem}>
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={colors.primary}
                  />
                  <Text style={styles.serviceText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={styles.contactInfo}>
              <View style={styles.contactRow}>
                <Ionicons
                  name="call-outline"
                  size={20}
                  color={colors.primary}
                />
                <Text style={styles.contactText}>{provider.contactNumber}</Text>
              </View>
              <View style={styles.contactRow}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={colors.primary}
                />
                <Text style={styles.contactText}>{provider.email}</Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.sectionTitle}>Reviews</Text>
              <Text style={styles.reviewsCount}>
                {provider.reviews} reviews
              </Text>
            </View>
            <FlatList
              data={reviews}
              renderItem={renderReview}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              nestedScrollEnabled={true}
            />
          </View>
        </ScrollView>

        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.bookNowButton}
            onPress={() =>
              navigation.navigate("BookService", { service, provider })
            }
          >
            <Text style={styles.bookNowText}>Book This Provider</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
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
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 16,
    color: colors.text,
  },
  content: {
    flex: 1,
    marginBottom: 70, // Space for the bottom button
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
  },
  ratingMainContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    color: colors.grey,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.text,
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
  servicesList: {
    marginBottom: 8,
  },
  serviceItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  serviceText: {
    marginLeft: 12,
    fontSize: 16,
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
  contactText: {
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
  reviewsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  reviewsCount: {
    color: colors.grey,
    fontSize: 14,
  },
  reviewCard: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userInitial: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  initialText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  reviewDate: {
    fontSize: 12,
    color: colors.grey,
  },
  reviewRating: {
    flexDirection: "row",
  },
  reviewComment: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
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
});

export default ProviderProfileScreen;

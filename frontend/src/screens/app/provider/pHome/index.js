import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "../../../../components/HomeHeader";
import MainContent from "../../../../components/MainContentProvider";

const Phome = ({ navigation }) => {
  const handleSearch = (text) => {
    console.log("Searching:", text);
  };

  const handleJobPress = (jobId) => {
    console.log("Job pressed:", jobId);
  };

  const handleSeeAll = () => {
    console.log("See all pressed");
  };

  const handleNotificationPress = () => {
    // Handle notification press
  };

  const handleProfilePress = () => {
    navigation.navigate("profile");
  };
  const sampleStats = [
    { label: "Total Jobs", value: "125" },
    { label: "Rating", value: "4.8" },
    { label: "Completed", value: "95%" },
  ];

  const sampleJobs = [
    {
      id: 1,
      title: "Plumbing Repair",
      price: "1500",
      datetime: "Today, 2:00 PM",
      location: "Lakeside, Pokhara",
    },
    {
      id: 2,
      title: "Pipe Fixing",
      price: "2000",
      datetime: "Tomorrow, 10:00 AM",
      location: "Bagar, Pokhara",
    },
  ];

  const sampleEarnings = {
    today: "3500",
    weekly: "25000",
    monthly: "95000",
  };

  return (
    <View style={styles.container}>
      <Header
        title="Provider Home Screen"
        showBack={false}
        showSearch={true}
        onSearch={handleSearch}
        showNotification={true}
        onNotificationPress={handleNotificationPress}
        showProfile={true}
        onProfilePress={handleProfilePress}
        showLogout={false}
      />

      <View>
        {
          <MainContent
            stats={sampleStats}
            jobs={sampleJobs}
            earnings={sampleEarnings}
            onJobPress={handleJobPress}
            onSeeAll={handleSeeAll}
          />
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    padding: 16,
  },
});

export default Phome;

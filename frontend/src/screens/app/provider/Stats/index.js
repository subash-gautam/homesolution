import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "../../../../components/HomeHeader";
import StatsComponent from "../../../../components/StatsContent";

const Stats = () => {
  const sampleEarnings = {
    today: "3500",
    weekly: "25000",
    monthly: "95000",
  };
  const sampleStats = [
    { label: "Total Jobs", value: "125" },
    { label: "Rating", value: "4.8" },
    { label: "Completed", value: "95%" },
  ];
  const handleSeeAll = () => {
    console.log("See all pressed");
  };
  return (
    <View style={styles.container}>
      <Header title="Statistics" showBack={true} />

      <View>
        {
          <StatsComponent
            stats={sampleStats}
            earnings={sampleEarnings}
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

export default Stats;

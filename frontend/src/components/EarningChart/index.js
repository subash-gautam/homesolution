import React from "react";
import { View, Text, Dimensions } from "react-native";
import { LineChart } from "@rainbow-me/animated-charts";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const EarningsChart = ({ earnings }) => {
  // Transform the data for the chart
  const points = [
    { timestamp: 0, value: parseInt(earnings.today) },
    { timestamp: 1, value: parseInt(earnings.weekly) },
    { timestamp: 2, value: parseInt(earnings.monthly) },
  ];

  const formatUSD = (value) => {
    "worklet";
    if (value === "") {
      return "";
    }
    return `$${value.toLocaleString("en-US")}`;
  };

  return (
    <GestureHandlerRootView>
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 12,
          padding: 15,
          margin: 10,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            marginBottom: 15,
          }}
        >
          Earnings Overview
        </Text>

        <LineChart.Provider data={points}>
          <LineChart width={Dimensions.get("window").width - 60} height={220}>
            <LineChart.Path color="#8b5cf6" width={3} />
            <LineChart.CursorCrosshair color="#8b5cf6" />
          </LineChart>

          <LineChart.PriceText
            format={formatUSD}
            style={{
              fontSize: 20,
              fontWeight: "600",
              color: "#1F2937",
            }}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
              paddingHorizontal: 10,
            }}
          >
            <Text style={{ color: "#6B7280" }}>Today</Text>
            <Text style={{ color: "#6B7280" }}>Weekly</Text>
            <Text style={{ color: "#6B7280" }}>Monthly</Text>
          </View>
        </LineChart.Provider>
      </View>
    </GestureHandlerRootView>
  );
};

export default EarningsChart;

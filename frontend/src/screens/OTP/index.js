import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";

const OTPScreen = ({ route }) => {
  const { phoneNumber, actorType } = route.params;
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move focus to the next input box
    if (text && index < otp.length - 1) {
      // Focus next input
    }
  };

  const handleSubmit = () => {
    const otpString = otp.join("");
    // Call API to verify OTP
    fetch("https://your-backend.com/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber, otp: otpString, actorType }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "OTP verified successfully") {
          Alert.alert("Success", "OTP verified successfully");
        } else {
          Alert.alert("Error", data.message);
        }
      })
      .catch((error) => {
        Alert.alert("Error", "Failed to verify OTP");
      });
  };

  const handleResendOtp = () => {
    if (timer === 0) {
      fetch("https://your-backend.com/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, actorType }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "OTP sent successfully") {
            setTimer(30); // Reset timer
            Alert.alert("Success", "OTP resent successfully");
          } else {
            Alert.alert("Error", data.message);
          }
        })
        .catch((error) => {
          Alert.alert("Error", "Failed to resend OTP");
        });
    } else {
      Alert.alert("Please wait", `You can resend OTP in ${timer}s`);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Enter OTP sent to {phoneNumber}</Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 20,
        }}
      >
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              width: 40,
              height: 40,
              textAlign: "center",
            }}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleOtpChange(text, index)}
          />
        ))}
      </View>
      <TouchableOpacity onPress={handleSubmit} style={{ marginTop: 20 }}>
        <Text style={{ color: "blue" }}>Submit</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleResendOtp} style={{ marginTop: 10 }}>
        <Text style={{ color: "blue" }}>
          Resend OTP {timer > 0 ? `(${timer}s)` : ""}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default OTPScreen;

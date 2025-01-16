import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import styles from "./styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const Input = ({
  iconName,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  autoCapitalize = "none",
  secureTextEntry = false,
  error,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <View>
      <View style={styles.inputContainer}>
        <MaterialIcons
          name={iconName}
          size={20}
          color="#666"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          keyboardType={keyboardType}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize={autoCapitalize}
          secureTextEntry={!isPasswordVisible && secureTextEntry}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <MaterialIcons
              name={isPasswordVisible ? "visibility" : "visibility-off"}
              size={20}
              color="#666"
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default Input;

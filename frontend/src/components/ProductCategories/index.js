import React from "react";
import { View, Text, FlatList, Pressable, Image } from "react-native";
import styles from "./styles";
const ProductCategories = ({ categories = [], onCategoryPress }) => {
  const renderCategory = ({ item }) => (
    <Pressable
      style={styles.categoryItem}
      onPress={() => onCategoryPress && onCategoryPress(item)}
    >
      <Image
        source={item.icon}
        style={styles.categoryIcon}
        resizeMode="contain"
      />
      <Text style={styles.categoryText}>{item.name}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Services categories</Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default ProductCategories;

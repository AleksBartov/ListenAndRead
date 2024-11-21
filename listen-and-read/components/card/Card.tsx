import { StyleSheet, Text, View } from "react-native";
import React from "react";

const Card = ({
  maxVisibleItems,
  dataLength,
  item,
  index,
  newData,
  setNewData,
  currentIndex,
  setCurrentIndex,
  animatedValue,
}) => {
  return (
    <View style={[styles.container, { backgroundColor: item.bg }]}>
      <Text>{item.text}</Text>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({ container: {} });

import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  FadeInDown,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { BORDER_RADIUS, CARD_HEIGHT, CARD_WIDTH } from "@/constants/data/DATA";
import Voice from "@react-native-voice/voice";

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
  toStartsListenning,
}) => {
  const { width } = useWindowDimensions();
  let [started, setStarted] = useState(false);
  let [results, setResults] = useState([""]);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const direction = useSharedValue(0);

  useEffect(() => {
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    // if (index === currentIndex) startSpeechToText();
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startSpeechToText = async () => {
    await Voice.start("ru");
    setStarted(true);
  };

  const stopSpeechToText = async () => {
    await Voice.stop();
    setStarted(false);
  };

  const onSpeechResults = (result) => {
    setResults(result.value);
    console.log([...result.value]);
  };

  const onSpeechError = (error) => {
    console.log(error);
  };

  useAnimatedReaction(
    () => toStartsListenning.value,
    (v) => {
      if (v === index) {
        runOnJS(startSpeechToText)();
      }
    },
    [toStartsListenning]
  );

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      const isSwipeRight = e.translationX > 0;
      direction.value = isSwipeRight ? 1 : -1;

      if (currentIndex === index) {
        translateX.value = e.translationX;
        animatedValue.value = interpolate(
          Math.abs(e.translationX),
          [0, width],
          [index, index + 1]
        );
      }
    })
    .onEnd((e) => {
      if (currentIndex === index) {
        if (Math.abs(e.translationX) > 150 || Math.abs(e.velocityX) > 1000) {
          translateX.value = withTiming(width * direction.value, {}, () => {
            runOnJS(setNewData)([...newData, newData[currentIndex]]);
            runOnJS(setCurrentIndex)(currentIndex + 1);
            runOnJS(stopSpeechToText)();
          });
          animatedValue.value = withTiming(currentIndex + 1);
        } else {
          translateX.value = withSpring(0);
          animatedValue.value = withTiming(currentIndex);
        }
      }
    });

  const rStyle = useAnimatedStyle(() => {
    const currentItem = index === currentIndex;
    translateY.value = interpolate(
      animatedValue.value,
      [index - 1, index],
      [-40, 0]
    );
    const scale = interpolate(
      animatedValue.value,
      [index - 1, index],
      [0.9, 1]
    );
    const rotateZ = interpolate(
      Math.abs(translateX.value),
      [0, width],
      [0, 20]
    );
    const opacity = interpolate(
      animatedValue.value + maxVisibleItems,
      [index, index + 1],
      [0, 1]
    );
    return {
      transform: [
        { perspective: 1000 },
        { translateX: translateX.value },
        { translateY: currentItem ? 0 : translateY.value },
        { scale: currentItem ? 1 : scale },
        { rotateZ: currentItem ? `${direction.value * rotateZ}deg` : "0deg" },
      ],
      opacity: index < currentIndex + maxVisibleItems ? 1 : opacity,
    };
  });
  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        entering={FadeInDown.duration(
          index > maxVisibleItems + 1 ? 0 : index * 600
        )}
        style={{
          position: "absolute",
          justifyContent: "center",
          alignItems: "center",
          zIndex: dataLength - index,
        }}
      >
        <Animated.View
          style={[styles.container, { backgroundColor: item.bg }, rStyle]}
        >
          <Text>{item.text}</Text>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

export default Card;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: BORDER_RADIUS,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.6,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

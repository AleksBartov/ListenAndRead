import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Colors } from "@/constants/Colors";
import { CARD_HEIGHT, CARD_WIDTH } from "@/constants/Sizes";

const Front = ({
  startSpeechToText,
  rotateX,
  rotateY,
  scale,
  zIndexFront,
  keyWordLowerCase,
}) => {
  const started = useSharedValue(false);
  const style = useAnimatedStyle(() => ({
    transform: [
      { perspective: 800 },
      { rotateX: `${rotateX.value}deg` },
      { rotateY: `${rotateY.value}deg` },
      { scale: scale.value },
    ],
    zIndex: zIndexFront.value,
  }));

  const gestureFront = Gesture.Tap()
    .onBegin(() => {
      if (started.value) return;
    })
    .onEnd(() => {
      scale.value = withSpring(1);
      rotateX.value = withSpring(0);
      runOnJS(startSpeechToText)();
      started.value = true;
    });
  return (
    <GestureDetector gesture={gestureFront}>
      <Animated.View style={[styles.card_container, style]}>
        <Text style={styles.card_text}>{keyWordLowerCase}</Text>
      </Animated.View>
    </GestureDetector>
  );
};

export default Front;

const styles = StyleSheet.create({
  card_container: {
    position: "absolute",
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    backfaceVisibility: "hidden",
  },
  card_text: {
    color: Colors.blue,
    fontSize: 35,
    fontFamily: "Nunito_800ExtraBold",
  },
});

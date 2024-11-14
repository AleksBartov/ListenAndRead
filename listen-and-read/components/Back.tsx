import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Animated, {
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { Colors } from "@/constants/Colors";
import { CARD_HEIGHT, CARD_WIDTH } from "@/constants/Sizes";
import {
  Canvas,
  Image,
  Path,
  PathOp,
  Shadow,
  Skia,
  useImage,
  useTouchHandler,
  rect,
} from "@shopify/react-native-skia";
import { drawNoisyCircle } from "@/Tools";

const rct = rect(0, 0, CARD_WIDTH, CARD_HEIGHT);

const Back = ({ rotateX, rotateYBack, translateX, scale, zIndexBack }) => {
  const bg = useImage(require("../assets/images/bg.png"));
  const mask = useImage(require("../assets/images/mask.png"));
  const path = useSharedValue(Skia.Path.Make());
  const onTouch = useTouchHandler({
    onStart: (e) => {
      path.value = Skia.Path.MakeFromOp(
        path.value,
        drawNoisyCircle(e),
        PathOp.Union
      )!;
    },
    onActive: (e) => {
      path.value = Skia.Path.MakeFromOp(
        path.value,
        drawNoisyCircle(e),
        PathOp.Union
      )!;
    },
  });

  const styleBack = useAnimatedStyle(() => ({
    transform: [
      { perspective: 800 },
      { rotateX: `${rotateX.value}deg` },
      { rotateY: `${rotateYBack.value}deg` },
      { translateX: translateX.value },
      { scale: scale.value },
    ],
    zIndex: zIndexBack.value,
  }));
  return (
    <Animated.View
      exiting={SlideInRight}
      style={[styles.cardBackContainer, styleBack]}
    >
      <Canvas
        style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
        onTouch={onTouch}
      >
        <Image image={bg} rect={rct} fit="fill" />
        <Path path={path} color="white">
          <Shadow dx={0} dy={0} blur={2} color="rgba(0,0,0,0.5)" inner />
        </Path>
        <Image image={mask} rect={rct} fit="fill" />
      </Canvas>
    </Animated.View>
  );
};

export default Back;

const styles = StyleSheet.create({
  cardBackContainer: {
    position: "absolute",
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backfaceVisibility: "hidden",
  },
});

import { StyleSheet } from "react-native";
import React, { useState } from "react";
import Animated, {
  SlideInRight,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { CARD_HEIGHT, CARD_WIDTH } from "@/constants/Sizes";
import {
  Canvas,
  Path,
  PathOp,
  Skia,
  useTouchHandler,
  Mask,
  Group,
  RoundedRect,
  useSVG,
} from "@shopify/react-native-skia";
import { drawNoisyCircle } from "@/Tools";
import { Colors } from "@/constants/Colors";

const Back = ({ rotateX, rotateYBack, translateX, scale, zIndexBack }) => {
  const toClose = useSharedValue(false);
  const path = useSharedValue(Skia.Path.Make());
  const CARD_SQUER = Math.floor(CARD_HEIGHT * CARD_WIDTH);

  useAnimatedReaction(
    () => toClose.value,
    (e) => {
      if (e) translateX.value = withTiming(4 * CARD_WIDTH, { duration: 1000 });
    }
  );

  const handelPathLenght = (p) => {
    "worklet";
    const { width, height } = p;
    const DRAWN_SQUER = Math.floor(width * height);
    const PERSENTAGE = Math.floor((DRAWN_SQUER / CARD_SQUER) * 100);
    if (PERSENTAGE > 90) toClose.value = true;
    console.log(`DRIWEN_PROSENTAGE: ${PERSENTAGE}`);
  };

  const touchHandler = useTouchHandler({
    onStart: (e) => {
      path.value = Skia.Path.MakeFromOp(
        path.value,
        drawNoisyCircle(e),
        PathOp.Union
      );
    },
    onActive: (e) => {
      path.value = Skia.Path.MakeFromOp(
        path.value,
        drawNoisyCircle(e),
        PathOp.Union
      );
    },
    onEnd: () => {
      handelPathLenght(path.value.computeTightBounds());
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
        onTouch={touchHandler}
      >
        <RoundedRect
          x={0}
          y={0}
          width={CARD_WIDTH}
          height={CARD_HEIGHT}
          color={Colors.orange}
          r={16}
        />
        <Mask
          mode="luminance"
          mask={
            <Group>
              <RoundedRect
                x={0}
                y={0}
                width={CARD_WIDTH}
                height={CARD_HEIGHT}
                color="black"
                r={16}
              />
              <Path path={path} color="white" />
            </Group>
          }
        >
          <RoundedRect
            x={0}
            y={0}
            width={CARD_WIDTH}
            height={CARD_HEIGHT}
            color={Colors.yellow}
            r={16}
          />
        </Mask>
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

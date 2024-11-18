import { StyleSheet, useWindowDimensions } from "react-native";
import React from "react";
import Animated, {
  FadeIn,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
} from "react-native-reanimated";
import {
  Blur,
  Canvas,
  Group,
  RoundedRect,
  Shadow,
} from "@shopify/react-native-skia";

const ReanimCard = ({ progress, index }) => {
  const { width, height } = useWindowDimensions();
  const cardWidth = width * 0.8;
  const cardHeight = cardWidth * 1.618;
  const startY = 40 * index;
  const startBlur = 2 * index;
  const startScale =
    index === 1 ? 0.9 : index === 2 ? 0.8 : index === 3 ? 0.7 : 0.6;
  const Y = useSharedValue(startY);

  const firstScale = useDerivedValue(() => {
    return interpolate(progress.value, [1, 2], [startScale, startScale + 0.1]);
  }, []);

  const firstTransY = useDerivedValue(() => {
    Y.value = interpolate(progress.value, [1, 2], [startY, startY - 40]);
    return height / 2 - cardHeight / 2 - Y.value - 75;
  }, []);

  const firstBlur = useDerivedValue(() => {
    return startBlur - progress.value;
  }, []);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 300 },
        {
          translateX: width / 2 - cardWidth / 2 - 75,
        },
        { translateY: firstTransY.value },
        { scale: firstScale.value },
      ],
    };
  }, []);

  return (
    <Animated.View
      entering={FadeIn.delay(1 * 250)}
      onTouchEnd={() => (progress.value = withSpring(2))}
      style={[
        {
          ...StyleSheet.absoluteFill,

          width: cardWidth + 150,
          height: cardHeight + 150,
        },
        rStyle,
      ]}
    >
      <Canvas style={{ width: cardWidth + 150, height: cardHeight + 150 }}>
        <Group>
          <RoundedRect
            x={75}
            y={75}
            width={cardWidth}
            height={cardHeight}
            r={25}
            color={index % 2 ? "snow" : "cyan"}
          />
          <Blur blur={firstBlur} />
          <Shadow dx={5} dy={5} blur={6} color={"rgba(0,0,0,0.4)"} />
        </Group>
      </Canvas>
    </Animated.View>
  );
};

export default ReanimCard;

const styles = StyleSheet.create({});

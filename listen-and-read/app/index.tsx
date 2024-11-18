import { Button, StyleSheet, useWindowDimensions, View } from "react-native";
import React, { useEffect } from "react";
import {
  Blur,
  Canvas,
  Group,
  interpolateColors,
  LinearGradient,
  Rect,
  RoundedRect,
  Shadow,
  vec,
} from "@shopify/react-native-skia";

import Animated, {
  FadeIn,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import ReanimCard from "@/components/ReanimCard";

const startColors = [
  "rgba(34, 193, 195, 0.4)",
  "rgba(34,193,195,0.4)",
  "rgba(63,94,251,1)",
  "rgba(253,29,29,0.4)",
];
const endColors = [
  "rgba(0,212,255,0.4)",
  "rgba(253,187,45,0.4)",
  "rgba(252,70,107,1)",
  "rgba(252,176,69,0.4)",
];

const index = () => {
  const { width, height } = useWindowDimensions();
  const cardWidth = width * 0.8;
  const cardHeight = cardWidth * 1.618;

  const progress = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const colorsIndex = useSharedValue(0);
  useEffect(() => {
    colorsIndex.value = withRepeat(
      withTiming(startColors.length - 1, {
        duration: 7000,
      }),
      -1,
      true
    );
  }, []);

  const gradientColors = useDerivedValue(() => {
    return [
      interpolateColors(colorsIndex.value, [0, 1, 2, 3], startColors),
      interpolateColors(colorsIndex.value, [0, 1, 2, 3], endColors),
    ];
  });

  const firstScale = useDerivedValue(() => {
    return interpolate(progress.value, [1, 2], [0.9, 1]);
  }, []);

  const Y = useSharedValue(40);
  const firstTransY = useDerivedValue(() => {
    Y.value = interpolate(progress.value, [1, 2], [40, 0]);
    return height / 2 - cardHeight / 2 - Y.value - 75;
  }, []);

  const firstBlur = useDerivedValue(() => {
    return 2 - progress.value;
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
    <>
      <Canvas style={{ flex: 1 }}>
        <Rect x={0} y={0} width={width} height={height}>
          <LinearGradient
            start={vec(0, 0)}
            end={vec(width, height)}
            colors={gradientColors}
          />
        </Rect>
      </Canvas>
      <View
        style={{
          ...StyleSheet.absoluteFill,
        }}
      >
        <ReanimCard progress={progress} index={5} />
        <ReanimCard progress={progress} index={4} />
        <ReanimCard progress={progress} index={3} />
        <ReanimCard progress={progress} index={2} />
        <ReanimCard progress={progress} index={1} />
        <View
          style={{
            flexDirection: "row",
            position: "absolute",
            bottom: 50,
            width: width,
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <View>
            <Button title="перевернуть" />
          </View>
          <View>
            <Button title="удалить" />
          </View>
        </View>
      </View>
    </>
  );
};

export default index;

const styles = StyleSheet.create({});

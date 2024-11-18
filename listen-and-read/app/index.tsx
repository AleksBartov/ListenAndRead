import { StyleSheet, useWindowDimensions, View } from "react-native";
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

  const progress = useSharedValue(0);
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
    return interpolate(progress.value, [0, 1], [0.9, 1]);
  }, []);

  const firstBlur = useDerivedValue(() => {
    return 2 * progress.value;
  }, []);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 300 },
        {
          translateX: width / 2 - cardWidth / 2 - 75,
        },
        { translateY: height / 2 - cardHeight / 2 - 40 - 75 },
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
        <Animated.View
          entering={FadeIn.delay(1 * 400)}
          style={{
            ...StyleSheet.absoluteFill,
            transform: [
              { perspective: 300 },
              {
                translateX: width / 2 - cardWidth / 2 - 75,
              },
              { translateY: height / 2 - cardHeight / 2 - 160 - 75 },
              { scale: 1 * 0 },
            ],
            width: cardWidth + 150,
            height: cardHeight + 150,
          }}
        >
          <Canvas style={{ width: cardWidth + 150, height: cardHeight + 150 }}>
            <RoundedRect
              x={75}
              y={75}
              width={cardWidth}
              height={cardHeight}
              r={25}
              color={"cyan"}
            >
              <Blur blur={3.5} />
              <Shadow dx={5} dy={5} blur={6} color={"rgba(0,0,0,0.4)"} />
            </RoundedRect>
          </Canvas>
        </Animated.View>
        <Animated.View
          entering={FadeIn.delay(1 * 400)}
          style={{
            ...StyleSheet.absoluteFill,
            transform: [
              { perspective: 300 },
              {
                translateX: width / 2 - cardWidth / 2 - 75,
              },
              { translateY: height / 2 - cardHeight / 2 - 160 - 75 },
              { scale: 1 * 0.6 },
            ],
            width: cardWidth + 150,
            height: cardHeight + 150,
          }}
        >
          <Canvas style={{ width: cardWidth + 150, height: cardHeight + 150 }}>
            <RoundedRect
              x={75}
              y={75}
              width={cardWidth}
              height={cardHeight}
              r={25}
              color={"cyan"}
            >
              <Blur blur={3.5} />
              <Shadow dx={5} dy={5} blur={6} color={"rgba(0,0,0,0.4)"} />
            </RoundedRect>
          </Canvas>
        </Animated.View>
        <Animated.View
          entering={FadeIn.delay(1 * 350)}
          style={{
            ...StyleSheet.absoluteFill,
            transform: [
              { perspective: 300 },
              {
                translateX: width / 2 - cardWidth / 2 - 75,
              },
              { translateY: height / 2 - cardHeight / 2 - 120 - 75 },
              { scale: 1 * 0.7 },
            ],
            width: cardWidth + 150,
            height: cardHeight + 150,
          }}
        >
          <Canvas style={{ width: cardWidth + 150, height: cardHeight + 150 }}>
            <RoundedRect
              x={75}
              y={75}
              width={cardWidth}
              height={cardHeight}
              r={25}
              color={"snow"}
            >
              <Blur blur={3} />
              <Shadow dx={5} dy={5} blur={6} color={"rgba(0,0,0,0.4)"} />
            </RoundedRect>
          </Canvas>
        </Animated.View>
        <Animated.View
          entering={FadeIn.delay(1 * 300)}
          style={{
            ...StyleSheet.absoluteFill,
            transform: [
              { perspective: 300 },
              {
                translateX: width / 2 - cardWidth / 2 - 75,
              },
              { translateY: height / 2 - cardHeight / 2 - 80 - 75 },
              { scale: 1 * 0.8 },
            ],
            width: cardWidth + 150,
            height: cardHeight + 150,
          }}
        >
          <Canvas style={{ width: cardWidth + 150, height: cardHeight + 150 }}>
            <RoundedRect
              x={75}
              y={75}
              width={cardWidth}
              height={cardHeight}
              r={25}
              color={"cyan"}
            >
              <Blur blur={2.5} />
              <Shadow dx={5} dy={5} blur={6} color={"rgba(0,0,0,0.4)"} />
            </RoundedRect>
          </Canvas>
        </Animated.View>
        <Animated.View
          entering={FadeIn.delay(1 * 250)}
          onTouchEnd={() => (progress.value = withSpring(1))}
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
                color={"snow"}
              />
              <Blur blur={firstBlur} />
              <Shadow dx={5} dy={5} blur={6} color={"rgba(0,0,0,0.4)"} />
            </Group>
          </Canvas>
        </Animated.View>
      </View>
    </>
  );
};

export default index;

const styles = StyleSheet.create({});

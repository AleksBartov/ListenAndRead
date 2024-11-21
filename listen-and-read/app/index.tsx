import { Button, StyleSheet, useWindowDimensions, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Blur,
  Canvas,
  FitBox,
  Group,
  interpolateColors,
  LinearGradient,
  Mask,
  Path,
  rect,
  Rect,
  RoundedRect,
  Shadow,
  Skia,
  usePathInterpolation,
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
import Card from "@/components/card/Card";
import { CARDS } from "@/constants/data/DATA";
import { Colors } from "@/constants/Colors";

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
  // cards variables and data
  const [newData, setNewData] = useState([...CARDS]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const animatedValue = useSharedValue(0);
  const progress = useSharedValue(0);

  const MAX = 5;

  // colors background logic
  const colorsIndex = useSharedValue(0);

  const linePath_1 = Skia.Path.MakeFromSVGString(
    "M5 62C5 62 154.195 0.527309 254.5 0.999977C352.909 1.46371 400.591 62.4819 499 62C595.515 61.5273 641.985 1.47265 738.5 0.999977C836.909 0.518036 884.591 62.4819 983 62C1079.52 61.5273 1126.01 -1.43592 1222.5 0.999977C1310.31 3.21691 1351.16 61.0822 1439 62C1530.22 62.9532 1573.39 5.66493 1664.5 0.999977C1777.03 -4.76164 1833.85 64.5534 1946.5 62C2048.49 59.6881 2200.5 0.999977 2200.5 0.999977"
  );
  const linePath_2 = Skia.Path.MakeFromSVGString(
    "M5 62C5 62 161.695 28.5274 262 29C360.409 29.4638 403.591 62.4819 502 62C598.515 61.5273 645.485 29.4727 742 29C840.409 28.5181 884.591 62.4819 983 62C1079.52 61.5273 1129.51 26.5641 1226 29C1313.81 31.217 1351.16 61.0822 1439 62C1530.22 62.9532 1582.89 33.665 1674 29C1786.53 23.2384 1833.85 64.5534 1946.5 62C2048.49 59.6882 2200.5 1 2200.5 1"
  );
  const linePath_3 = Skia.Path.MakeFromSVGString(
    "M5 1.00012C5 1.00012 152.695 28.5274 253 29C351.409 29.4638 390.591 1.48205 489 1.00011C585.515 0.527438 636.485 29.4727 733 29C831.409 28.5181 878.591 1.48205 977 1.00011C1073.52 0.52744 1120.51 26.5641 1217 29C1304.81 31.217 1345.16 0.0823383 1433 1.00012C1524.22 1.9533 1573.89 33.665 1665 29C1777.53 23.2384 1812.35 3.55341 1925 0.999968C2026.99 -1.31187 2193 29 2193 29"
  );

  useEffect(() => {
    colorsIndex.value = withRepeat(
      withTiming(startColors.length - 1, {
        duration: 7000,
      }),
      -1,
      true
    );
    progress.value = withRepeat(
      withTiming(1, {
        duration: 2000,
      }),
      -1,
      true
    );
  }, []);

  const path_1 = usePathInterpolation(
    progress,
    [0, 0.5, 1],
    [linePath_1, linePath_3, linePath_1]
  );
  const path_2 = usePathInterpolation(
    progress,
    [0, 0.5, 1],
    [linePath_2, linePath_1, linePath_2]
  );
  const path_3 = usePathInterpolation(
    progress,
    [0, 0.5, 1],
    [linePath_1, linePath_2, linePath_1]
  );

  const gradientColors = useDerivedValue(() => {
    return [
      interpolateColors(colorsIndex.value, [0, 1, 2, 3], startColors),
      interpolateColors(colorsIndex.value, [0, 1, 2, 3], endColors),
    ];
  });

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
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {newData.map((item, index) => {
          if (index > currentIndex + MAX || index < currentIndex) {
            return null;
          }
          return (
            <Card
              key={index}
              maxVisibleItems={MAX}
              dataLength={newData.length}
              item={item}
              index={index}
              newData={newData}
              setNewData={setNewData}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
              animatedValue={animatedValue}
            />
          );
        })}
      </View>
      <View
        style={{
          position: "absolute",
          bottom: 30,
        }}
      >
        <Canvas
          style={{
            width: width,
            height: 100,
          }}
        >
          <Mask
            mode="luminance"
            mask={
              <Rect x={0} y={0} width={width} height={100}>
                <LinearGradient
                  start={vec(0, 0)}
                  end={vec(width, 100)}
                  colors={["black", "black", "white", "black", "black"]}
                />
              </Rect>
            }
          >
            <FitBox src={rect(0, 0, 2205, 71)} dst={rect(0, 0, width, 100)}>
              <Group
                style="stroke"
                strokeWidth={8}
                strokeCap={"round"}
                color={Colors.blue}
              >
                <Path path={path_1!} start={0} end={1} />
                <Path path={path_2!} start={0} end={1} />
                <Path path={path_3!} start={0} end={1} />
              </Group>
            </FitBox>
          </Mask>
        </Canvas>
      </View>
    </>
  );
};

export default index;

const styles = StyleSheet.create({});

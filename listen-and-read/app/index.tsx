import { Button, StyleSheet, useWindowDimensions, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
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
  const [toRotate, setToRotate] = useState(false);
  const [cardsArray, setCardsArray] = useState(
<<<<<<< HEAD
    new Array(4).fill(null).map((_, i) => {
      return { position: i };
=======
    new Array(5).fill(null).map((_, i) => {
      return { position: i + 1 };
>>>>>>> 499f3c1358086d40845b4d14ae7b3903424a6801
    })
  );
  const cardWidth = width * 0.8;
  const cardHeight = cardWidth * 1.618;

  const progress = useSharedValue(0);
  const timeToRotate = useSharedValue(false);
  const timeToDelete = useSharedValue(false);

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

  const rotateHandler = () => (timeToRotate.value = true);
  const deleteHandler = () => (timeToDelete.value = true);
  const onDelete = useCallback((cardPosition: number) => {
    console.log(`index says: ${cardPosition}`);
    setCardsArray((cards) => {
      return cards.filter((item) => item.position !== cardPosition);
    });
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
        {cardsArray.map((c, i) => {
          return (
            <ReanimCard
              key={i}
              index={i}
              progress={progress}
              position={c.position}
              timeToRotate={timeToRotate}
              timeToDelete={timeToDelete}
              zIndex={-i}
              removeCard={onDelete}
              cardsArray={cardsArray}
            />
          );
        })}
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
            <Button title="перевернуть" onPress={rotateHandler} />
          </View>
          <View>
            <Button title="удалить" onPress={deleteHandler} />
          </View>
        </View>
      </View>
    </>
  );
};

export default index;

const styles = StyleSheet.create({});

import { StyleSheet, useWindowDimensions } from "react-native";
import React from "react";
import Animated, {
  FadeIn,
  interpolate,
  LinearTransition,
  runOnJS,
  SlideOutRight,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  Blur,
  Canvas,
  Group,
  RoundedRect,
  Shadow,
} from "@shopify/react-native-skia";

const ReanimCard = ({
  progress,
  position,
  timeToRotate,
  index,
  timeToDelete,
  zIndex,
  removeCard,
  cardsArray,
}) => {
  const { width, height } = useWindowDimensions();
  const cardWidth = width * 0.8;
  const cardHeight = cardWidth * 1.618;
  const startY = 40 * position;
  const startBlur = 2 * position;
  const startScale =
    position === 1
      ? 0.9
      : position === 2
      ? 0.8
      : position === 3
      ? 0.7
      : position === 4
      ? 0.6
      : 0.5;
  const Y = useSharedValue(startY);
  const isActive = useSharedValue(cardsArray[0].position === position);
  const rotateY = useSharedValue(0);
  const workingCard = useSharedValue(false);

  const firstScale = useDerivedValue(() => {
    return interpolate(
      progress.value,
      [1, 2, 3, 4, 5],
      [
        startScale,
        startScale + 0.1,
        startScale + 0.2,
        startScale + 0.3,
        startScale + 0.4,
      ]
    );
  }, []);

  const firstTransY = useDerivedValue(() => {
    Y.value = interpolate(
      progress.value,
      [1, 2, 3, 4, 5],
      [startY, startY - 40, startY - 80, startY - 120, startY - 160]
    );
    return height / 2 - cardHeight / 2 - Y.value - 75;
  }, []);

  const firstBlur = useDerivedValue(() => {
    return startBlur - progress.value;
  }, []);

  useAnimatedReaction(
    () => timeToRotate.value,
    (v) => {
      if (v && isActive.value) {
        rotateY.value = withTiming(-180);
      }
    }
  );

  useAnimatedReaction(
    () => timeToDelete.value,
    (v) => {
      if (v && workingCard.value && isActive.value) {
        runOnJS(removeCard)(position);
        isActive.value = false;
        workingCard.value = false;
        timeToDelete.value = false;
        timeToRotate.value = false;
        progress.value = 1;
        console.log(`test from ${position}`);
      }
    }
  );

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 1000 },
        {
          translateX: width / 2 - cardWidth / 2 - 75,
        },
        { translateY: firstTransY.value },
        { rotateY: `${rotateY.value}deg` },
        { scale: firstScale.value },
      ],
    };
  }, []);

  return (
    <Animated.View
      entering={FadeIn.delay(position * 250)}
      exiting={SlideOutRight.duration(1000)}
      layout={LinearTransition.delay(200)}
      onTouchEnd={() => {
        progress.value = withSpring(progress.value + 1);
        workingCard.value = true;
      }}
      style={[
        {
          ...StyleSheet.absoluteFill,
          width: cardWidth + 150,
          height: cardHeight + 150,
          zIndex: zIndex,
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
            color={position % 2 ? "snow" : "cyan"}
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

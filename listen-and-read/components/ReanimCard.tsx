import { StyleSheet, useWindowDimensions } from "react-native";
import React, { useEffect } from "react";
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

const transYStep = 33;
const scaleStep = 0.1;

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
  const centerCoords = {
    x: width / 2 - cardWidth / 2 - 75,
    y: height / 2 - cardHeight / 2 - 75,
  };

  const isActive = useSharedValue(index === 0);
  const translateY = useSharedValue(0);
  const rotateY = useSharedValue(0);
  const scale = useSharedValue(0);
  const blur = useSharedValue(index === 0 ? 0 : 3);

  useEffect(() => {
    translateY.value = withTiming(
      centerCoords.y - Math.min(index * transYStep, 200) - transYStep
    );
    scale.value = withTiming(Math.max(1 - index * scaleStep, 0.3) - scaleStep);
    timeToDelete.value = false;
    console.log("fires");
  }, [cardsArray]);

  useAnimatedReaction(
    () => progress.value,
    (v) => {
      if (v && isActive.value) {
        translateY.value = withSpring(centerCoords.y);
        scale.value = withSpring(1);
      }
    }
  );

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
      if (v && isActive.value) {
        runOnJS(removeCard)(position);
        isActive.value = false;
        progress.value = false;
        timeToRotate.value = false;
      }
    }
  );

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 1500 },
        {
          translateX: centerCoords.x,
        },
        { translateY: translateY.value },
        { rotateY: `${rotateY.value}deg` },
        { scale: scale.value },
      ],
    };
  }, []);

  return (
    <Animated.View
      entering={FadeIn.delay(position * 250)}
      exiting={SlideOutRight.duration(1000)}
      layout={LinearTransition.delay(200)}
      onTouchEnd={() => {
        if (isActive.value) progress.value = true;
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
          <Blur blur={blur.value} />
          <Shadow dx={5} dy={5} blur={6} color={"rgba(0,0,0,0.4)"} />
        </Group>
      </Canvas>
    </Animated.View>
  );
};

export default ReanimCard;

const styles = StyleSheet.create({});

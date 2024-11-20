import { StyleSheet, useWindowDimensions } from "react-native";
import React, { useEffect, useState } from "react";
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

  const [isActive, setIsActive] = useState(false);
  const [wasTouched, setWasTouched] = useState(false);
  const [blur, setBlur] = useState(3);
  const translateY = useSharedValue(0);
  const rotateY = useSharedValue(0);
  const scale = useSharedValue(0);

  useEffect(() => {
    if (progress.value === position) {
      setBlur(0);
      setIsActive(true);
    }
    translateY.value =
      centerCoords.y - Math.min(index * transYStep, 200) - transYStep;
    scale.value = Math.max(1 - index * scaleStep, 0.3) - scaleStep;
    timeToDelete.value = false;
    timeToRotate.value = false;
  }, [cardsArray, isActive, setIsActive, blur, setBlur, wasTouched]);

  useAnimatedReaction(
    () => progress.value,
    (v) => {
      if (v && isActive && wasTouched) {
        translateY.value = withSpring(centerCoords.y);
        scale.value = withSpring(1);
      }
    }
  );

  useAnimatedReaction(
    () => timeToRotate.value,
    (v) => {
      if (v && wasTouched) {
        rotateY.value = withTiming(-180);
      }
    }
  );

  useAnimatedReaction(
    () => timeToDelete.value,
    (v) => {
      if (v && wasTouched) {
        runOnJS(removeCard)(position);
        runOnJS(setIsActive)(false);
        runOnJS(setWasTouched)(false);
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
      onTouchEnd={() => {
        if (isActive && !wasTouched) {
          progress.value = progress.value + 1;
          setWasTouched(true);
        }
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
          <Blur blur={blur} />
          <Shadow dx={5} dy={5} blur={6} color={"rgba(0,0,0,0.4)"} />
        </Group>
      </Canvas>
    </Animated.View>
  );
};

export default ReanimCard;

const styles = StyleSheet.create({});

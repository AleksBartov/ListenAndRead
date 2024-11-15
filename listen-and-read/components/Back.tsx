import { LayoutChangeEvent, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
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
  Rect,
  Mask,
  Group,
  FitBox,
  RoundedRect,
} from "@shopify/react-native-skia";
import { drawNoisyCircle } from "@/Tools";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const rct = rect(0, 0, CARD_WIDTH, CARD_HEIGHT);

const Back = ({ rotateX, rotateYBack, translateX, scale, zIndexBack }) => {
  const bg = useImage(require("../assets/images/bg.png"));
  const mask = useImage(require("../assets/images/mask.png"));
  const test = useImage(require("../assets/images/splash.png"));
  const path = useSharedValue(Skia.Path.Make());

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
        <Mask
          mode="luminance"
          mask={
            <Group>
              <RoundedRect
                x={0}
                y={0}
                width={CARD_WIDTH}
                height={CARD_HEIGHT}
                r={10}
                color="rgba(255,255,255,.9)"
              />
              <Path path={path} color="#01569E" />
            </Group>
          }
        >
          <FitBox
            src={rect(0, 0, 194, 94)}
            dst={rect(0, 0, CARD_WIDTH, CARD_HEIGHT)}
          >
            <Path
              path="M7.536 93.024C5.14667 93.024 3.312 92.3413 2.032 90.976C0.752 89.6107 0.112 87.7333 0.112 85.344V8.41599C0.112 5.94133 0.794667 4.064 2.16 2.784C3.52533 1.41866 5.40267 0.735992 7.792 0.735992C9.92533 0.735992 11.5893 1.16266 12.784 2.016C14.064 2.784 15.216 4.14933 16.24 6.112L47.856 64.608H43.76L75.376 6.112C76.4 4.14933 77.5093 2.784 78.704 2.016C79.8987 1.16266 81.5627 0.735992 83.696 0.735992C86.0853 0.735992 87.92 1.41866 89.2 2.784C90.48 4.064 91.12 5.94133 91.12 8.41599V85.344C91.12 87.7333 90.48 89.6107 89.2 90.976C88.0053 92.3413 86.1707 93.024 83.696 93.024C81.3067 93.024 79.472 92.3413 78.192 90.976C76.912 89.6107 76.272 87.7333 76.272 85.344V26.08H79.088L52.208 75.104C51.3547 76.5547 50.4587 77.6213 49.52 78.304C48.5813 78.9867 47.3013 79.328 45.68 79.328C44.0587 79.328 42.736 78.9867 41.712 78.304C40.688 77.536 39.792 76.4693 39.024 75.104L11.888 25.952H14.96V85.344C14.96 87.7333 14.32 89.6107 13.04 90.976C11.8453 92.3413 10.0107 93.024 7.536 93.024Z"
              color="white"
            />
            <Path
              path="M111.877 93.024C109.829 93.024 108.165 92.5547 106.885 91.616C105.69 90.6773 104.965 89.44 104.709 87.904C104.453 86.2827 104.752 84.4907 105.605 82.528L139.397 7.64799C140.506 5.17333 141.829 3.424 143.365 2.39999C144.986 1.29066 146.821 0.735992 148.869 0.735992C150.832 0.735992 152.581 1.29066 154.117 2.39999C155.738 3.424 157.104 5.17333 158.213 7.64799L192.133 82.528C193.072 84.4907 193.413 86.2827 193.157 87.904C192.901 89.5253 192.176 90.8053 190.981 91.744C189.786 92.5973 188.208 93.024 186.245 93.024C183.856 93.024 181.978 92.4693 180.613 91.36C179.333 90.1653 178.181 88.3733 177.157 85.984L168.837 66.656L175.749 71.136H121.733L128.645 66.656L120.453 85.984C119.344 88.4587 118.192 90.2507 116.997 91.36C115.802 92.4693 114.096 93.024 111.877 93.024ZM148.613 19.552L130.693 62.176L127.365 58.08H170.117L166.917 62.176L148.869 19.552H148.613Z"
              color="white"
            />
          </FitBox>
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

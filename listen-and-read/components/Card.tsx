import { Platform, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import Animated, {
  Easing,
  runOnJS,
  SlideOutRight,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import Voice from "@react-native-voice/voice";
import { Colors } from "@/constants/Colors";
import Front from "./Front";
import Back from "./Back";
import { CARD_HEIGHT, CARD_WIDTH } from "@/constants/Sizes";

const Card = ({ rightColor, leftColor, item, index, toRemove }) => {
  let [started, setStarted] = useState(false);
  let [results, setResults] = useState([""]);
  const toClose = useSharedValue(false);

  const translateX = useSharedValue(0);
  const capitalized = item.text[0].toUpperCase() + item.text.slice(1);
  const keyWordUpperCase = useSharedValue(capitalized);
  const scale = useSharedValue(0.7);
  const rotateX = useSharedValue(Platform.OS === "ios" ? 40 : 5);
  const rotateY = useSharedValue(0);
  const rotateYBack = useSharedValue(180);
  const zIndexFront = useSharedValue(2);
  const zIndexBack = useSharedValue(-2);

  useEffect(() => {
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startSpeechToText = async () => {
    await Voice.start("ru");
    setStarted(true);
    console.log("mic started");
  };

  const stopSpeechToText = async () => {
    await Voice.stop();
    setStarted(false);
    console.log("mic stoped");
  };

  const onSpeechResults = (result) => {
    setResults(result.value);
    answerHandler(result.value);
  };

  const onSpeechError = (error) => {
    console.log(error);
  };

  useAnimatedReaction(
    () => toClose.value,
    (e) => {
      if (e) {
        translateX.value = withDelay(
          1200,
          withTiming(4 * CARD_WIDTH, { duration: 1000 })
        );
        runOnJS(toRemove)();
      }
    },
    [toClose.value, translateX.value]
  );

  const answerHandler = (answer) => {
    let a = [...answer][0].split(" ");
    console.log(a);
    const lowerCase = a.find(
      (word) => word === item.text || word === keyWordUpperCase.value
    );

    if (lowerCase) {
      stopSpeechToText();
      leftColor.value = withTiming("green", {
        easing: Easing.ease,
        duration: 80,
      });
      rightColor.value = withTiming(Colors.white, {
        easing: Easing.ease,
        duration: 80,
      });
      rotateY.value = withSpring(180);
      rotateYBack.value = withSpring(360);
      zIndexFront.value = -2;
      zIndexBack.value = 2;
    } else {
      leftColor.value = withTiming("red", {
        easing: Easing.ease,
        duration: 80,
      });
      rightColor.value = withTiming(Colors.orange, {
        easing: Easing.ease,
        duration: 80,
      });
      translateX.value = withSequence(
        withTiming(6, {
          easing: Easing.bezier(0.35, 0.7, 0.5, 0.7),
          duration: 80,
        }),
        withRepeat(
          withTiming(-6, {
            easing: Easing.bezier(0.35, 0.7, 0.5, 0.7),
            duration: 80,
          }),
          3,
          true
        ),
        withSpring(0, {
          mass: 0.5,
        })
      );
    }
  };

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View
      exiting={SlideOutRight.duration(2000)}
      style={[styles.card_container, style]}
    >
      <Front
        startSpeechToText={startSpeechToText}
        rotateX={rotateX}
        rotateY={rotateY}
        scale={scale}
        zIndexFront={zIndexFront}
        keyWordLowerCase={item.text}
      />

      <Back
        toClose={toClose}
        rotateX={rotateX}
        rotateYBack={rotateYBack}
        scale={scale}
        zIndexBack={zIndexBack}
      />
    </Animated.View>
  );
};

export default Card;

const styles = StyleSheet.create({
  card_container: {
    position: "absolute",
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
});

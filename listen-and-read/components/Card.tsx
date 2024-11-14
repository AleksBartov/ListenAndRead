import { Platform, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import {
  Easing,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import Voice from "@react-native-voice/voice";
import { Colors } from "@/constants/Colors";
import Front from "./Front";
import Back from "./Back";

const Card = ({ rightColor, leftColor }) => {
  let [started, setStarted] = useState(false);
  let [results, setResults] = useState([]);
  const translateX = useSharedValue(0);
  const matched = useSharedValue(false);
  const keyWordUpperCase = useSharedValue("Дом");
  const keyWordLowerCase = useSharedValue("дом");
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
  };

  const stopSpeechToText = async () => {
    await Voice.stop();
    setStarted(false);
  };

  const onSpeechResults = (result) => {
    setResults(result.value);
  };

  const onSpeechError = (error) => {
    console.log(error);
  };

  const answerHandler = (answer: string) => {
    let a = answer.split(" ");
    // console.log(a);
    const lowerCase = a.find((word) => word === keyWordLowerCase.value);
    const upperCase = a.find((word) => word === keyWordUpperCase.value);

    if (lowerCase || upperCase) {
      stopSpeechToText();
      matched.value = true;
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

  return (
    <>
      <Front
        startSpeechToText={startSpeechToText}
        rotateX={rotateX}
        rotateY={rotateY}
        translateX={translateX}
        scale={scale}
        zIndexFront={zIndexFront}
      />

      <Back
        rotateX={rotateX}
        rotateYBack={rotateYBack}
        translateX={translateX}
        scale={scale}
        zIndexBack={zIndexBack}
      />

      {results.map((w, i) => {
        answerHandler(w);
        return undefined;
      })}
    </>
  );
};

export default Card;

const styles = StyleSheet.create({});

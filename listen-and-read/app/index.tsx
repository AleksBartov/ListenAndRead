import { Colors } from "@/constants/Colors";
import {
  Button,
  Text,
  View,
  StyleSheet,
  Platform,
  useWindowDimensions,
} from "react-native";
import { useEffect, useState } from "react";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  runOnUI,
  SlideInRight,
  withSequence,
  withTiming,
  Easing,
  withRepeat,
  useDerivedValue,
} from "react-native-reanimated";
import Voice from "@react-native-voice/voice";
import { StatusBar } from "expo-status-bar";
import { Canvas, LinearGradient, Rect, vec } from "@shopify/react-native-skia";

const styles = StyleSheet.create({
  card_container: {
    width: 200,
    height: 200 * 1.618,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  card_text: {
    color: Colors.blue,
    fontSize: 35,
    fontFamily: "Nunito_800ExtraBold",
  },
});

export default function Index() {
  const { width, height } = useWindowDimensions();
  let [started, setStarted] = useState(false);
  let [toClose, setToClose] = useState(false);
  let [results, setResults] = useState([]);
  const translateX = useSharedValue(0);
  const keyWordUpperCase = useSharedValue("Дом");
  const keyWordLowerCase = useSharedValue("дом");
  const scale = useSharedValue(0.7);
  const rotateX = useSharedValue(Platform.OS === "ios" ? 40 : 5);
  const leftColor = useSharedValue(Colors.blue);
  const rightColor = useSharedValue(Colors.yellow);

  const colors = useDerivedValue(() => {
    return [leftColor.value, rightColor.value];
  }, []);

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
    console.log(a);
    const lowerCase = a.find((word) => word === keyWordLowerCase.value);
    const upperCase = a.find((word) => word === keyWordUpperCase.value);

    if (lowerCase || upperCase) {
      leftColor.value = withTiming("green", {
        easing: Easing.ease,
        duration: 80,
      });
      rightColor.value = withTiming(Colors.orange, {
        easing: Easing.ease,
        duration: 80,
      });
      translateX.value = withSpring(-width);
      stopSpeechToText();
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

  const gesture = Gesture.Tap().onEnd(() => {
    scale.value = withSpring(1);
    rotateX.value = withSpring(0);
    runOnJS(startSpeechToText)();
  });

  const style = useAnimatedStyle(() => ({
    transform: [
      { perspective: 800 },
      { rotateX: `${rotateX.value}deg` },
      { translateX: translateX.value },
      { scale: scale.value },
    ],
  }));

  return (
    <>
      <StatusBar style="auto" />
      <Canvas style={{ flex: 1 }}>
        <Rect x={0} y={0} width={width} height={height}>
          <LinearGradient
            start={vec(0, 0)}
            end={vec(width, height)}
            colors={colors}
          />
        </Rect>
      </Canvas>
      <GestureHandlerRootView
        style={{
          ...StyleSheet.absoluteFill,
          width: width,
          height: height,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {!toClose && (
          <GestureDetector gesture={gesture}>
            <Animated.View
              exiting={SlideInRight}
              style={[styles.card_container, style]}
            >
              <Text style={styles.card_text}>ДОМ</Text>
            </Animated.View>
          </GestureDetector>
        )}
        {results.map((w, i) => {
          answerHandler(w);
          return undefined;
        })}
      </GestureHandlerRootView>
    </>
  );
}

/*

{!started ? (
  <Button title="Start Speech to Text" onPress={startSpeechToText} />
) : undefined}
{started ? (
  <Button title="Stop Speech to Text" onPress={stopSpeechToText} />
) : undefined}

*/

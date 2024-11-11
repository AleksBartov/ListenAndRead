import { Colors } from "@/constants/Colors";
import { Button, Text, View, StyleSheet, Platform } from "react-native";
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
} from "react-native-reanimated";
import Voice from "@react-native-voice/voice";

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
  let [started, setStarted] = useState(false);
  let [results, setResults] = useState([]);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(0.7);
  const rotateX = useSharedValue(Platform.OS === "ios" ? 40 : 5);

  useEffect(() => {
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startSpeechToText = async () => {
    "worklet";
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

  const gesture = Gesture.Tap().onEnd(() => {
    scale.value = withSpring(1);
    rotateX.value = withSpring(0);
    startSpeechToText();
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
    <GestureHandlerRootView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.orange,
      }}
    >
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.card_container, style]}>
          <Text style={styles.card_text}>ДОМ</Text>
        </Animated.View>
      </GestureDetector>
      {!started ? (
        <Button title="Stop Speech to Text" onPress={stopSpeechToText} />
      ) : undefined}
    </GestureHandlerRootView>
  );
}

/*

{!started ? (
  <Button title="Start Speech to Text" onPress={startSpeechToText} />
) : undefined}
{started ? (
  <Button title="Stop Speech to Text" onPress={stopSpeechToText} />
) : undefined}
{results.map((result, index) => (
  <Text key={index}>{result}</Text>
))}

*/

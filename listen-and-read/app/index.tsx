import { Colors } from "@/constants/Colors";
import { StyleSheet, useWindowDimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSharedValue, useDerivedValue } from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import { Canvas, LinearGradient, Rect, vec } from "@shopify/react-native-skia";
import Card from "@/components/Card";

const styles = StyleSheet.create({});

export default function Index() {
  const { width, height } = useWindowDimensions();

  const leftColor = useSharedValue(Colors.blue);
  const rightColor = useSharedValue(Colors.yellow);

  const colors = useDerivedValue(() => {
    return [leftColor.value, rightColor.value];
  }, []);

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
        <Card rightColor={rightColor} leftColor={leftColor} />
      </GestureHandlerRootView>
    </>
  );
}

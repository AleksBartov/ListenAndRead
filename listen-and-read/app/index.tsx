import { Button, StyleSheet, useWindowDimensions, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Blur,
  Canvas,
  FitBox,
  Group,
  interpolateColors,
  LinearGradient,
  Mask,
  Path,
  rect,
  Rect,
  RoundedRect,
  Shadow,
  Skia,
  usePathInterpolation,
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
import Card from "@/components/card/Card";
import { CARDS } from "@/constants/data/DATA";
import { Colors } from "@/constants/Colors";
import Voice from "@react-native-voice/voice";

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

  let [started, setStarted] = useState(false);
  let [results, setResults] = useState([""]);
  // cards variables and data
  const [newData, setNewData] = useState([...CARDS]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const animatedValue = useSharedValue(0);

  // for wave path interpolation
  const progress = useSharedValue(0);

  const MAX = 5;

  // colors background logic
  const colorsIndex = useSharedValue(0);

  const linePath_1 = Skia.Path.MakeFromSVGString(
    "M1 9.0002L32 3.00019C56 -0.99981 74 3.00019 74 3.00019C74 3.00019 99.4375 8.55256 116 9.0002C136.435 9.55248 147.558 3.12724 168 3.00019C189.606 2.8659 201.394 8.87964 223 9.0002C245.771 9.12725 258.232 3.40041 281 3.00019C308.433 2.51797 323.566 9.38878 351 9.0002C374.546 8.66668 387.453 2.74143 411 3.00019C432.217 3.23334 443.783 8.83946 465 9.0002C487.771 9.1727 500.229 3.15066 523 3.00019C547.325 2.83945 560.678 9.44783 585 9.0002C605.439 8.62403 616.558 3.08644 637 3.00019C658.218 2.91066 669.809 10.0629 691 9.0002C705.62 8.26705 713.362 2.86822 728 3.00019C741.867 3.12521 749.15 8.30226 763 9.0002C782.641 9.98996 793.354 2.10136 813 3.00019C827.238 3.6516 834.75 9.28807 849 9.0002C861.712 8.74339 868.291 3.36563 881 3.00019C896.018 2.56837 903.978 8.77928 919 9.0002C935.567 9.24383 944.44 2.45725 961 3.00019C974.476 3.44202 981.572 7.78346 995 9.0002C1009.39 10.3041 1017.6 10.1529 1032 9.0002C1046.59 7.83245 1054.37 3.60507 1069 3.00019C1088.65 2.18754 1099.38 7.72401 1119 9.0002C1142.38 10.5207 1157.57 3.00019 1181 3.00019C1205.21 3.00019 1241 9.0002 1241 9.0002"
  );
  const linePath_2 = Skia.Path.MakeFromSVGString(
    (d =
      "M1 8.00011L32 2.0001C56 -1.9999 74 8.00019 74 8.00019C74 8.00019 100.438 1.55247 117 2.0001C137.435 2.55239 146.558 8.12724 167 8.00019C188.606 7.8659 200.394 1.87955 222 2.0001C244.771 2.12716 261.232 8.40041 284 8.00019C311.433 7.51797 321.566 2.38869 349 2.0001C372.546 1.66659 386.453 7.74135 410 8.00011C431.217 8.23326 443.783 1.83936 465 2.0001C487.771 2.17261 500.229 8.15058 523 8.00011C547.325 7.83937 559.678 2.44774 584 2.0001C604.439 1.62393 615.558 8.08644 636 8.00019C657.218 7.91066 669.809 3.0628 691 2.0001C705.62 1.26696 713.362 13.868 728 14C741.867 14.125 749.15 7.30217 763 8.00011C782.641 8.98988 793.354 7.10136 813 8.00019C827.238 8.6516 834.75 2.28798 849 2.0001C861.712 1.74329 868.291 8.36563 881 8.00019C896.018 7.56837 903.978 7.77919 919 8.00011C935.567 8.24374 943.44 7.45725 960 8.00019C973.476 8.44202 985.572 0.783362 999 2.0001C1013.39 3.30405 1017.6 9.15279 1032 8.00011C1046.59 6.83237 1054.37 8.60507 1069 8.00019C1088.65 7.18754 1099.38 6.72392 1119 8.00011C1142.38 9.52062 1157.57 2.0001 1181 2.0001C1205.21 2.0001 1241 8.00011 1241 8.00011")
  );
  const linePath_3 = Skia.Path.MakeFromSVGString(
    (d =
      "M1 6.99997L43 12.9999C67 8.99987 74 7.00005 74 7.00005C74 7.00005 102.438 12.5522 119 12.9999C139.435 13.5521 146.558 7.12711 167 7.00005C188.606 6.86576 198.394 12.8793 220 12.9999C242.771 13.1269 259.232 13.4001 282 12.9999C309.433 12.5177 320.566 7.38864 348 7.00005C371.546 6.66654 389.453 0.741209 413 0.999966C434.217 1.23312 442.783 6.83932 464 7.00005C486.771 7.17256 487.229 1.15043 510 0.999966C534.325 0.839228 558.678 7.44769 583 7.00005C603.439 6.62388 613.558 1.08622 634 0.999966C655.218 0.910439 669.809 8.06275 691 7.00005C705.62 6.26691 712.362 6.868 727 6.99997C740.867 7.125 749.15 0.302029 763 0.999966C782.641 1.98973 793.354 6.10123 813 7.00005C827.238 7.65146 833.75 13.2877 848 12.9999C860.712 12.7431 873.291 1.36541 886 0.999966C901.018 0.568151 904.978 12.779 920 12.9999C936.567 13.2435 941.44 0.456927 958 0.999867C971.476 1.4417 977.572 5.78342 991 7.00016C1005.39 8.30411 1023.6 2.15266 1038 0.99998C1052.59 -0.167762 1054.37 7.60493 1069 7.00005C1088.65 6.1874 1099.38 5.72379 1119 6.99997C1142.38 8.52048 1157.57 0.999966 1181 0.999966C1205.21 0.999966 1241 6.99997 1241 6.99997")
  );

  useEffect(() => {
    colorsIndex.value = withRepeat(
      withTiming(startColors.length - 1, {
        duration: 7000,
      }),
      -1,
      true
    );
    progress.value = withRepeat(
      withTiming(1, {
        duration: 700,
      }),
      -1,
      true
    );

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
    if ([...result.value][0].split(" ").length > 3) stopSpeechToText();
    console.log([...result.value]);
  };

  const onSpeechError = (error) => {
    console.log(error);
  };

  const path_1 = usePathInterpolation(
    progress,
    [0, 0.5, 1],
    [linePath_1, linePath_3, linePath_1]
  );
  const path_2 = usePathInterpolation(
    progress,
    [0, 0.5, 1],
    [linePath_2, linePath_1, linePath_2]
  );
  const path_3 = usePathInterpolation(
    progress,
    [0, 0.5, 1],
    [linePath_1, linePath_2, linePath_1]
  );

  const gradientColors = useDerivedValue(() => {
    return [
      interpolateColors(colorsIndex.value, [0, 1, 2, 3], startColors),
      interpolateColors(colorsIndex.value, [0, 1, 2, 3], endColors),
    ];
  });

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
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {newData.map((item, index) => {
          if (index > currentIndex + MAX || index < currentIndex) {
            return null;
          }
          return (
            <Card
              key={index}
              maxVisibleItems={MAX}
              dataLength={newData.length}
              item={item}
              index={index}
              newData={newData}
              setNewData={setNewData}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
              animatedValue={animatedValue}
              startSpeech={startSpeechToText}
              stopSpeech={stopSpeechToText}
            />
          );
        })}
      </View>
      <View
        style={{
          position: "absolute",
          bottom: 30,
        }}
      >
        <Canvas
          style={{
            width: width,
            height: 100,
          }}
        >
          <Mask
            mode="luminance"
            mask={
              <Rect x={0} y={0} width={width} height={100}>
                <LinearGradient
                  start={vec(0, 0)}
                  end={vec(width, 100)}
                  colors={["black", "black", "white", "black", "black"]}
                />
              </Rect>
            }
          >
            <FitBox src={rect(0, 0, 1242, 14)} dst={rect(0, 0, width, 100)}>
              <Group
                style="stroke"
                strokeWidth={12}
                strokeCap={"round"}
                color={Colors.white}
              >
                <Path path={path_1!} start={0} end={1} />
              </Group>
            </FitBox>
          </Mask>
        </Canvas>
      </View>
    </>
  );
};

export default index;

const styles = StyleSheet.create({});

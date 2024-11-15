import { Skia, Vector } from "@shopify/react-native-skia";
import { createNoise2D } from "simplex-noise";

export const drawNoisyCircle = (c: Vector) => {
  const F = 1;
  const R = 15;
  const sample = 50;
  const noise = createNoise2D();
  const path = Skia.Path.Make();
  for (let i = 0; i < sample; i++) {
    const theta = (i / sample) * 2 * Math.PI;
    const r = 2 * R + R * noise(theta * F, 0);
    const x = r * Math.cos(theta);
    const y = r * Math.sin(theta);
    if (i === 0) {
      path.moveTo(x, y);
    } else {
      path.lineTo(x, y);
    }
  }
  path.close();
  const m3 = Skia.Matrix();
  m3.translate(c.x, c.y);
  path.transform(m3);
  return path;
};

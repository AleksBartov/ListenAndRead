import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const CARD_WIDTH = width * 0.75;
export const CARD_HEIGHT = CARD_WIDTH * 1.618;

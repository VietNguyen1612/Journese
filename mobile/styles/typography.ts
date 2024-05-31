import { TextProps } from "@rneui/themed";
import { StyleProp, TextStyle } from "react-native";

export type JourneseTypography =
  | "textS"
  | "textM"
  | "textL"
  | "headingS"
  | "headingM"
  | "headingL";

type CustomTextRender = {
  [key in JourneseTypography]: (
    props: Partial<TextProps>
  ) => StyleProp<TextStyle>;
};

const renderTextS = ({
  bold,
  semiBold,
  medium,
}: Partial<TextProps>): StyleProp<TextStyle> => ({
  fontSize: 14,
  // letterSpacing: 2.17,
  fontWeight: bold ? "700" : semiBold ? "600" : medium ? "500" : "400",
});

const renderTextM = ({
  bold,
  semiBold,
  medium,
}: Partial<TextProps>): StyleProp<TextStyle> => ({
  fontSize: 16,
  fontWeight: bold ? "700" : semiBold ? "600" : medium ? "500" : "400",
});

const renderTextL = ({
  bold,
  semiBold,
  medium,
}: Partial<TextProps>): StyleProp<TextStyle> => ({
  fontSize: 18,
  // lineHeight: 0.45,
  fontWeight: bold ? "700" : semiBold ? "600" : medium ? "500" : "400",
});

const renderHeadingS = (_: Partial<TextProps>): StyleProp<TextStyle> => ({
  fontSize: 24,
  fontWeight: "700",
  // letterSpacing: 2.64,
});

const renderHeadingM = (_: Partial<TextProps>): StyleProp<TextStyle> => ({
  fontSize: 28,
  fontWeight: "700",
  // letterSpacing: 2.94,
});

const renderHeadingL = (_: Partial<TextProps>): StyleProp<TextStyle> => ({
  fontSize: 36,
  fontWeight: "900",
});

export const customText: CustomTextRender = {
  textS: renderTextS,
  textM: renderTextM,
  textL: renderTextL,
  headingS: renderHeadingS,
  headingM: renderHeadingM,
  headingL: renderHeadingL,
};

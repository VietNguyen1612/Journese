import { createTheme } from "@rneui/themed";
import { JourneseTypography, customText } from "./typography";
import { TextStyle } from "react-native";
import { lightColors } from "./color";

const textTransformValue = (
    up: boolean | undefined
): TextStyle["textTransform"] => (up ? "uppercase" : "none");

export const theme = createTheme({
    lightColors,
    components: {
        Text: (props) => {
            const {
                uppercase,
                bold,
                semiBold,
                medium,
                extraBold,
                ...restHeadingText
            } = props;
            const textKey = Object.keys(restHeadingText)[0] as JourneseTypography;
            const textTransform = textTransformValue(uppercase);
            return {
                style: {
                    textTransform,
                    ...(customText[textKey]?.(props) as Object),
                },
            };
        },
    },
});

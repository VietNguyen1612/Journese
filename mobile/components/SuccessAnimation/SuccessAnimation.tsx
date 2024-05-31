import { Dimensions, Pressable, View, ViewStyle } from "react-native";
import React, { FC } from "react";
import { Text, makeStyles, useTheme } from "@rneui/themed";
import LottieView from "lottie-react-native";
import { IconExclamationCircle } from "tabler-icons-react-native";

const { height, width } = Dimensions.get("window");

interface SuccessProps {
  onPress: () => void;
  content: string;
  isSuccess: boolean;
  wrapperStyle?: ViewStyle;
}

export const SuccessAnimation: FC<SuccessProps> = ({
  onPress,
  content,
  isSuccess,
  wrapperStyle,
}) => {
  const styles = useStyles();
  const { theme } = useTheme();
  return (
    <Pressable style={styles.successContainer} onPress={onPress}>
      <View style={[styles.successWrapper, wrapperStyle]}>
        {isSuccess ? (
          <LottieView
            source={require("../../assets/lotties/success_animation.json")}
            style={{ width: 80, aspectRatio: 1 / 1 }}
            autoPlay
            loop={false}
            speed={2}
          />
        ) : (
          <IconExclamationCircle color="red" size={44} />
        )}
        <Text
          numberOfLines={2}
          style={{
            textAlign: "center",
            fontSize: 22,
            color: isSuccess
              ? theme.colors?.brand?.primary?.[600]
              : theme.colors.brand.red[600],
          }}
        >
          {content}
        </Text>
      </View>
    </Pressable>
  );
};

const useStyles = makeStyles((theme) => ({
  successContainer: {
    position: "absolute",
    height: height,
    width: width,
    backgroundColor: "rgba(52, 52, 52, 0.5)",
    zIndex: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  successWrapper: {
    maxWidth: (width * 3) / 4,
    backgroundColor: "white",
    paddingHorizontal: 60,
    paddingVertical: 18,
    alignItems: "center",
    borderRadius: 10,
    gap: 5,
  },
}));

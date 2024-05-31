import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React, { FC } from "react";
import { useRouter } from "expo-router";
import { IconChevronLeft } from "tabler-icons-react-native";

type BackToPreviousPageButtonProps = {
  backgroundColor?: string | "";
  color: string;
  style?: ViewStyle;
  size?: number;
  onPress?: () => void | null;
};

const { width, height } = Dimensions.get("window");
const BackToPreviousPageButton: FC<BackToPreviousPageButtonProps> = ({
  backgroundColor,
  color,
  style,
  size,
  onPress,
}) => {
  const router = useRouter();
  return (
    <View
      style={[
        {
          display: "flex",
          position: "absolute",
          height: "auto",
          top: height / 23,
          left: width / 15,
          zIndex: 99,
          backgroundColor: backgroundColor,
          paddingHorizontal: 3,
          borderRadius: 50,
        },
        style,
      ]}
    >
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
        onPress={() => {
          if (onPress) {
            onPress();
          } else {
            router.back();
          }
        }}
      >
        <IconChevronLeft size={size || 40} color={color} />
      </TouchableOpacity>
    </View>
  );
};

export default BackToPreviousPageButton;

const styles = StyleSheet.create({});

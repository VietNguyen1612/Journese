import { View } from "react-native";
import React, { FC } from "react";
import { makeStyles } from "@rneui/themed";
import LottieView from "lottie-react-native";

interface LoadingProps {
  size: Number | string;
}

//này là loading ko full màn hình
export const Loading: FC<LoadingProps> = ({ size }) => {
  const styles = useStyles(size);
  return (
    <View style={styles.container}>
      <LottieView
        source={require("../../assets/lotties/loading_animation.json")}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
        // colorFilters={[
        //     { color: "#18A4AE", keypath: "Dot4" },
        //     { color: "#18A4AE", keypath: "Dot3" },
        //     { color: "#18A4AE", keypath: "Dot2" },
        //     { color: "#18A4AE", keypath: "Dot1" },
        // ]}
        autoPlay
        loop
      />
    </View>
  );
};

const useStyles = makeStyles((theme, size) => ({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: size as any,
  },
  title: {
    // fontFeatureSettings: "'clig' off, 'liga' off",
    fontSize: 48,
    fontWeight: "500",
    color: theme.colors.brand.primary[700],
  },
}));

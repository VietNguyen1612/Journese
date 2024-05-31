import { Dimensions, View } from "react-native";
import React, { FC } from "react";
import { Image, Text, makeStyles } from "@rneui/themed";
import LottieView from "lottie-react-native";

const { height, width } = Dimensions.get("screen");
const JourneseIcon = require(`../../assets/images/journese-icon.png`);

//này là loading full màn
export const LoadingScreen: FC = ({}) => {
  const styles = useStyles();
  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Journese</Text> */}
      <View style={{ height: height / 6, aspectRatio: 1 }}>
        <Image
          source={JourneseIcon}
          style={{ width: "100%", height: "100%", resizeMode: "contain" }}
        />
      </View>
      <LottieView
        source={require("../../assets/lotties/loading_animation.json")}
        style={{
          position: "absolute",
          width: "100%",
          height: "43%",
          // backgroundColor: "red",
          bottom: "28.5%",
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

const useStyles = makeStyles((theme) => ({
  container: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    width: width,
    height: height,
  },
  title: {
    // fontFeatureSettings: "'clig' off, 'liga' off",
    fontSize: 60,
    fontWeight: "500",
    color: theme.colors.brand.primary[700],
  },
}));

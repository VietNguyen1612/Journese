import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ButtonGroup, makeStyles, useTheme } from "@rneui/themed";
import { PencilIcon } from "react-native-heroicons/solid";
// import { ListTrips } from "../../../components";
import { useRouter } from "expo-router";
const { height, width } = Dimensions.get("window");
const TripHome = () => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const { theme } = useTheme();
  const router = useRouter();
  const styles = useStyles();
  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 10 }}>
      <Text style={{ fontSize: 18 }}>Hành trình</Text>
      <View style={styles.optionContainer}>
        <ButtonGroup
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.buttonStyle}
          textStyle={styles.buttonTextStyle}
          buttons={["Diễn ra", "Sắp diễn ra", "Hoàn thành"]}
          selectedIndex={selectedIndex}
          onPress={(value) => {
            setSelectedIndex(value);
          }}
        />
      </View>
      {/* {selectedIndex === 0 && (
        <ListTrips
          onPress={() => {
            router.push("/(tabs)/(map)/on-going-trip-map");
          }}
        />
      )} */}
    </SafeAreaView>
  );
};

export default TripHome;

const useStyles = makeStyles((theme) => ({
  optionContainer: {
    alignItems: "center",
  },
  buttonContainer: {
    height: 38,
    width: width / 1.05,
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  buttonStyle: {},
  buttonTextStyle: {
    fontSize: 14,
  },
}));

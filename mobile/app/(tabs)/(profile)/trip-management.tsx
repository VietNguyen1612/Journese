import {
  Avatar,
  Button,
  ButtonGroup,
  Card,
  Text,
  makeStyles,
} from "@rneui/themed";
import { router } from "expo-router";
import { FC, useEffect, useState } from "react";
import { Dimensions, FlatList, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import LottieView from "lottie-react-native";
import { ListCardTrips } from "../../../components";
const { width, height } = Dimensions.get("window");

const TripManagement: FC = (/* Data của user */) => {
  const styles = useStyles();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  return (
    <View style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}>
      <ButtonGroup
        containerStyle={styles.buttonContainer}
        innerBorderStyle={{ width: 0 }}
        buttonStyle={{ borderRadius: 20 }}
        textStyle={styles.buttonTextStyle}
        buttons={["Nháp", "Sắp diễn ra", "Hoàn thành"]}
        selectedIndex={selectedIndex}
        onPress={(value) => {
          setSelectedIndex(value);
        }}
      />
      <View
        style={{
          paddingHorizontal: 15,
          marginBottom: height / 13,
          width: width,
        }}
      >
        {selectedIndex == 0 && (
          <ListCardTrips
            userTrip={true}
            status="DRAFT"
            onPress={(e) =>
              router.push({
                pathname: "/(general)/trip-detail",
                params: { tripId: e._id },
              })
            }
          />
        )}
        {selectedIndex == 1 && (
          <ListCardTrips
            userTrip={true}
            status="IN-COMING"
            onPress={(e) =>
              router.push({
                pathname: "/(general)/trip-detail",
                params: { tripId: e._id },
              })
            }
          />
        )}
        {selectedIndex == 2 && (
          <ListCardTrips
            userTrip={true}
            status="FINISHED"
            onPress={(e) =>
              router.push({
                pathname: "/(general)/trip-detail",
                params: { tripId: e._id },
              })
            }
          />
        )}
      </View>
    </View>
  );
};

export default TripManagement;

const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    height: 36,
    width: (width * 11) / 12,
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.brand.primary[600],
    borderRadius: 999,
    marginVertical: 14,
  },
  buttonTextStyle: {
    fontSize: 14,
  },
}));

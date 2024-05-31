import {
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { FC, useEffect, useState } from "react";
import { Avatar, Card, Chip, Image, makeStyles, useTheme } from "@rneui/themed";
import { ScrollView } from "react-native-gesture-handler";
import { AuthUser, useAuthStore } from "../../store";
const { width, height } = Dimensions.get("screen");

const TRIPS = [
  {
    _id: "1",
    title: "Di Ha Noi",
    places: ["Ho Tay", "Ho Guom"],
    status: "Đã hoàn thành",
  },
  {
    _id: "2",
    title: "Di Da Lat",
    places: ["Cho dem", "Ho Xuan Huong"],
    status: "Bản nháp",
  },
  {
    _id: "3",
    title: "Di Da Lat",
    places: ["Cho dem", "Ho Xuan Huong"],
    status: "Bản nháp",
  },
  {
    _id: "4",
    title: "Di Da Lat",
    places: ["Cho dem", "Ho Xuan Huong"],
    status: "Bản nháp",
  },
  {
    _id: "5",
    title: "Di Da Lat",
    places: [
      "Cho dem",
      "Ho Xuan Huong",
      "Tháp hoa atiso",
      "Nhà thờ con gà",
      "Ho Xuan Huong",
    ],
    status: "Sắp diễn ra",
  },
];

type Trip = {
  _id: string;
  title: string;
  places: string[];
  status: string;
};

interface ListTripsProps {
  onPress: (trip: Trip) => void;
  scrollEnabled?: boolean;
}

// export const StatusChip = ({ trip }: { trip: Trip }) => {
//   const { theme } = useTheme();
//   const tripstatus = {
//     DRAFT: "Bản nháp",
//     "IN-COMING": "Sắp diễn ra",
//     "ON-GOING": "Đang diễn ra",
//     COMPLETE: "Đã hoàn thành",
//   };
//   return (
//     <Chip
//       title={tripstatus[trip.status]}
//       type="outline"
//       buttonStyle={{
//         padding: 4,
//         borderColor:
//           trip.status === "DRAFT"
//             ? theme.colors.grey2
//             : trip.status === "IN-COMING"
//             ? theme.colors.brand.primary[700]
//             : trip.status === "COMPLETE"
//             ? theme.colors.brand.secondary[700]
//             : theme.colors.brand.yellow[800],
//       }}
//       titleStyle={{
//         fontSize: 12,
//         color:
//           trip.status === "DRAFT"
//             ? theme.colors.grey2
//             : trip.status === "IN-COMING"
//             ? theme.colors.brand.primary[700]
//             : trip.status === "COMPLETE"
//             ? theme.colors.brand.secondary[700]
//             : theme.colors.brand.yellow[800],
//       }}
//     />
//   );
// };

export const ListTrips: FC<ListTripsProps> = ({ onPress, scrollEnabled }) => {
  const { theme } = useTheme();
  const authPayload = useAuthStore((state) => state.authPayload);
  const styles = useStyles();
  // const { data, isLoading } = useCompleteTrip();

  return (
    <ScrollView
      scrollEnabled={scrollEnabled}
      showsVerticalScrollIndicator={false}
    >
      <FlatList
        showsVerticalScrollIndicator={false}
        style={{ paddingBottom: 16 }}
        scrollEnabled={false}
        data={TRIPS}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onPress(item)}>
            <Card
              wrapperStyle={styles.cardContainer}
              containerStyle={{ borderRadius: 10 }}
            >
              <View style={{ position: "absolute", top: -4, right: -4 }}>
                <StatusChip trip={item} />
              </View>
              <Image
                style={{
                  width: width / 7,
                  aspectRatio: 4 / 5,
                  borderRadius: 8,
                }}
                source={{
                  uri: "https://i.9mobi.vn/cf/Images/huy/2021/12/6/anh-gai-xinh-9.jpg",
                }}
              />
              <View style={{ width: "75%" }}>
                <Text style={styles.text}>{item.title}</Text>
                <Text numberOfLines={2}>
                  {/* để lúc render ra mấy place ko dính liền nhau */}
                  {item.places?.map((value, key) =>
                    key !== item.places.length - 1
                      ? (value = value + ", ")
                      : value
                  )}
                </Text>
              </View>
            </Card>
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  );
};

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: "500",
  },
}));

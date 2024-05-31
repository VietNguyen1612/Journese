import {
  Dimensions,
  FlatList,
  Pressable,
  Text,
  View,
  ViewStyle,
} from "react-native";
import React, { FC, useEffect } from "react";
import { Avatar, Chip, Image, makeStyles, useTheme } from "@rneui/themed";
import { RefreshControl } from "react-native-gesture-handler";
import { router, useNavigation } from "expo-router";
import { IconCalendarEvent, IconUser } from "tabler-icons-react-native";
import {
  useAllTripByUserId,
  useRecommendationTripByStatus,
} from "../../api/trip";
import { useAuthStore } from "../../store";
import { Loading } from "../Loading";
import LottieView from "lottie-react-native";
import { dateString2 } from "../../utils/regex";
import { Place, Trip } from "../../app/(general)/trip-detail";
const { width, height } = Dimensions.get("screen");
const profile_image = require("../../assets/images/profile-image.jpeg");

interface ListTripsProps {
  onPress: (item: Trip) => void;
  scrollEnabled?: boolean;
  userTrip: boolean;
  status: string;
  contentContainerStyle?: ViewStyle;
}

export const StatusChip = ({ trip }: { trip: Trip }) => {
  const { theme } = useTheme();
  const tripstatus: { [key: string]: string } = {
    DRAFT: "Bản nháp",
    "IN-COMING": "Sắp diễn ra",
    "ON-GOING": "Đang diễn ra",
    FINISHED: "Đã hoàn thành",
  };
  return (
    <Chip
      title={tripstatus[trip.status]}
      type="outline"
      buttonStyle={{
        padding: 4,
        borderColor:
          trip.status === "DRAFT"
            ? theme.colors.grey2
            : trip.status === "IN-COMING"
            ? theme.colors.brand.primary[700]
            : trip.status === "FINISHED"
            ? theme.colors.brand.secondary[700]
            : theme.colors.brand.yellow[800],
      }}
      titleStyle={{
        fontSize: 12,
        color:
          trip.status === "DRAFT"
            ? theme.colors.grey2
            : trip.status === "IN-COMING"
            ? theme.colors.brand.primary[700]
            : trip.status === "FINISHED"
            ? theme.colors.brand.secondary[700]
            : theme.colors.brand.yellow[800],
      }}
    />
  );
};

export const ListCardTrips: FC<ListTripsProps> = ({
  onPress,
  scrollEnabled,
  userTrip,
  status,
  contentContainerStyle,
}) => {
  const navigation = useNavigation();
  const { authPayload } = useAuthStore();
  const { theme } = useTheme();
  const styles = useStyles();
  const { data, isLoading, isFetching, refetch } = userTrip
    ? useAllTripByUserId(
        authPayload?.tokens.accessToken!,
        authPayload?.user._id!,
        status
      )
    : useRecommendationTripByStatus(
        authPayload?.tokens.accessToken!,
        authPayload?.user._id!,
        status
      );

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      refetch();
    });

    return unsubscribe;
  });

  return (
    <>
      {isLoading ? (
        <View style={{ height: height / 4 }}>
          <Loading size={"60%"} />
        </View>
      ) : !(data?.pages ? data?.pages.flat()?.length > 0 : data?.length > 0) ? (
        <View style={styles.notFound}>
          <LottieView
            source={require("../../assets/lotties/notfound_animation.json")}
            style={{
              width: "100%",
              height: 180,
            }}
            autoPlay
            loop
          />
          <Text style={styles.notFoundText}>Không có hành trình!</Text>
        </View>
      ) : (
        <FlatList
          scrollEnabled={scrollEnabled}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={contentContainerStyle}
          onEndReached={() => console.log(1)}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={() => console.log(2)}
            />
          }
          data={[""]}
          renderItem={(item) => (
            <FlatList
              scrollEnabled={false}
              numColumns={2}
              columnWrapperStyle={{
                justifyContent: "space-between",
              }}
              data={data.pages ? data.pages.flat() : data}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => onPress(item)}
                  style={{
                    width: "48%",
                    aspectRatio: 9 / 14,
                    marginBottom: 10,
                    backgroundColor: theme.colors.brand.primary[50],
                    borderRadius: 5,
                  }}
                >
                  <View style={{ height: "62%" }}>
                    <View
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        zIndex: 10,
                        backgroundColor: "rgba(255,255,255,0.8)",
                        borderRadius: 20,
                      }}
                    >
                      <StatusChip trip={item} />
                    </View>
                    <Image
                      source={
                        item.places[0]?.images
                          ? { uri: item.places[0]?.images[0] }
                          : require("../../assets/images/default-image.jpeg")
                      }
                      style={{
                        width: "100%",
                        height: "100%",
                        borderTopRightRadius: 5,
                        borderTopLeftRadius: 5,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      height: "35%",
                      paddingHorizontal: 6,
                      paddingVertical: 6,
                      flexDirection: "column",
                      gap: 6,
                    }}
                  >
                    <Text
                      numberOfLines={2}
                      style={{
                        fontSize: 15,
                        paddingHorizontal: 3,
                      }}
                    >
                      {item.title}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 3,
                      }}
                    >
                      <IconUser
                        size={18}
                        color={theme.colors.brand.primary[700]}
                      />
                      <View>
                        <FlatList
                          horizontal
                          scrollEnabled={false}
                          contentContainerStyle={{ gap: -10 }}
                          data={[...item.participates].slice(0, 4)}
                          renderItem={({ item, index }) => (
                            <Avatar
                              key={index}
                              rounded
                              containerStyle={{
                                borderColor: "white",
                                borderWidth: 1,
                              }}
                              size={20}
                              source={
                                item?.avatarUrl
                                  ? { uri: item?.avatarUrl }
                                  : profile_image
                              }
                            />
                          )}
                          ListFooterComponent={
                            <Text
                              style={{
                                color: theme.colors.brand.primary[700],
                                fontSize: 11,
                              }}
                            >
                              {item.participates.length > 3
                                ? "3+"
                                : item.participates.length}{" "}
                              Thành viên
                            </Text>
                          }
                          ListFooterComponentStyle={{
                            marginLeft: 14,
                            justifyContent: "center",
                          }}
                        />
                      </View>
                    </View>
                    {item.startDate && (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <IconCalendarEvent
                          size={18}
                          color={theme.colors.grey2}
                        />
                        <Text
                          style={{ fontSize: 12, color: theme.colors.grey2 }}
                        >
                          {dateString2(item.startDate)} -{" "}
                          {dateString2(item.endDate)}
                        </Text>
                      </View>
                    )}
                  </View>
                </Pressable>
              )}
            />
          )}
        />
      )}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  notFound: {
    alignItems: "center",
    marginBottom: 30,
  },
  notFoundText: {
    fontSize: 22,
    fontWeight: "600",
    color: theme.colors.grey3,
  },
}));

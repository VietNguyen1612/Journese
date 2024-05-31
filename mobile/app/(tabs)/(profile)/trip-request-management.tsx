import {
  Avatar,
  Badge,
  Button,
  ButtonGroup,
  Card,
  Image,
  Text,
  makeStyles,
  useTheme,
} from "@rneui/themed";
import { router, useNavigation } from "expo-router";
import { FC, useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  TouchableOpacity,
  View,
} from "react-native";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import LottieView from "lottie-react-native";
import { ListCardTrips, Loading } from "../../../components";
import {
  useAllRequestJoinTripSended,
  useAllTripByUserId,
} from "../../../api/trip";
import { useAuthStore } from "../../../store";
import { Trip } from "../../(general)/trip-detail";
import { IconCalendarEvent } from "tabler-icons-react-native";
import { dateString2 } from "../../../utils/regex";
const { width, height } = Dimensions.get("window");

const RequestManagement: FC = () => {
  const styles = useStyles();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const { authPayload } = useAuthStore();
  const {
    data: reqReceivedData,
    isLoading: reqReceivedLoading,
    refetch: reqReceivedRefetch,
  } = useAllTripByUserId(
    authPayload?.tokens.accessToken!,
    authPayload?.user._id!,
    "IN-COMING"
  );
  const {
    data: reqSendedData,
    isLoading: reqSendedLoading,
    refetch: reqSendedRefetch,
  } = useAllRequestJoinTripSended(
    authPayload?.tokens.accessToken!,
    authPayload?.user._id!
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      reqReceivedRefetch();
      reqSendedRefetch();
    });

    return unsubscribe;
  });

  return (
    <View style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}>
      <ButtonGroup
        containerStyle={styles.buttonContainer}
        innerBorderStyle={{ width: 0 }}
        buttonStyle={{ borderRadius: 20 }}
        textStyle={styles.buttonTextStyle}
        buttons={["Yêu cầu đã nhận", "Yêu cầu đã gửi"]}
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
          <>
            {reqReceivedLoading ? (
              <View style={{ height: height / 4 }}>
                <Loading size={"60%"} />
              </View>
            ) : !(
                reqReceivedData.filter(
                  (item: Trip) =>
                    item.participates_requested.length > 0 &&
                    authPayload?.user._id === item.userId.toString()
                ).length > 0
              ) ? (
              <View style={styles.notFound}>
                <LottieView
                  source={require("../../../assets/lotties/notfound_animation.json")}
                  style={{
                    width: "100%",
                    height: 180,
                  }}
                  autoPlay
                  loop
                />
                <Text style={styles.notFoundText}>Không có yêu cầu nào!</Text>
              </View>
            ) : (
              <FlatList
                showsVerticalScrollIndicator={false}
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
                    style={{ marginTop: 14 }}
                    scrollEnabled={false}
                    numColumns={2}
                    columnWrapperStyle={{
                      justifyContent: "space-between",
                    }}
                    data={reqReceivedData.filter(
                      (item: Trip) =>
                        item.participates_requested.length > 0 &&
                        authPayload?.user._id === item.userId.toString()
                    )}
                    renderItem={({ item }: { item: Trip }) => (
                      <Pressable
                        onPress={() =>
                          router.push({
                            pathname:
                              "/(tabs)/(profile)/trip-request-received-list",
                            params: {
                              tripId: item._id,
                              numOfParticipants: item.participates.length,
                            },
                          })
                        }
                        style={{
                          width: "48%",
                          aspectRatio: 9 / 14,
                          marginBottom: 10,
                          backgroundColor: theme.colors.brand.primary[50],
                          borderRadius: 5,
                        }}
                      >
                        <View style={{ height: "62%" }}>
                          <Image
                            source={
                              item.places[0]?.images
                                ? { uri: item.places[0]?.images[0] }
                                : require("../../../assets/images/default-image.jpeg")
                            }
                            style={{
                              width: "100%",
                              height: "100%",
                              borderTopRightRadius: 5,
                              borderTopLeftRadius: 5,
                            }}
                          />
                          <Badge
                            value={item.participates_requested.length}
                            badgeStyle={{
                              transform: [{ scale: 1.7 }],
                              backgroundColor: "white",
                              borderColor: theme.colors.brand.primary[600],
                              borderWidth: 0.6,
                            }}
                            textStyle={{
                              color: theme.colors.brand.primary[600],
                            }}
                            containerStyle={{
                              position: "absolute",
                              top: 14,
                              right: 14,
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
                              fontSize: 16,
                              paddingHorizontal: 3,
                              fontWeight: "500",
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
                                  style={{
                                    fontSize: 12,
                                    color: theme.colors.grey2,
                                  }}
                                >
                                  {dateString2(item.startDate)} -{" "}
                                  {dateString2(item.endDate)}
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                      </Pressable>
                    )}
                  />
                )}
              />
            )}
          </>
        )}
        {selectedIndex == 1 && (
          <>
            {reqSendedLoading ? (
              <View style={{ height: height / 4 }}>
                <Loading size={"60%"} />
              </View>
            ) : !(reqSendedData?.length > 0) ? (
              <View style={styles.notFound}>
                <LottieView
                  source={require("../../../assets/lotties/notfound_animation.json")}
                  style={{
                    width: "100%",
                    height: 180,
                  }}
                  autoPlay
                  loop
                />
                <Text style={styles.notFoundText}>Không có yêu cầu nào!</Text>
              </View>
            ) : (
              <FlatList
                showsVerticalScrollIndicator={false}
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
                    style={{ marginTop: 14 }}
                    scrollEnabled={false}
                    numColumns={2}
                    columnWrapperStyle={{
                      justifyContent: "space-between",
                    }}
                    data={reqSendedData}
                    renderItem={({ item }) => (
                      <Pressable
                        onPress={() =>
                          router.push({
                            pathname: "/(general)/trip-detail",
                            params: { tripId: item.tripId._id },
                          })
                        }
                        style={{
                          width: "48%",
                          aspectRatio: 9 / 13,
                          marginBottom: 10,
                          backgroundColor: theme.colors.brand.primary[50],
                          borderRadius: 5,
                        }}
                      >
                        <View style={{ height: "65%" }}>
                          <Image
                            source={
                              item.tripId.places[0]?.images
                                ? { uri: item.tripId.places[0]?.images[0] }
                                : require("../../../assets/images/default-image.jpeg")
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
                              fontSize: 16,
                              paddingHorizontal: 3,
                              fontWeight: "500",
                            }}
                          >
                            {item.tripId.title}
                          </Text>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 3,
                            }}
                          >
                            {item.tripId.startDate && (
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
                                  style={{
                                    fontSize: 12,
                                    color: theme.colors.grey2,
                                  }}
                                >
                                  {dateString2(item.tripId.startDate)} -{" "}
                                  {dateString2(item.tripId.endDate)}
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                      </Pressable>
                    )}
                  />
                )}
              />
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default RequestManagement;

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

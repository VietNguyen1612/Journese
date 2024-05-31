import {
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";
import React, { FC, useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Chip,
  Image,
  makeStyles,
  useTheme,
} from "@rneui/themed";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import { router, useNavigation } from "expo-router";
import { IconCalendarEvent, IconUser } from "tabler-icons-react-native";
import {
  useAllTripByUserId,
  useRecommendationTripByStatus,
} from "../../api/trip";
import { useAuthStore } from "../../store";
import { Loading } from "../Loading";
import LottieView from "lottie-react-native";
import { dateString2, returnFormattedDate } from "../../utils/regex";
import { Place, Trip } from "../../app/(general)/trip-detail";
import { useAllUserAds } from "../../api/ads";
import axios from "axios";
import AnimatedLottieView from "lottie-react-native";
const { width, height } = Dimensions.get("screen");
const profile_image = require("../../assets/images/profile-image.jpeg");

interface ListAdsProps {
  isPaid: boolean;
  isExpired: boolean;
  isValid: boolean;
}

function getStatus({ isValid, isExpired, isPaid }: ListAdsProps) {
  if (isValid && isExpired && isPaid) {
    return "Hết hạn";
  } else if (isValid && !isExpired && !isPaid) {
    return "Đã duyệt";
  } else if (isValid && !isExpired && isPaid) {
    return "Đã thanh toán";
  } else if (!isValid && !isExpired && !isPaid) {
    return "Đã tạo";
  }
}

const StatusChip = (props: ListAdsProps) => {
  const { theme } = useTheme();

  return (
    <Chip
      title={getStatus(props)}
      type="outline"
      buttonStyle={{
        padding: 4,
        borderColor:
          getStatus(props) === "Đã tạo"
            ? theme.colors.grey2
            : getStatus(props) === "Đã duyệt"
            ? theme.colors.brand.primary[700]
            : getStatus(props) === "Đã thanh toán"
            ? theme.colors.brand.secondary[700]
            : theme.colors.brand.yellow[800],
      }}
      titleStyle={{
        fontSize: 12,
        color:
          getStatus(props) === "Đã tạo"
            ? theme.colors.grey2
            : getStatus(props) === "Đã duyệt"
            ? theme.colors.brand.primary[700]
            : getStatus(props) === "Đã thanh toán"
            ? theme.colors.brand.secondary[700]
            : theme.colors.brand.yellow[800],
      }}
    />
  );
};

export const ListAds: FC<ListAdsProps> = ({ isPaid, isExpired, isValid }) => {
  const navigation = useNavigation();
  const { authPayload } = useAuthStore();
  const { theme } = useTheme();
  const styles = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const { data, isFetching, refetch } = useAllUserAds(
    authPayload?.tokens.accessToken!,
    authPayload?.user._id!,
    isPaid,
    isExpired,
    isValid
  );

  const returnExpriyDate = (dateString: string) => {
    let date = new Date(dateString);
    date.setDate(date.getDate() + 5);
    dateString = date.toString();
    return returnFormattedDate(dateString);
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      refetch();
    });

    return unsubscribe;
  });

  const handlePayment = async (adId: string) => {
    setIsLoading(true);
    const res = await axios.post(
      `${process.env.EXPO_PUBLIC_BACKEND_API}/ads/payment`,
      {
        advertisementId: adId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const orderUrl = res.data["metadata"]["order_url"];
    setIsLoading(false);
    router.push(orderUrl);
  };

  return (
    <>
      <Modal transparent={true} visible={isLoading}>
        <View
          style={{
            height: height,
            width: width,
            position: "absolute",
            justifyContent: "center",
            backgroundColor: "rgba(40,40,40,0.6)",
            alignItems: "center",
            zIndex: 20,
          }}
        >
          <View
            style={{
              width: width / 2,
              height: height / 8,
              backgroundColor: "white",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 18,
              borderTopLeftRadius: 60,
            }}
          >
            <View
              style={{
                height: height / 7,
                aspectRatio: 1,
                position: "absolute",
                bottom: "40%",
                backgroundColor: "white",
                paddingTop: 20,
                borderRadius: 20,
              }}
            >
              <Image
                source={require("../../assets/images/journese-icon.png")}
                style={{
                  width: "100%",
                  height: "100%",
                  resizeMode: "contain",
                }}
              />
            </View>
            <AnimatedLottieView
              source={require("../../assets/lotties/loading_animation.json")}
              style={{
                position: "absolute",
                width: width,
                height: "110%",
                bottom: "-16%",
              }}
              autoPlay
              loop
            />
          </View>
        </View>
      </Modal>
      {isFetching ? (
        <View style={{ height: height / 4 }}>
          <Loading size={"60%"} />
        </View>
      ) : !(data?.length > 0) ? (
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
          <Text style={styles.notFoundText}>Không có quảng cáo!</Text>
        </View>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={refetch} />
          }
        >
          <FlatList
            scrollEnabled={false}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: "space-between",
            }}
            data={data}
            renderItem={({ item }) => (
              <Pressable
                key={item._id}
                style={{
                  width: "48%",
                  aspectRatio: 9 / 14,
                  marginBottom: 10,
                  marginHorizontal: 5,
                  backgroundColor: theme.colors.brand.primary[50],
                  borderRadius: 5,
                  shadowRadius: 4,
                  shadowColor: theme.colors.grey3,
                  shadowOffset: { width: 4, height: 4 },
                  shadowOpacity: 0.4,
                }}
              >
                <View style={{ height: "70%" }}>
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
                    <StatusChip
                      isExpired={isExpired}
                      isPaid={isPaid}
                      isValid={isValid}
                    />
                  </View>
                  <Image
                    source={{ uri: item.image }}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderTopRightRadius: 5,
                      borderTopLeftRadius: 5,
                    }}
                  />
                </View>
                {(getStatus({ isValid, isExpired, isPaid }) === "Đã duyệt" ||
                  getStatus({ isValid, isExpired, isPaid }) === "Hết hạn") && (
                  <View
                    style={{
                      flex: 1,
                      paddingHorizontal: 6,
                      paddingVertical: 6,
                      flexDirection: "column",
                      gap: 6,
                      justifyContent: "center",
                    }}
                  >
                    <Button onPress={() => handlePayment(item._id)}>
                      Thanh toán
                    </Button>
                  </View>
                )}
                {getStatus({ isValid, isExpired, isPaid }) === "Đã tạo" && (
                  <View
                    style={{
                      flex: 1,
                      paddingHorizontal: 6,
                      paddingVertical: 6,
                      flexDirection: "column",
                      gap: 6,
                      justifyContent: "center",
                    }}
                  >
                    <Button disabled>Đang chờ duyệt</Button>
                  </View>
                )}
                {getStatus({ isValid, isExpired, isPaid }) ===
                  "Đã thanh toán" && (
                  <View
                    style={{
                      flex: 1,
                      paddingHorizontal: 6,
                      paddingVertical: 6,
                      flexDirection: "column",
                      gap: 6,
                      justifyContent: "center",
                    }}
                  >
                    <Button disabled>
                      <Text style={{ flexWrap: "wrap" }}>
                        Hết hạn vào {returnExpriyDate(item.paidAt)}
                      </Text>
                    </Button>
                  </View>
                )}
              </Pressable>
            )}
          />
        </ScrollView>
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

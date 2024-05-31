import { useLocalSearchParams } from "expo-router";
import { Dimensions, Text, View } from "react-native";
import { getNearbyPlaces } from "../../api/place";
import { FlatList } from "react-native-gesture-handler";
import { Button, Image, useTheme } from "@rneui/themed";
import { Loading, SuccessAnimation } from "../../components";
import AnimatedLottieView from "lottie-react-native";
import {
  IconCheck,
  IconLoader,
  IconSquarePlus,
} from "tabler-icons-react-native";
import { useAuthStore } from "../../store";
import { addPlaceToTrip, getTripDetail } from "../../api/trip";
import { useEffect, useState } from "react";
import { Trip } from "./trip-detail";
const { width, height } = Dimensions.get("window");

const PlacesSuggestion = () => {
  const { authPayload } = useAuthStore();
  const { theme } = useTheme();
  const [trip, setTrip] = useState<Trip>();
  const [uniqueData, setUniqueData] = useState<any>();
  const { tripId, longitude, latitude } = useLocalSearchParams<{
    tripId: string;
    longitude: string;
    latitude: string;
  }>();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { data, isFetching, error, refetch } = getNearbyPlaces([
    parseFloat(longitude),
    parseFloat(latitude),
  ]);

  useEffect(() => {
    const fetchTripDetail = async () => {
      const res = await getTripDetail(tripId, authPayload?.user._id);
      await setTrip(res["metadata"]);
      await setUniqueData(
        data?.filter(
          (item: any, index: number, self: any) =>
            index ===
            self.findIndex(
              (t: any) => t.properties.place_id === item.properties.place_id
            )
        )
      );
      setIsLoading(false);
    };
    if (isLoading) fetchTripDetail();
  }, [tripId, isLoading]);

  const handleAddPlace = async (place_id: string) => {
    let addPlaceToTripData;
    if (authPayload) {
      addPlaceToTripData = await addPlaceToTrip(
        authPayload.user._id,
        authPayload.tokens.accessToken,
        place_id,
        [tripId]
      );
    }
    setIsSuccess(true);
    setIsLoading(true);
    setTimeout(() => {
      setIsSuccess(false);
    }, 1500);
  };

  return (
    <>
      {isSuccess && (
        <SuccessAnimation
          isSuccess={true}
          content="Thêm địa điểm thành công!"
          onPress={() => setIsSuccess(false)}
          wrapperStyle={{ marginTop: -height / 5 }}
        />
      )}
      {isLoading ? (
        <View
          style={{
            height: height,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              height: height / 6,
              aspectRatio: 1,
              position: "absolute",
              bottom: height * 0.55,
            }}
          >
            <Image
              source={require(`../../assets/images/journese-icon.png`)}
              style={{ width: "100%", height: "100%", resizeMode: "contain" }}
            />
          </View>
          <Loading size="20%" />
        </View>
      ) : (
        <View>
          {uniqueData?.length > 0 ? (
            <View
              style={{
                backgroundColor: theme.colors.grey5,
              }}
            >
              <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingTop: 18,
                  paddingHorizontal: 20,
                  paddingBottom: 30,
                  gap: 25,
                  alignItems: "center",
                }}
                data={uniqueData}
                keyExtractor={(item, index) => item.properties.place_id}
                renderItem={({ item, index }) => (
                  <View
                    style={{
                      width: (width * 5) / 6,
                      padding: 14,
                      backgroundColor: "white",
                      borderRadius: 10,
                      gap: 10,
                      shadowRadius: 3,
                      shadowOpacity: 0.1,
                      shadowOffset: { width: 3, height: 3 },
                    }}
                  >
                    <View
                      style={{
                        position: "absolute",
                        top: 35,
                        right: 35,
                        zIndex: 1,
                        borderRadius: 15,
                      }}
                    >
                      <Button
                        disabled={trip?.places
                          .map((item) => item.place_id)
                          .includes(item.properties.place_id)}
                        disabledTitleStyle={{
                          color: theme.colors.grey2,
                        }}
                        onPress={() => handleAddPlace(item.properties.place_id)}
                        buttonStyle={{
                          backgroundColor: "white",
                          gap: 4,
                          paddingHorizontal: 15,
                        }}
                        radius={15}
                        title={
                          trip?.places
                            .map((item) => item.place_id)
                            .includes(item.properties.place_id)
                            ? "Đã thêm"
                            : "Thêm"
                        }
                        titleStyle={{
                          color: theme.colors.brand.primary[600],
                          fontSize: 15,
                        }}
                        icon={
                          trip?.places
                            .map((item) => item.place_id)
                            .includes(item.properties.place_id) ? (
                            <IconCheck size={20} color={theme.colors.grey2} />
                          ) : (
                            <IconSquarePlus
                              size={20}
                              color={theme.colors.brand.primary[600]}
                            />
                          )
                        }
                      />
                    </View>
                    <View
                      style={{
                        width: "100%",
                        aspectRatio: 3 / 2,
                      }}
                    >
                      <Image
                        style={{
                          width: "100%",
                          height: "100%",
                          resizeMode: "cover",
                        }}
                        borderRadius={10}
                        source={
                          item.properties.image
                            ? { uri: item.properties.image }
                            : require("../../assets/images/default-image.jpeg")
                        }
                      />
                    </View>
                    <View
                      style={{
                        gap: 3,
                        width: (width * 5) / 7,
                        paddingHorizontal: 10,
                      }}
                    >
                      <Text
                        numberOfLines={2}
                        style={{ fontSize: 16, fontWeight: "500" }}
                      >
                        {item.properties.name}
                      </Text>
                      <Text
                        numberOfLines={2}
                        style={{ fontSize: 13, color: theme.colors.grey2 }}
                      >
                        {item.properties.address}
                      </Text>
                    </View>
                  </View>
                )}
              />
            </View>
          ) : (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: width,
                height: (height * 3) / 4,
              }}
            >
              <AnimatedLottieView
                source={require("../../assets/lotties/notfound_animation.json")}
                style={{
                  width: "100%",
                  height: 180,
                }}
                autoPlay
                loop
              />
              <Text
                style={{
                  textAlign: "center",
                  padding: 20,
                  fontSize: 18,
                  fontWeight: "600",
                  color: theme.colors.grey3,
                }}
              >
                Không có địa điểm nào!
              </Text>
              <Button
                radius={10}
                buttonStyle={{
                  paddingHorizontal: 26,
                  gap: 7,
                  paddingLeft: 20,
                }}
                title="Tải lại"
                iconRight
                icon={<IconLoader color="white" />}
                onPress={() => setIsLoading(true)}
              />
            </View>
          )}
        </View>
      )}
    </>
  );
};

export default PlacesSuggestion;

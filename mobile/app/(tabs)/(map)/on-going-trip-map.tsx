import { Alert, Dimensions, Pressable, Text, View } from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigation, useRouter } from "expo-router";
import { Coordinates } from "@mapbox/mapbox-sdk/lib/classes/mapi-request";
import Mapbox, {
  Camera,
  LineLayer,
  MapView,
  MarkerView,
  ShapeSource,
  UserLocation,
  UserTrackingMode,
} from "@rnmapbox/maps";
import { ListFriends, Loading, MapSideFunctionBar } from "../../../components";
import BottomSheet, { TouchableOpacity } from "@gorhom/bottom-sheet";
import {
  Avatar,
  Button,
  ButtonGroup,
  Card,
  Chip,
  Divider,
  Image,
  makeStyles,
  useTheme,
} from "@rneui/themed";
import {
  IconFocus2,
  IconFocusCentered,
  IconMapPinPin,
  IconPin,
  IconPinnedOff,
  IconPointFilled,
} from "tabler-icons-react-native";
import {
  FlatList,
  RefreshControl,
  ScrollView,
} from "react-native-gesture-handler";
import {
  useTrackUserLocation,
  useUserLocation,
} from "../../../api/mapboxLocation";
import {
  joinTrip,
  scheduleTrip,
  updateTrip,
  useAllTripByUserId,
  useOngoingTrip,
} from "../../../api/trip";
import { AuthUser, useAuthStore, useNavPlaceStore } from "../../../store";
import { io, Socket } from "socket.io-client";
import { Place } from "../../(general)/trip-detail";
import AnimatedLottieView from "lottie-react-native";
import { dateString, dateString2 } from "../../../utils/regex";
import axios from "axios";

let access_token = process.env.EXPO_PUBLIC_MAPBOX_API || null;
Mapbox.setAccessToken(access_token);
const { height, width } = Dimensions.get("window");
const default_image = require("../../../assets/images/default-image.jpeg");
const profile_image = require("../../../assets/images/profile-image.jpeg");

type LocationTracking = {
  user: AuthUser;
  location: Coordinates;
};

const OnGoingTripMap = () => {
  const camera = useRef<Camera>(null);
  const [followingUser, setFollowingUser] = useState(true);
  const authPayload = useAuthStore((state) => state.authPayload);
  const setNavPlace = useNavPlaceStore((state) => state.setNavPlace);
  const { navPlace } = useNavPlaceStore();
  const [routeDirection, setRouteDirection] = useState();
  const { data, isLoading, isFetching, isError, refetch } = useOngoingTrip(
    authPayload?.user._id,
    authPayload?.tokens.accessToken
  );
  const [places, setPlaces] = useState();

  const {
    data: incTrip,
    isLoading: incTripLoading,
    isFetching: incTripFetching,
    isError: incTripError,
    refetch: incTripRefetch,
  } = useAllTripByUserId(
    authPayload?.tokens.accessToken!,
    authPayload?.user._id!,
    ["IN-COMING", "ON-GOING"]
  );

  const {
    location,
    userCurrentAddress,
    refetch: userLocationRefetch,
  } = useUserLocation();
  const { trackLocation } = useTrackUserLocation();
  const [partLocation, setPartLocation] = useState<Array<LocationTracking>>([]);
  const [socket, setSocket] = useState<Socket>();
  const navigation = useNavigation();

  function makeRouterFeature(coordinates: [number, number][]): any {
    let routerFeature = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: coordinates,
          },
        },
      ],
    };
    return routerFeature;
  }

  async function createRouterLine(long: number, lat: number): Promise<void> {
    const geometries = "geojson";
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${location};${long},${lat}?alternatives=true&geometries=${geometries}&steps=true&overview=full&access_token=${access_token}`;
    await setFollowingUser(false);
    camera.current?.flyTo([long, lat], 1000);
    try {
      let response = await axios.get(url);
      let json = await response.data;
      let coordinates = json["routes"][0]["geometry"]["coordinates"];
      let steps = json["routes"][0]["legs"][0].steps;
      let durationNum = json["routes"][0]["duration"];
      //để console.log. K để bottom sheet đ hiện :v
      durationNum = Math.floor(durationNum / 60);
      let distanceNum = json["routes"][0]["distance"];
      distanceNum = (distanceNum / 1000).toFixed(1);
      let arr = [];
      for (const step of steps) {
        arr?.push(step.maneuver.instruction);
      }
      if (coordinates.length) {
        const routerFeature = makeRouterFeature([...coordinates]);
        setRouteDirection(routerFeature);
      }
    } catch (e) {
      console.log(e);
      setRouteDirection(undefined);
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      refetch();
      incTripRefetch();
      userLocationRefetch();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (data && data[0] && data[0]._id) {
      const newSocket = io(
        `${process.env.EXPO_PUBLIC_SOCKET}?userId=${authPayload?.user._id}&&tripId=${data[0]._id}`
      );

      setSocket(newSocket);
    }
    if (data && data[0]) {
      const flatPlaces = data[0].schedule.flatMap(
        (dayPlaces: Array<Place>, dayIndex: number) => {
          if (dayIndex === 0) {
            return dayPlaces.map((place: Place) => {
              return {
                ...place,
              };
            });
          } else {
            return [
              dayIndex,
              ...dayPlaces.map((place: Place) => {
                return {
                  ...place,
                };
              }),
            ];
          }
        }
      );

      setPlaces(flatPlaces);
    }
  }, [data]);

  useEffect(() => {
    if (
      socket &&
      data[0].onGoingParticipates.find(
        (participant: any) => participant._id === authPayload?.user._id
      )
    ) {
      socket.on("connect", () => {
        console.log("connected to server");
      });

      socket.on("location-update", (location: LocationTracking) => {
        let newPartLocation = partLocation?.filter(
          (item) => item.user._id !== location.user._id
        );
        newPartLocation?.push(location);
        setPartLocation(newPartLocation);
      });

      socket.on("pin-place-update", (pinPlace: Place | null) => {
        setPinnedPlace(pinPlace);
      });

      return () => {
        socket.off("connect");
        socket.off("location-update");
      };
    }
  }, [socket]);

  useEffect(() => {
    if (
      trackLocation &&
      socket &&
      data[0].onGoingParticipates.find(
        (participant: any) => participant._id === authPayload?.user._id
      )
    ) {
      socket.emit("location-sending", trackLocation);

      return () => {
        socket.off("location-sending");
      };
    }
  }, [trackLocation, socket]);

  const router = useRouter();
  const { theme } = useTheme();
  const styles = useStyles();

  //state
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [pinnedPlace, setPinnedPlace] = useState<Place | null>(null);
  const [componentHeight, setComponentHeight] = useState<number>();

  //for the bottom sheet
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ["10%", "30%", "90%"], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {}, []);
  const handleNavigation = (item: any) => {
    setNavPlace({
      place_id: item.place_id,
      name: item.name,
      address: item.address,
      geolocation: {
        type: item.type,
        coordinates: item.geolocation.coordinates,
      },
    });
    router.push("/(tabs)/(map)/navigation");
  };

  const handlePinPlace = (item: Place | null) => {
    setPinnedPlace(item);
    if (socket) {
      socket.emit("pin-place", item?.place_id);
    }
  };

  const handleCompleteTrip = async () => {
    const id = data[0]._id;
    await updateTrip(
      id,
      authPayload?.user._id!,
      authPayload?.tokens.accessToken!,
      { status: "FINISHED" }
    );

    await scheduleTrip(
      id,
      authPayload?.user._id!,
      authPayload?.tokens.accessToken!,
      {
        status: "FINISHED",
        startDate: new Date(data[0].startDate),
        endDate: new Date(),
      }
    );
    router.push({
      pathname: "/(general)/trip-detail",
      params: { tripId: id },
    });
    // incTripRefetch();
    // refetch();
    router.push({
      pathname: "/(general)/trip-detail",
      params: { tripId: id },
    });
  };

  const handleStartTrip = async (
    tripId: string,
    startDate: string,
    endDate: string
  ) => {
    await joinTrip(
      tripId,
      authPayload?.user._id!,
      authPayload?.tokens.accessToken!,
      [authPayload?.user._id!],
      "ON-GOING"
    );

    const req = {
      status: "ON-GOING",
      startDate: new Date(),
      endDate: new Date(endDate),
    };

    await scheduleTrip(
      tripId,
      authPayload?.user._id!,
      authPayload?.tokens.accessToken!,
      req
    );

    incTripRefetch();
    refetch();
  };

  const handleJoinTrip = async (tripId: string) => {
    await joinTrip(
      tripId,
      authPayload?.user._id!,
      authPayload?.tokens.accessToken!,
      [
        ...data[0].onGoingParticipates.map((item: any) => item._id),
        authPayload?.user._id,
      ],
      "ON-GOING"
    );

    incTripRefetch();
    refetch();
  };

  return (
    <View style={{ flex: 1 }}>
      {/* <View style={{ position: 'absolute', bottom: 0 }}>
                <Button onPress={() => { router.push('/(tabs)/(map)/navigation') }} style={{ height: 30, width: 30 }}>navigation</Button>
            </View> */}
      {location ? (
        <MapView
          style={{ width: "100%", height: "95%" }}
          zoomEnabled={true}
          styleURL="mapbox://styles/vietnguyen123/clu58ub8l004r01pq9c17a8ro"
          rotateEnabled={true}
          onTouchStart={() => setFollowingUser(false)}
        >
          <Camera
            followUserLocation={followingUser}
            followUserMode={UserTrackingMode.Follow}
            zoomLevel={15}
            animationMode="flyTo"
            animationDuration={6000}
            ref={camera}
          />

          <UserLocation showsUserHeadingIndicator={true} />
          {partLocation?.map((item) => (
            <MarkerView
              key={item.user._id}
              children={
                <Avatar
                  source={
                    item?.user.avatarUrl
                      ? { uri: item?.user.avatarUrl }
                      : profile_image
                  }
                  rounded
                  size="small"
                />
              }
              coordinate={item.location}
            />
          ))}
          <ShapeSource id="line1" shape={routeDirection}>
            <LineLayer
              id="routerLine01"
              style={{
                lineColor: theme.colors.brand.primary[500],
                lineWidth: 4,
              }}
            />
          </ShapeSource>
        </MapView>
      ) : (
        <Loading size={"50%"} />
      )}
      <MapSideFunctionBar
        onNearbyPress={() => {
          router.push("/(tabs)/(map)/nearby-places");
        }}
      />
      <View style={{ position: "absolute", top: height / 8, left: 8 }}>
        <Button
          radius={99}
          type="outline"
          buttonStyle={{
            backgroundColor: "white",
            borderColor: followingUser
              ? theme.colors.brand.primary[700]
              : "black",
          }}
          icon={
            followingUser ? (
              <IconFocus2 color={theme.colors.brand.primary[700]} size={30} />
            ) : (
              <IconFocusCentered color={"black"} size={30} />
            )
          }
          onPress={() => setFollowingUser((pre) => !pre)}
        />
      </View>
      <View style={{ position: "absolute", top: height / 13, right: 10 }}>
        <Button
          disabled={routeDirection === undefined}
          radius={99}
          type="outline"
          buttonStyle={{
            backgroundColor: "white",
            paddingHorizontal: 20,
            borderWidth: 0,
          }}
          titleStyle={{
            color: theme.colors.brand.primary[700],
            fontWeight: "600",
            fontSize: 17,
          }}
          title="Chỉ đường"
          onPress={() => router.push("/(tabs)/(map)/navigation")}
        />
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        style={{ paddingHorizontal: 8, marginBottom: 30 }}
      >
        {!isError || !incTripError ? (
          isLoading || incTripLoading ? (
            <Loading size="30%" />
          ) : (
            <>
              {data &&
              data.length > 0 &&
              data[0].onGoingParticipates.find(
                (participant: any) => participant._id === authPayload?.user._id
              ) ? (
                <>
                  <View style={styles.optionContainer}>
                    <ButtonGroup
                      containerStyle={styles.buttonContainer}
                      buttonStyle={styles.buttonStyle}
                      textStyle={styles.buttonTextStyle}
                      buttons={["Hành trình", "Thành viên"]}
                      selectedIndex={selectedIndex}
                      onPress={(value) => {
                        setSelectedIndex(value);
                      }}
                    />
                  </View>

                  {selectedIndex === 0 && (
                    <ScrollView
                      snapToAlignment="start"
                      snapToInterval={componentHeight}
                      decelerationRate={"fast"}
                      pagingEnabled
                      refreshControl={
                        <RefreshControl
                          refreshing={isFetching}
                          onRefresh={refetch}
                        />
                      }
                      showsVerticalScrollIndicator={false}
                      style={{ marginTop: 10 }}
                    >
                      {pinnedPlace !== null && (
                        <View style={{ marginBottom: 10 }}>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginBottom: 10,
                              justifyContent: "space-between",
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 5,
                              }}
                            >
                              <IconMapPinPin size={20} />
                              <Text style={{ fontSize: 18 }}>
                                Địa điểm đã ghim
                              </Text>
                            </View>
                            <TouchableOpacity
                              onPress={() => handlePinPlace(null)}
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 5,
                                padding: 10,
                              }}
                            >
                              <Text style={{ fontSize: 14 }}>Bỏ ghim</Text>
                              <IconPinnedOff size={16} color="red" />
                            </TouchableOpacity>
                          </View>

                          <TouchableOpacity
                            disabled={
                              navPlace?.place_id === pinnedPlace.place_id
                            }
                            onPress={() => {
                              setNavPlace({
                                place_id: pinnedPlace.place_id,
                                name: pinnedPlace.name,
                                address: pinnedPlace.address,
                                geolocation: {
                                  type: pinnedPlace.geolocation.type,
                                  coordinates:
                                    pinnedPlace.geolocation.coordinates,
                                },
                              });
                              createRouterLine(
                                pinnedPlace.geolocation.coordinates[0],
                                pinnedPlace.geolocation.coordinates[1]
                              );
                            }}
                            style={styles.locationInfor}
                          >
                            <View style={styles.locationImageContainer}>
                              <Image
                                style={styles.locationImage}
                                borderRadius={5}
                                source={
                                  pinnedPlace?.images[0]
                                    ? { uri: pinnedPlace?.images[0] }
                                    : default_image
                                }
                              />
                            </View>
                            <View style={{ maxWidth: "80%" }}>
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text
                                  style={styles.locationTitle}
                                  numberOfLines={1}
                                >
                                  {pinnedPlace?.name}
                                </Text>
                              </View>
                              <Text
                                numberOfLines={2}
                                ellipsizeMode="tail"
                                style={styles.locationPlace}
                              >
                                {pinnedPlace?.address}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      )}
                      <Divider />
                      {places && (
                        <>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              backgroundColor: theme.colors.brand.primary[50],
                              width: "100%",
                              height: 40,
                              marginTop: 5,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 16,
                                fontWeight: "600",
                                color: theme.colors.grey1,
                                width: "100%",
                                textAlign: "center",
                              }}
                            >
                              Ngày 1 -{" "}
                              {new Date(
                                new Date(data?.[0]?.startDate).setDate(
                                  new Date(data?.[0]?.startDate).getDate()
                                )
                              ).toLocaleDateString()}
                            </Text>
                          </View>
                          <FlatList
                            contentContainerStyle={styles.locationContainer}
                            scrollEnabled={false}
                            data={places}
                            renderItem={({ item, index }) => (
                              //Đổi cái này từ Pressable thành TouchableOpacity. Để Pressable nó trigger onPress
                              //lúc click icon
                              <TouchableOpacity
                                onLayout={(event) => {
                                  const { x, y, width, height } =
                                    event.nativeEvent.layout;
                                  setComponentHeight(height);
                                }}
                                disabled={navPlace?.place_id === item.place_id}
                                onPress={() => {
                                  setNavPlace({
                                    place_id: item.place_id,
                                    name: item.name,
                                    address: item.address,
                                    geolocation: {
                                      type: item.geolocation.type,
                                      coordinates: item.geolocation.coordinates,
                                    },
                                  });
                                  createRouterLine(
                                    item.geolocation.coordinates[0],
                                    item.geolocation.coordinates[1]
                                  );
                                }}
                                style={styles.locationInfor}
                              >
                                {typeof item === "number" ? (
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                      backgroundColor:
                                        theme.colors.brand.primary[50],
                                      width: "100%",
                                      height: 40,
                                    }}
                                  >
                                    <Text
                                      style={{
                                        fontSize: 16,
                                        fontWeight: "600",
                                        color: theme.colors.grey1,
                                        width: "100%",
                                        textAlign: "center",
                                      }}
                                    >
                                      Ngày {item + 1} -{" "}
                                      {new Date(
                                        new Date(data?.[0]?.startDate).setDate(
                                          new Date(
                                            data?.[0].startDate!
                                          ).getDate() + item
                                        )
                                      ).toLocaleDateString()}
                                    </Text>
                                  </View>
                                ) : (
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                      gap: 16,
                                    }}
                                  >
                                    <>
                                      <View
                                        style={styles.locationImageContainer}
                                      >
                                        <Image
                                          style={styles.locationImage}
                                          borderRadius={10}
                                          source={{
                                            uri: item.images[0],
                                          }}
                                        />
                                      </View>
                                      <View style={styles.locationContent}>
                                        <View>
                                          <Text
                                            numberOfLines={1}
                                            style={styles.locationTitle}
                                          >
                                            {item.name}
                                          </Text>
                                          <Text
                                            numberOfLines={1}
                                            style={{
                                              fontSize: 13,
                                              color: theme.colors.grey2,
                                            }}
                                          >
                                            {item.address}
                                          </Text>

                                          <Text numberOfLines={2}>
                                            {item.tags.map(
                                              (item: any, index: number) => (
                                                <Chip
                                                  key={index}
                                                  disabled
                                                  disabledStyle={{
                                                    backgroundColor:
                                                      theme.colors.tag,
                                                    marginRight: 8,
                                                    marginTop: 5,
                                                  }}
                                                  disabledTitleStyle={{
                                                    color: "#012a4a",
                                                  }}
                                                  title={item.name}
                                                  buttonStyle={{
                                                    paddingHorizontal: 8,
                                                    paddingVertical: 3,
                                                  }}
                                                />
                                              )
                                            )}
                                          </Text>
                                        </View>
                                      </View>
                                      <TouchableOpacity
                                        onPress={() => handlePinPlace(item)}
                                        style={{
                                          position: "absolute",
                                          right: -15,
                                          padding: 10,
                                        }}
                                      >
                                        <IconPin
                                          size={24}
                                          fill={
                                            item.place_id ===
                                            pinnedPlace?.place_id
                                              ? theme.colors.brand.primary[500]
                                              : "none"
                                          }
                                        />
                                      </TouchableOpacity>
                                    </>
                                  </View>
                                )}
                              </TouchableOpacity>
                            )}
                          />
                        </>
                      )}
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          marginBottom: 50,
                          paddingTop: 80,
                        }}
                      >
                        <AnimatedLottieView
                          source={require("../../../assets/lotties/traveling_animation.json")}
                          style={{
                            width: width / 4,
                            position: "absolute",
                            top: 0,
                          }}
                          autoPlay
                          loop
                        />
                        <Button
                          disabled={new Date(data[0].endDate) > new Date()}
                          onPress={() => handleCompleteTrip()}
                          title="Hoàn thành"
                          radius={10}
                          buttonStyle={{
                            paddingHorizontal: 16,
                            paddingVertical: 10,
                          }}
                        />
                      </View>
                    </ScrollView>
                  )}

                  {/* List friend này mốt có track location bạn bè */}
                  {selectedIndex === 1 && (
                    <View>
                      <ListFriends
                        onPress={() => {}}
                        friends={data[0].onGoingParticipates}
                      />
                    </View>
                  )}
                </>
              ) : (
                <View>
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: "500",
                      textAlign: "center",
                      marginTop: 20,
                    }}
                  >
                    Các hành trình sắp diễn ra
                  </Text>
                  <ScrollView
                    snapToAlignment="start"
                    snapToInterval={componentHeight}
                    decelerationRate={"fast"}
                    pagingEnabled
                    refreshControl={
                      <RefreshControl
                        refreshing={incTripFetching}
                        onRefresh={() => {
                          incTripRefetch(), refetch();
                        }}
                      />
                    }
                    showsVerticalScrollIndicator={false}
                    style={{ marginTop: 10, height: "100%" }}
                  >
                    {incTrip.length === 0 ? (
                      <View
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                          width: width,
                        }}
                      >
                        <AnimatedLottieView
                          source={require("../../../assets/lotties/notfound_animation.json")}
                          style={{
                            width: "100%",
                            height: 180,
                          }}
                          autoPlay
                          loop
                        />
                        <Text
                          numberOfLines={2}
                          style={{
                            textAlign: "center",
                            padding: 20,
                            fontSize: 18,
                            fontWeight: "600",
                            maxWidth: "80%",
                            color: theme.colors.grey3,
                          }}
                        >
                          Không có hành trình nào!
                        </Text>
                      </View>
                    ) : (
                      <FlatList
                        contentContainerStyle={{
                          marginBottom: height / 13,
                          gap: 20,
                        }}
                        data={incTrip}
                        scrollEnabled={false}
                        renderItem={({ item }) => (
                          <View
                            style={{
                              backgroundColor: "white",
                              borderRadius: 10,
                              flexDirection: "row",
                              marginHorizontal: 10,
                              borderWidth: 0.2,
                              borderColor: theme.colors.grey4,
                              shadowRadius: 5,
                              shadowOpacity: 0.5,
                              shadowColor: theme.colors.grey3,
                              shadowOffset: { width: 0, height: 5 },
                            }}
                          >
                            <Image
                              source={
                                item.places[0].images[0]
                                  ? { uri: item.places[0].images[0] }
                                  : default_image
                              }
                              style={{
                                width: width / 3.2,
                                aspectRatio: 1,
                                borderRadius: 10,
                              }}
                            />
                            <View
                              style={{
                                flexDirection: "column",
                                justifyContent: "space-between",
                                marginLeft: 10,
                                width: width / 1.8,
                                padding: 10,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 16,
                                  fontWeight: "500",
                                  maxWidth: "90%",
                                }}
                                numberOfLines={2}
                              >
                                {item.title}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 14,
                                  color: theme.colors.grey3,
                                }}
                              >
                                {dateString(item.startDate)} đến{" "}
                                {dateString(item.endDate)}
                              </Text>
                              <View>
                                <Button
                                  disabled={
                                    new Date(item.startDate) > new Date()
                                  }
                                  onPress={() => {
                                    if (new Date(item.endDate) < new Date()) {
                                      Alert.alert(
                                        "Thông báo",
                                        "Hành trình đã quá hạn, xin hãy lên lại lịch cho hành trình",
                                        [
                                          {
                                            text: "Huỷ",
                                            style: "cancel",
                                          },
                                          {
                                            text: "Lên lịch",
                                            onPress: () => {
                                              router.push({
                                                pathname:
                                                  "/(general)/trip-detail",
                                                params: { tripId: item._id },
                                              });
                                            },
                                          },
                                        ]
                                      );
                                      return;
                                    }
                                    if (item.status === "ON-GOING") {
                                      handleJoinTrip(item._id);
                                    } else {
                                      handleStartTrip(
                                        item._id,
                                        item.startDate,
                                        item.endDate
                                      );
                                    }
                                  }}
                                  title={
                                    new Date(item.startDate) > new Date()
                                      ? "Sắp diễn ra"
                                      : new Date(item.endDate) < new Date()
                                      ? "Đã quá hạn"
                                      : item.status === "ON-GOING"
                                      ? "Tham gia"
                                      : "Bắt đầu"
                                  }
                                  radius={10}
                                  buttonStyle={{
                                    marginTop: 10,
                                  }}
                                />
                              </View>
                            </View>
                          </View>
                        )}
                      />
                    )}
                  </ScrollView>
                </View>
              )}
            </>
          )
        ) : (
          <View
            style={{
              width: "100%",
              height: "100%",
              alignItems: "center",
              paddingTop: 20,
            }}
          >
            {authPayload ? (
              <View style={{ gap: 15 }}>
                <View
                  style={{
                    alignItems: "center",
                    marginBottom: 10,
                    justifyContent: "center",
                    height: height / 8,
                  }}
                >
                  <AnimatedLottieView
                    source={require("../../../assets/lotties/404_animation.json")}
                    style={{
                      width: "100%",
                      height: 130,
                    }}
                    autoPlay
                    loop
                  />
                </View>
                <Button
                  onPress={() => {
                    refetch(), incTripRefetch();
                  }}
                >
                  Thử lại!
                </Button>
              </View>
            ) : (
              <View style={{ marginTop: 40 }}>
                <Button
                  radius={10}
                  buttonStyle={{ paddingHorizontal: 20, paddingVertical: 10 }}
                  titleStyle={{ fontWeight: "500" }}
                  onPress={() => router.replace("/(auth)/sign-in")}
                >
                  Đăng nhập
                </Button>
              </View>
            )}
          </View>
        )}
      </BottomSheet>
    </View>
  );
};

export default OnGoingTripMap;

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
    borderColor: theme.colors.brand.primary[600],
  },
  buttonStyle: {},
  buttonTextStyle: {
    fontSize: 14,
  },
  locationContainer: {
    marginTop: 15,
    gap: 15,
  },
  locationInfor: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  locationImageContainer: {
    width: width / 4.5,
    aspectRatio: 1,
  },
  locationImage: {
    width: "100%",
    height: "100%",
  },

  locationContent: {
    width: "65%",
    gap: 5,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: "500",
    maxWidth: "90%",
  },
  locationPlace: {
    fontSize: 12,
    opacity: 0.6,
  },
  locationConectionLineContainer: {
    position: "absolute",
    transform: [{ rotate: "90deg" }, { scale: 1 }],
    top: -10,
    left: -25,
  },
  locationConectionLine: {
    zIndex: 99,
    fontSize: 26,
    color: theme.colors?.brand?.primary?.[200],
  },
  scale: {
    transform: [{ scale: 1 }],
  },
}));

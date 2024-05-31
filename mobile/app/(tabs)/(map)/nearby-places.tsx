import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Mapbox, {
  Camera,
  MapView,
  MarkerView,
  PointAnnotation,
  UserLocation,
  UserTrackingMode,
} from "@rnmapbox/maps";
import { Coordinates } from "@mapbox/mapbox-sdk/lib/classes/mapi-request";
import * as Location from "expo-location";
import { Avatar, Button, Card, Image, useTheme } from "@rneui/themed";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Loading, MapSideFunctionBar } from "../../../components";
import BottomSheet from "@gorhom/bottom-sheet";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import {
  ArrowRightIcon,
  MagnifyingGlassIcon,
} from "react-native-heroicons/solid";
import { useNavPlaceStore } from "../../../store";
import { useUserLocation } from "../../../api/mapboxLocation";
import { getNearbyPlaces, useNearByPlaces } from "../../../api/place";
import AnimatedLottieView from "lottie-react-native";
let access_token = process.env.EXPO_PUBLIC_MAPBOX_API || null;
Mapbox.setAccessToken(access_token);
const { height, width } = Dimensions.get("window");

type TargetPlaceType = {
  name: string;
  full_address: string;
  images: Array<string> | null;
  coordinates: {
    latitude: string;
    longitude: string;
  };
  poi_category?: Array<string>;
  metadata: {
    review_count?: number;
    phone: string;
    rating?: number;
  };
};

const NearbyPlaces = () => {
  const { theme } = useTheme();
  const setNavPlace = useNavPlaceStore((state) => state.setNavPlace);
  const { mapbox_id } = useLocalSearchParams();
  console.log(mapbox_id !== undefined ? "co mapboxid" : "ko co mapbox id");
  const { location, userCurrentAddress } = useUserLocation();
  const { data, isFetching, error } = getNearbyPlaces(location);
  const [uniqueData, setUniqueData] = useState<any>();
  // console.log(location);
  const navigation = useNavigation();
  const [targetPlace, setTargetPlace] = useState<TargetPlaceType | null>(null);
  const [fetching, setFetching] = useState(false);
  const [isSearchPlaceShown, setIsSearchPlaceShown] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (data)
      setUniqueData(
        data?.filter(
          (item: any, index: number, self: any) =>
            index ===
            self.findIndex(
              (t: any) => t.properties.place_id === item.properties.place_id
            )
        )
      );
  }, [data]);

  useEffect(() => {
    const fetchRetrievePlace = async () => {
      setFetching(true);
      setTargetPlace(null);
      await axios
        .get(
          `https://api.mapbox.com/search/searchbox/v1/retrieve/${mapbox_id}?session_token=356546eb-6518-4e5d-aa6b-b4d43f19402a&access_token=${access_token}`
        )
        .then((res) => {
          let json = res.data;
          let properties = json["features"][0]["properties"];
          let place = {
            name: properties["name"],
            full_address: properties["full_address"],
            coordinates: properties["coordinates"],
            poi_category: properties["poi_category"],
            metadata: {
              review_count: properties["metadata"]["review_count"],
              phone: properties["metadata"]["phone"],
              rating: properties["metadata"]["rating"],
            },
            images: null,
          };
          setTargetPlace(place);
          setIsSearchPlaceShown(true);
          setFetching(false);
        })
        .catch((err: any) => {
          console.log(err);
          console.log("error fetching retrieve");
        });
    };

    if (mapbox_id !== undefined) {
      fetchRetrievePlace();
    }
  }, [mapbox_id]);
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ["20%", "80%"], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {}, []);
  const handleNavigation = (item: any) => {
    setNavPlace({
      place_id: item.place_id,
      name: item.name,
      address: item.address,
      geolocation: {
        type: item.type,
        coordinates: [item.coordinates.longitude, item.coordinates.latitude],
      },
    });
    router.push("/(tabs)/(map)/navigation");
  };
  return (
    <View style={{ flex: 1 }}>
      {/* <View style={{ position: 'absolute', bottom: 0 }}>
                <Button onPress={() => { router.push('/(tabs)/(map)/navigation') }} style={{ height: 30, width: 30 }}>navigation</Button>
            </View> */}

      {/* <View
        style={{
          backgroundColor: "white",
          position: "absolute",
          top: height / 15,
          left: 20,
          width: "90%",
          height: height / 17,
          zIndex: 99,
          borderRadius: 50,
        }}
      >
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/(map)/search-place")}
          style={{
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row",
            paddingHorizontal: 20,
          }}
        >
          <Text style={{ fontSize: 16 }}>
            {targetPlace !== null && isSearchPlaceShown === true
              ? `${targetPlace?.name}`
              : `Tìm kiếm địa điểm`}
          </Text>
          <ArrowRightIcon size={20} color={"black"} />
        </TouchableOpacity>
      </View> */}

      {location ? (
        <MapView
          style={{ width: "100%", height: "95%" }}
          zoomEnabled={true}
          styleURL="mapbox://styles/vietnguyen123/clu58ub8l004r01pq9c17a8ro"
          rotateEnabled={true}
        >
          <Camera
            followUserMode={UserTrackingMode.Follow}
            zoomLevel={15}
            animationMode="flyTo"
            animationDuration={3000}
            centerCoordinate={location}
          />
          <UserLocation showsUserHeadingIndicator={true} />
        </MapView>
      ) : (
        <Loading size={"50%"} />
      )}
      <MapSideFunctionBar
        onNearbyPress={() => {
          setIsSearchPlaceShown(false);
        }}
      />
      {(mapbox_id !== undefined || targetPlace !== null) &&
      isSearchPlaceShown === true ? (
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
        >
          {fetching ? (
            <Loading size={"50%"} />
          ) : (
            <View style={{ paddingHorizontal: 10, flex: 1, gap: 12 }}>
              <View style={{ width: "100%", height: "35%", borderRadius: 24 }}>
                <Image
                  resizeMode="cover"
                  style={{ width: "100%", height: "100%", borderRadius: 24 }}
                  source={{
                    uri: targetPlace?.images
                      ? targetPlace?.images[0]
                      : "https://maps.gstatic.com/tactile/reveal/no_street_view_1x_080615.png",
                  }}
                />

                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                  }}
                >
                  <Text
                    style={{ fontWeight: "600", fontSize: 18, color: "white" }}
                  >
                    {targetPlace?.name}
                  </Text>
                  <View style={{ flexDirection: "row", gap: 15 }}>
                    <Text
                      style={{
                        color: "white",
                        fontSize: 14,
                        fontWeight: "600",
                      }}
                    >
                      Rating: {targetPlace?.metadata.rating}
                    </Text>
                    <Text
                      style={{
                        color: "white",
                        fontSize: 14,
                        fontWeight: "600",
                      }}
                    >
                      {targetPlace?.metadata.review_count} đánh giá
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                <Button
                  onPress={() => handleNavigation(targetPlace)}
                  buttonStyle={{ borderRadius: 30 }}
                  containerStyle={{ width: "40%" }}
                  title={"Chỉ đường"}
                  type="outline"
                />
                <Button
                  buttonStyle={{ borderRadius: 30 }}
                  containerStyle={{ width: "55%" }}
                  title={"Lưu vào hành trình"}
                />
              </View>
              <View style={{ gap: 12 }}>
                <Text style={{ fontWeight: "400", fontSize: 14 }}>
                  Address: {targetPlace?.full_address}
                </Text>
                <Text style={{ fontWeight: "400", fontSize: 14 }}>
                  Phone: {targetPlace?.metadata.phone}
                </Text>
              </View>
            </View>
          )}
        </BottomSheet>
      ) : (
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
        >
          {isFetching ? (
            <Loading size={"50%"} />
          ) : (
            <View
              style={{
                flex: 1,
              }}
            >
              <View>
                <View
                  style={{
                    paddingHorizontal: 16,
                    paddingBottom: 10,
                    backgroundColor: "white",
                    shadowRadius: 4,
                    shadowOpacity: 0.1,
                    shadowOffset: { width: 0, height: 2 },
                  }}
                >
                  <Text style={{ fontSize: 20 }}>Địa điểm gần đây</Text>
                </View>
                {data?.length > 0 ? (
                  <FlatList
                    contentContainerStyle={{
                      paddingBottom: height / 14,
                      gap: 18,
                      paddingTop: 20,
                      paddingHorizontal: 18,
                    }}
                    showsVerticalScrollIndicator={false}
                    data={uniqueData}
                    keyExtractor={(item, index) => item.properties.place_id}
                    renderItem={({ item, index }) => (
                      <TouchableOpacity
                        onPress={
                          //() => handleNavigation(item)
                          () => {
                            handleNavigation({
                              name: item.properties.name,
                              full_address: item.properties.address,
                              images: [item.properties.image],
                              coordinates: {
                                latitude: item.geometry.coordinates[1],
                                longitude: item.geometry.coordinates[0],
                              },
                              metadata: {
                                phone: item.properties.phone,
                              },
                            });
                          }
                        }
                      >
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
                          <View style={{ width: "32%", aspectRatio: 1 }}>
                            <Image
                              style={{ height: "100%", width: "100%" }}
                              borderRadius={5}
                              source={{ uri: item.properties.image }}
                            />
                          </View>
                          <View style={{ width: "68%", gap: 5, padding: 10 }}>
                            <Text style={{ fontSize: 16, fontWeight: "500" }}>
                              {item["properties"]["name"]}
                            </Text>

                            <Text
                              style={{
                                fontSize: 12,
                                color: theme.colors.grey2,
                              }}
                            >
                              Địa chỉ: {item.properties.address}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    )}
                  />
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
                      source={require("../../../assets/lotties/notfound_animation.json")}
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
                  </View>
                )}
              </View>
            </View>
          )}
        </BottomSheet>
      )}
    </View>
  );
};

export default NearbyPlaces;

const styles = StyleSheet.create({});

import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Mapbox, {
  Camera,
  LineLayer,
  MapView,
  MarkerView,
  PointAnnotation,
  ShapeSource,
  UserLocation,
} from "@rnmapbox/maps";
import BackToPreviousPageButton from "../../../components/BackToPreviousPageButton/BackToPreviousPageButton";
import * as Location from "expo-location";
import { Coordinates } from "@mapbox/mapbox-sdk/lib/classes/mapi-request";
import axios from "axios";
import BottomSheet from "@gorhom/bottom-sheet";
import { ScrollView } from "react-native-gesture-handler";
import { Loading, MapSideFunctionBar } from "../../../components";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { useNavPlaceStore } from "../../../store";
import {
  useTrackUserLocation,
  useUserLocation,
} from "../../../api/mapboxLocation";
import { useTheme } from "@rneui/themed";
import { IconChevronLeft, IconPointFilled } from "tabler-icons-react-native";
import { minToHour } from "../../../utils/customHook";
import { Button } from "@rneui/themed";
let access_token = process.env.EXPO_PUBLIC_MAPBOX_API || null;
Mapbox.setAccessToken(access_token);
const { height, width } = Dimensions.get("window");

const placeData = {
  place_id: "1",
  name: "Quảng trường Lâm Viên",
  address:
    "Nhân Văn Bookstore, 875 CMT8 St., Ward 15, Dist. 10, Ho Chi Minh City, 740900, Vietnam",
  images: [
    "https://mia.vn/media/uploads/blog-du-lich/quang-truong-lam-vien-bieu-tuong-cua-thanh-pho-da-lat-tho-mong-06-1634561346.jpeg",
  ],
};

const Navigation = () => {
  const navPlace = useNavPlaceStore((state) => state.navPlace);
  const long = navPlace?.geolocation.coordinates[0];
  const lat = navPlace?.geolocation.coordinates[1];
  const { trackLocation: location } = useTrackUserLocation();
  const router = useRouter();
  //const [finalCoord, setFinalCoord] = useState<Coordinates>();
  const [duration, setDuration] = useState(null);
  const [distance, setDistance] = useState();
  const [routeDirection, setRouteDirection] = useState();
  const [tripInstruction, setTripInstruction] = useState<Array<string> | null>(
    []
  );

  const { theme } = useTheme();
  useEffect(() => {
    setDuration(null);
    createRouterLine();
  }, [navPlace]);

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

  async function createRouterLine(): Promise<void> {
    const geometries = "geojson";
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${location};${long},${lat}?alternatives=true&geometries=${geometries}&steps=true&overview=full&access_token=${access_token}`;

    try {
      let response = await axios.get(url);
      let json = await response.data;
      let coordinates = json["routes"][0]["geometry"]["coordinates"];
      let steps = json["routes"][0]["legs"][0].steps;
      let durationNum = json["routes"][0]["duration"];
      //để console.log. K để bottom sheet đ hiện :v
      console.log(durationNum);
      durationNum = Math.floor(durationNum / 60);
      setDuration(durationNum);
      let distanceNum = json["routes"][0]["distance"];
      distanceNum = (distanceNum / 1000).toFixed(1);
      setDistance(distanceNum);
      let arr = [];
      for (const step of steps) {
        arr?.push(step.maneuver.instruction);
      }
      setTripInstruction(arr);
      if (coordinates.length) {
        const routerFeature = makeRouterFeature([...coordinates]);
        setRouteDirection(routerFeature);
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    createRouterLine();
  }, [location]);

  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);
  // variables
  const snapPoints = useMemo(() => ["12%", "35%", "90%"], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    // console.log('handleSheetChanges', index);
  }, []);
  return (
    <View style={{ flex: 1 }}>
      {location ? (
        <MapView
          onDidFinishLoadingMap={async () => {
            await createRouterLine();
          }}
          style={{ width: "100%", height: "100%" }}
          zoomEnabled={true}
          styleURL="mapbox://styles/vietnguyen123/clu58ub8l004r01pq9c17a8ro"
          rotateEnabled={true}
        >
          <Camera
            followUserLocation={true}
            zoomLevel={15}
            animationMode="flyTo"
            animationDuration={2000}
            centerCoordinate={location}
          />
          <ShapeSource id="line1" shape={routeDirection}>
            <LineLayer
              id="routerLine01"
              style={{
                lineColor: theme.colors.brand.primary[500],
                lineWidth: 4,
              }}
            />
          </ShapeSource>
          {long !== undefined && lat !== undefined && (
            <PointAnnotation
              id="marker"
              coordinate={[Number(long), Number(lat)]}
            >
              <View />
            </PointAnnotation>
          )}
          <UserLocation />
        </MapView>
      ) : (
        <Loading size={height / 2} />
      )}
      {/* <MapSideFunctionBar
        onNearbyPress={() => {
          router.push("/(tabs)/(map)/nearby-places");
        }}
      /> */}
      <View
        style={{
          position: "absolute",
          top: height / 9,
          left: 10,
        }}
      >
        <Button
          disabled={routeDirection === undefined}
          radius={99}
          type="outline"
          buttonStyle={{
            backgroundColor: "white",
            paddingHorizontal: 10,
            borderWidth: 0,
          }}
          icon={
            <IconChevronLeft
              size={32}
              color={theme.colors.brand.primary[600]}
            />
          }
          onPress={() => router.back()}
        />
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        {duration && distance ? (
          <View
            style={{
              flex: 1,
            }}
          >
            <View
              style={{
                paddingHorizontal: 20,
                paddingBottom: 5,
                paddingTop: 10,
                backgroundColor: "white",
                shadowRadius: 4,
                shadowOpacity: 0.2,
                shadowOffset: { width: 0, height: 2 },
                gap: 4,
              }}
            >
              <Text
                style={{
                  fontWeight: "500",
                  fontSize: 19,
                  color: theme.colors.grey2,
                }}
              >
                <Text style={{ color: "black" }}>Khoảng cách:</Text> {distance}{" "}
                km
              </Text>
              <Text
                style={{
                  fontSize: 19,
                  fontWeight: "500",
                  color:
                    duration < 120
                      ? theme.colors.brand.primary[600]
                      : duration < 300
                      ? theme.colors.brand.yellow[800]
                      : theme.colors.brand.red[500],
                }}
              >
                <Text style={{ color: "black" }}>Thời gian:</Text>{" "}
                {minToHour(duration)}
              </Text>
            </View>

            <ScrollView
              style={{
                paddingTop: 15,
                paddingHorizontal: 20,
              }}
              showsVerticalScrollIndicator={false}
            >
              <Text style={{ fontSize: 16, marginBottom: 10 }}>
                Các chặng:{" "}
              </Text>
              {tripInstruction?.map((value, key) => (
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    width: "90%",
                    marginVertical: 7,
                    paddingHorizontal: 16,
                    alignItems: "center",
                  }}
                  key={key}
                >
                  <IconPointFilled color={theme.colors.brand.primary[600]} />
                  <Text style={{ fontSize: 18, color: theme.colors.grey2 }}>
                    {value}
                  </Text>
                </View>
              ))}
              <View style={{ height: height / 15 }} />
            </ScrollView>
          </View>
        ) : (
          <Loading size={"50%"} />
        )}
      </BottomSheet>
    </View>
  );
};

export default Navigation;

const styles = StyleSheet.create({});

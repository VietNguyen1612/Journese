import { Dimensions, StyleSheet, Text, View } from "react-native";
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
import { Avatar, Button } from "@rneui/themed";
import { useNavigation, useRouter } from "expo-router";
import { ListTrips, Loading } from "../../../components";
import BottomSheet from "@gorhom/bottom-sheet";
import axios from "axios";
let access_token = process.env.EXPO_PUBLIC_MAPBOX_API || null;
Mapbox.setAccessToken(access_token);
const { height, width } = Dimensions.get("window");
const Map = () => {
  const navigation = useNavigation();
  const [location, setLocation] = useState<Coordinates | undefined>();
  const [userCurrentAddress, setUserCurrentAddress] = useState();
  const router = useRouter();
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permission to access location was denied");
          return;
        }

        let locationResponse = await Location.getLastKnownPositionAsync({});
        if (locationResponse != null) {
          setLocation([
            locationResponse.coords.longitude,
            locationResponse.coords.latitude,
          ]);
          await axios
            .get(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${locationResponse.coords.longitude},${locationResponse.coords.latitude}.json?limit=1&access_token=${access_token}`
            )
            .then((res) =>
              setUserCurrentAddress(res.data.features[0].place_name)
            );
        }
      })();
    });

    return unsubscribe;
  }, [navigation]);

  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ["10%", "90%"], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);
  return (
    <View style={{ flex: 1 }}>
      {/* <View style={{ position: 'absolute', bottom: 0 }}>
                <Button onPress={() => { router.push('/(tabs)/(map)/navigation') }} style={{ height: 30, width: 30 }}>navigation</Button>
            </View> */}
      {location ? (
        <MapView
          style={{ width: "100%", height: "95%" }}
          zoomEnabled={true}
          styleURL="mapbox://styles/mapbox/streets-v12"
          rotateEnabled={true}
        >
          <Camera
            followUserMode={UserTrackingMode.Follow}
            zoomLevel={15}
            animationMode="flyTo"
            animationDuration={6000}
            centerCoordinate={location}
          />
          <UserLocation showsUserHeadingIndicator={true} />
        </MapView>
      ) : (
        <Loading size={"50%"} />
      )}
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        <View
          style={{ flex: 1, paddingHorizontal: 10, paddingBottom: height / 10 }}
        >
          <View>
            <Text style={{ fontSize: 28 }}>Your Location</Text>
            <Text>Near {userCurrentAddress}</Text>
            <ListTrips
              onPress={() => {
                router.push("/(tabs)/(map)/navigation");
              }}
            />
          </View>
        </View>
      </BottomSheet>
    </View>
  );
};

export default Map;

const styles = StyleSheet.create({});

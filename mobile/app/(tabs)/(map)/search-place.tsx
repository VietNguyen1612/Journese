import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import axios from "axios";
import { useNavigation, useRouter } from "expo-router";
import { Coordinates } from "@mapbox/mapbox-sdk/lib/classes/mapi-request";
import * as Location from "expo-location";
import Mapbox, {
  Camera,
  MapView,
  UserLocation,
  UserTrackingMode,
} from "@rnmapbox/maps";
import BottomSheet from "@gorhom/bottom-sheet";
import { ITEM_WIDTH, Loading, TextInput } from "../../../components";
import { Input, SearchBar } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import BackToPreviousPageButton from "../../../components/BackToPreviousPageButton/BackToPreviousPageButton";
import { TouchableOpacity } from "react-native-gesture-handler";
let access_token = process.env.EXPO_PUBLIC_MAPBOX_API || null;
Mapbox.setAccessToken(access_token);
const { height, width } = Dimensions.get("window");

type SuggestionPlace = {
  mapbox_id: string;
  name: string;
  address: string;
  distance: string;
};

const NearbyPlacesScreen = () => {
  const navigation = useNavigation();
  const [location, setLocation] = useState<Coordinates | undefined>();
  const [userCurrentAddress, setUserCurrentAddress] = useState();
  const [searchText, setSearchText] = useState<string>();
  const [suggestionList, setSuggestionList] = useState<Array<SuggestionPlace>>(
    []
  );
  const [loadingSearch, setLoadingSearch] = useState<boolean>();
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
  const getSuggestPlaceMapbox = async () => {
    if (location && searchText?.length !== 0) {
      setLoadingSearch(true);
      let response = await axios.get(
        `https://api.mapbox.com/search/searchbox/v1/suggest?q=${searchText}&access_token=${access_token}&session_token=9f8ae116-fff1-4244-b54a-518dbf52d587&types=place&language=en&limit=10&proximity=${location[0]}%2C${location[1]}`
      );
      //let response = await axios.get(`https://api.mapbox.com/search/searchbox/v1/suggest?q=Viet&access_token=${access_token}&session_token=b540c101-0687-4ac4-88cf-b34d70acf99d&language=en&limit=10&types=place&proximity=106.8302336%2C10.9248512`)
      //let response = await axios.get(`https://api.mapbox.com/search/searchbox/v1/suggest?q=${searchText}&access_token=${access_token}&language=en&limit=5&proximity=${location[1], location[0]}`)
      //console.log(response.data.suggestions[0])
      let data = response.data["suggestions"];
      setLoadingSearch(false);
      setSuggestionList([]);
      for (let i = 0; i < data.length; i++) {
        let suggestObject: SuggestionPlace = {
          mapbox_id: data[i]["mapbox_id"],
          name: data[i]["name"],
          address: data[i]["full_address"],
          distance: data[i]["distance"],
        };
        //console.log(suggestObject)
        setSuggestionList((prev) => [...prev, suggestObject]);
      }
    } else {
      setSuggestionList([]);
    }
  };

  const renderListSuggestMapbox = () => {
    const onPressPlace = (mapboxId: string) => {
      router.push({
        pathname: `/(tabs)/(map)/nearby-places`,
        params: { mapbox_id: mapboxId },
      });
    };
    if (suggestionList.length === 0) {
      return (
        <Text
          style={{
            fontSize: 16,
            fontWeight: "500",
            textAlign: "center",
            marginTop: 20,
          }}
        >
          no results found
        </Text>
      );
    } else {
      return (
        <View style={{ flex: 1, marginBottom: 20 }}>
          <FlatList
            contentContainerStyle={{ paddingBottom: 10 }}
            style={{
              backgroundColor: "white",
              marginTop: 15,
              borderRadius: 10,
            }}
            data={suggestionList}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => onPressPlace(item.mapbox_id)}
                style={{
                  paddingTop: 8,
                  paddingHorizontal: 8,
                  borderBottomWidth: 0.5,
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: "500" }}>
                  {item.name}
                </Text>
                <Text style={{ fontSize: 12, fontWeight: "400" }}>
                  {item.address}
                </Text>
                <Text style={{ fontSize: 12, fontWeight: "400" }}>
                  Khoảng cách: {item.distance}m
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      );
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 8 }}>
      {/* <View style={{ position: 'absolute', bottom: 0 }}>
                  <Button onPress={() => { router.push('/(tabs)/(map)/navigation') }} style={{ height: 30, width: 30 }}>navigation</Button>
              </View> */}
      <BackToPreviousPageButton color="black" />
      <SearchBar
        onSubmitEditing={getSuggestPlaceMapbox}
        showLoading={loadingSearch}
        platform="android"
        value={searchText}
        containerStyle={{
          height: height / 20,
          marginTop: height / 15,
          width: "100%",
          justifyContent: "center",
          borderRadius: 20,
        }}
        onChangeText={(data) => {
          setSearchText(data);
        }}
      />
      {loadingSearch ? <Loading size={"50%"} /> : renderListSuggestMapbox()}
    </SafeAreaView>
  );
};

export default NearbyPlacesScreen;

const styles = StyleSheet.create({});

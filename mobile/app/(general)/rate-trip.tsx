import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  BackHandler,
  Alert,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useAuthStore, useRatingTripDetailStore } from "../../store";
import { FlatList, ScrollView, TextInput } from "react-native-gesture-handler";
import { Image, Rating, AirbnbRating, useTheme } from "@rneui/themed";
import { Button } from "@rneui/themed";
import axios from "axios";
import { useNavigation, useRouter } from "expo-router";
import { Loading, LoadingScreen, SuccessAnimation } from "../../components";
import { useFocusEffect } from "expo-router/src/useFocusEffect";
import { isLoading } from "expo-font";
import { IconStar, IconStarOff } from "tabler-icons-react-native";
const { height, width } = Dimensions.get("window");
const RateTrip = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const navigation = useNavigation();
  const { authPayload } = useAuthStore();
  const { ratingTripDetail } = useRatingTripDetailStore();
  // console.log(ratingTripDetail)
  const [places, setPlaces] = useState(
    ratingTripDetail?.places?.map((place) => ({
      ...place,
      rating: 0,
      review: "",
    })) || []
  );
  const [isFail, setIsFail] = useState<boolean>();
  const [isSuccess, setIsSuccess] = useState<boolean>();
  const [loading, setLoading] = useState(false);
  // places.forEach(e => {
  //     console.log(e._id)
  //     console.log(e.rating)
  //     console.log(e.review)
  // })
  const allRated = places.every((place) => place.rating > 0);
  const updatePlace = (index: number, rating: number, review: string) => {
    const newPlaces = [...places];
    newPlaces[index] = { ...newPlaces[index], rating, review };
    setPlaces(newPlaces);
  };

  const handleCreateRatings = async () => {
    const ratings = places.map((place) => ({
      placeId: place.place_id, // assuming _id is the placeId
      tripId: ratingTripDetail?.tripId, // assuming _id is the tripId
      rating: place.rating,
      message: place.review,
    }));
    setLoading(true);
    const res = await axios.post(
      `${process.env.EXPO_PUBLIC_BACKEND_API}/rating`,
      { ratings: ratings },
      {
        headers: {
          "x-client-id": authPayload?.user._id,
          authorization: authPayload?.tokens.accessToken,
          "Content-Type": "application/json",
        },
      }
    );
    setLoading(false);
    if (res.data.statusCode !== 200) {
      setIsFail(true);
    } else {
      // console.log(res.data)
      setIsSuccess(true);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        width: width,
        backgroundColor: "white",
        paddingHorizontal: 5,
      }}
    >
      {isFail && (
        <SuccessAnimation
          isSuccess={false}
          content="Đánh giá thất bại"
          onPress={() => setIsFail(false)}
        />
      )}
      {isSuccess && (
        <SuccessAnimation
          isSuccess={true}
          content="Đánh giá thành công"
          onPress={() => {
            setIsSuccess(false);
            router.back();
          }}
        />
      )}
      {loading ? (
        <View style={{ marginTop: -height / 8 }}>
          <LoadingScreen />
        </View>
      ) : (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingVertical: 20,
              paddingBottom: height / 10,
            }}
          >
            <FlatList
              scrollEnabled={false}
              contentContainerStyle={{ gap: 10 }}
              data={places}
              renderItem={({ item, index }) => (
                <View
                  style={{
                    marginHorizontal: 20,
                    marginVertical: 5,
                    borderRadius: 20,
                    marginBottom: 10,
                    shadowRadius: 4,
                    shadowOpacity: 0.3,
                    shadowOffset: { width: 2, height: 2 },
                    backgroundColor: "white",
                  }}
                  key={index}
                >
                  <View>
                    <View
                      style={{
                        width: "100%",
                        aspectRatio: 5 / 3,
                      }}
                    >
                      <Image
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                        borderTopLeftRadius={20}
                        borderTopRightRadius={20}
                        source={{
                          uri: item.images[0],
                        }}
                      />
                    </View>
                    <Text
                      numberOfLines={2}
                      style={{
                        fontSize: 17,
                        textAlign: "center",
                        paddingTop: 10,
                        fontWeight: "500",
                      }}
                    >
                      {item.name}
                    </Text>
                  </View>
                  <View style={{ padding: 20, paddingTop: 10 }}>
                    <AirbnbRating
                      defaultRating={0}
                      size={24}
                      showRating={false}
                      onFinishRating={(rating) =>
                        updatePlace(index, rating, item.review)
                      }
                      starContainerStyle={{ gap: 6 }}
                    />
                    <TextInput
                      multiline
                      value={item.review}
                      placeholder="Nhập đánh giá"
                      onChangeText={(review) =>
                        updatePlace(index, item.rating, review)
                      }
                      style={{
                        height: 60,
                        borderColor: theme.colors.grey4,
                        borderWidth: 0.5,
                        marginTop: 10,
                        paddingHorizontal: 10,
                        borderRadius: 5,
                      }}
                    />
                  </View>
                </View>
              )}
            />
          </ScrollView>
          <View
            style={{
              position: "absolute",
              width: (width * 2) / 5,
              bottom: height / 25,
              alignSelf: "center",
            }}
          >
            <Button
              radius={25}
              icon={
                !allRated ? (
                  <IconStarOff size={20} color={theme.colors.grey4} />
                ) : (
                  <IconStar size={20} color={theme.colors.white} />
                )
              }
              buttonStyle={{
                gap: 6,
                paddingVertical: 10,
              }}
              disabled={!allRated}
              title={"Đánh giá"}
              onPress={handleCreateRatings}
            />
          </View>
        </>
      )}
    </View>
  );
};

export default RateTrip;

const styles = StyleSheet.create({});

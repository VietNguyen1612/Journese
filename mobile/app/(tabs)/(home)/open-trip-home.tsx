import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  View,
} from "react-native";
import { useAuthStore } from "../../../store";
import { useRecommendationTripByStatus } from "../../../api/trip";
import { Loading, TripFullScreen } from "../../../components";
import { useEffect, useState } from "react";
import AnimatedLottieView from "lottie-react-native";
import { Text, makeStyles } from "@rneui/themed";
import { Image } from "react-native";
const { height, width } = Dimensions.get("window");
const JourneseIcon = require(`../../../assets/images/journese-icon.png`);

export const OpenTripHome = () => {
  const styles = useStyles();
  const authPayload = useAuthStore((state) => state.authPayload);
  const [refHeight, setRefHeight] = useState(0);

  const {
    data: incData,
    isLoading: isIncLoading,
    isFetching: isIncFetching,
    isFetchingNextPage,
    refetch: incRefetch,
    hasNextPage: hasNextPageIncTrip,
    fetchNextPage: fetchNextPageIncTrip,
  } = useRecommendationTripByStatus(
    authPayload?.tokens.accessToken!,
    authPayload?.user._id!,
    "IN-COMING"
  );

  const handleLoadMoreIncTrip = () => {
    if (hasNextPageIncTrip && !isIncLoading) {
      fetchNextPageIncTrip();
    }
  };

  return (
    <>
      {isFetchingNextPage && (
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
                source={JourneseIcon}
                style={{ width: "100%", height: "100%", resizeMode: "contain" }}
              />
            </View>
            <AnimatedLottieView
              source={require("../../../assets/lotties/loading_animation.json")}
              style={{
                position: "absolute",
                width: width,
                height: "110%",
                bottom: "-16%",
              }}
              // colorFilters={[
              //   { color: "#9edda5", keypath: "Dot4" },
              //   { color: "#9edda5", keypath: "Dot3" },
              //   { color: "#9edda5", keypath: "Dot2" },
              //   { color: "#9edda5", keypath: "Dot1" },
              // ]}
              autoPlay
              loop
            />
          </View>
        </View>
      )}
      {isIncFetching && !isFetchingNextPage ? (
        <View
          style={{
            height: height,
            justifyContent: "center",
            alignItems: "center",
            marginTop: height / 10,
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
              source={JourneseIcon}
              style={{ width: "100%", height: "100%", resizeMode: "contain" }}
            />
          </View>
          <Loading size="20%" />
        </View>
      ) : incData && incData.pages?.flat().length > 0 ? (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={isIncFetching} onRefresh={incRefetch} />
          }
          data={incData.pages.flat()}
          renderItem={({ item }) => (
            <TripFullScreen setRefHeight={setRefHeight} post={item} />
          )}
          ListFooterComponent={
            <View
              style={{
                marginVertical: 16,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ActivityIndicator size="large" color="#aaa" />
            </View>
          }
          onEndReached={() => handleLoadMoreIncTrip()}
          showsVerticalScrollIndicator={false}
          snapToInterval={refHeight}
          snapToAlignment={"start"}
          decelerationRate={"fast"}
        />
      ) : (
        <View style={styles.notFound}>
          <AnimatedLottieView
            source={require("../../../assets/lotties/notfound_animation.json")}
            style={{
              width: "100%",
              height: 180,
            }}
            autoPlay
            loop
          />
          <Text style={styles.notFoundText}>Không có hành trình!</Text>
        </View>
      )}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    height: 36,
    width: (width * 8) / 9,
    backgroundColor: theme.colors.background,
    borderRadius: 999,
    borderColor: theme.colors.brand.primary[600],
  },
  buttonTextStyle: {
    fontSize: 14,
  },
  notFound: {
    alignItems: "center",
    marginBottom: 30,
    justifyContent: "center",
    height: "95%",
  },
  notFoundText: {
    fontSize: 22,
    fontWeight: "600",
    color: theme.colors.grey3,
  },
}));

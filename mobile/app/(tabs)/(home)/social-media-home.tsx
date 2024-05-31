import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import { useAuthStore } from "../../../store";
import { useRecommendationTripByStatus } from "../../../api/trip";
import { Loading, TripFullScreen } from "../../../components";
import { useState } from "react";
import AnimatedLottieView from "lottie-react-native";
import { Button, Text, makeStyles, useTheme } from "@rneui/themed";
import { ListPosts } from "../../../components/ListPosts";
import { IconPencilPlus } from "tabler-icons-react-native";
import { router } from "expo-router";
import { useAllPosts } from "../../../api/post";
const { height, width } = Dimensions.get("window");
const JourneseIcon = require(`../../../assets/images/journese-icon.png`);

export const SocialMediaHome = () => {
  const { theme } = useTheme();
  const styles = useStyles();
  const authPayload = useAuthStore((state) => state.authPayload);

  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    refetch,
    hasNextPage,
    fetchNextPage,
  } = useAllPosts();

  const handleLoadMore = () => {
    if (hasNextPage && !isLoading) {
      fetchNextPage();
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
      {authPayload && (
        <View
          style={{
            position: "absolute",
            bottom: height / 9,
            width: width,
            zIndex: 1,
            alignItems: "flex-end",
            paddingHorizontal: 20,
          }}
        >
          <Button
            onPress={() =>
              router.push({ pathname: "/(tabs)/(home)/create-post" })
            }
            radius={16}
            buttonStyle={{
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderWidth: 1.4,
              borderColor: "white",
            }}
            icon={<IconPencilPlus size={28} color="white" />}
          />
        </View>
      )}
      {isFetching && !isFetchingNextPage ? (
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
      ) : data && data.pages?.flat().length > 0 ? (
        <FlatList
          data={[""]}
          contentContainerStyle={{ minHeight: height }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <View style={{ height: height / 9 }}></View>
          )}
          ListFooterComponent={() => (
            <View style={{ height: height / 8 }}></View>
          )}
          renderItem={() => <ListPosts data={data?.pages.flat()} />}
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

import { Dimensions, FlatList, View } from "react-native";
import React, { FC, useEffect } from "react";
import { Loading } from "../Loading";
import { Post } from "./Post";
import { useAuthStore } from "../../store";
import { useAllUserPosts } from "../../api/post";
import AnimatedLottieView from "lottie-react-native";
import { Text, useTheme } from "@rneui/themed";
import { UserPost } from "./UserPost";
import { useNavigation } from "expo-router";
const { width, height } = Dimensions.get("window");

export const ListUserPosts: FC = () => {
  const { theme } = useTheme();
  const { authPayload } = useAuthStore();
  const { data, isFetching, isLoading, refetch } = useAllUserPosts(
    authPayload?.tokens.accessToken!,
    authPayload?.user._id!
  );
  const navigation = useNavigation();
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      refetch();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View>
      {isLoading ? (
        <Loading size={150} />
      ) : data && data.pages?.flat().length > 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() => <View style={{ height: 20 }}></View>}
          scrollEnabled={false}
          data={data?.pages.flat()}
          renderItem={({ item }) => <UserPost post={item} refetch={refetch} />}
        />
      ) : (
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: width,
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
                fontSize: 22,
                paddingBottom: 30,
                fontWeight: "600",
                color: theme.colors.grey3,
              }}
            >
              Không có bài viết!
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

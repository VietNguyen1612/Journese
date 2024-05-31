import { Avatar, Button, Image, makeStyles, useTheme } from "@rneui/themed";
import { router } from "expo-router";
import { FC, RefObject, useEffect, useRef, useState } from "react";
import { Dimensions, FlatList, Pressable, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Carousel from "react-native-snap-carousel";
import {
  IconAccessible,
  IconBookmark,
  IconCalendarEvent,
  IconDotsVertical,
  IconExclamationCircle,
  IconInfoCircle,
  IconMapPin,
  IconUser,
} from "tabler-icons-react-native";
import { Place } from "../../app/(general)/trip-detail";
import { dateString } from "../../utils/regex";
import { AuthUser } from "../../store";
// import EnhancedImageViewing from "react-native-image-viewing/dist/ImageViewing";

const { height, width } = Dimensions.get("window");
const profile_image = require("../../assets/images/profile-image.jpeg");

interface PostInterface {
  _id: string;
  title: string;
  places: Array<Place>;
  startDate: string;
  endDate: string;
  status: string;
  participates: Array<AuthUser>;
}

interface ViewProps {
  // Define any necessary props for the 'View' component
}

interface PostProps {
  post: PostInterface;
  setRefHeight: React.Dispatch<React.SetStateAction<number>>;
}
export const SLIDER_WIDTH = Dimensions.get("window").width;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH);

export const TripFullScreen: FC<PostProps> = ({ post, setRefHeight }) => {
  const { theme } = useTheme();
  const style = useStyles();
  const isCarousel = useRef(null);
  // const orderRef = useRef(
  //   post.places.sort(() => 0.5 - Math.random()).slice(0, 3)
  // );

  return (
    <View
      onLayout={(event) => {
        const { x, y, width, height } = event.nativeEvent.layout;
        setRefHeight(height);
      }}
      style={{ flex: 1, backgroundColor: "black" }}
    >
      <Carousel
        vertical={false}
        layout="tinder"
        layoutCardOffset={9}
        ref={isCarousel}
        data={[post.places[0], ...post.places]}
        renderItem={({ item, index }) => (
          <View>
            {index === 0 ? (
              <FlatList
                scrollEnabled={false}
                data={post.places.sort(() => 0.5 - Math.random()).slice(0, 3)}
                renderItem={({ item }) => (
                  <View
                    style={{
                      height:
                        height /
                        (post.places.length > 3 ? 3 : post.places.length),
                    }}
                  >
                    <Image
                      style={{
                        height: "100%",
                        width: "100%",
                        resizeMode: "cover",
                      }}
                      source={{
                        uri: item.images[
                          Math.floor(Math.random() * item.images.length)
                        ],
                      }}
                    />
                  </View>
                )}
              />
            ) : (
              <View style={{ height: height, backgroundColor: "black" }}>
                <Image
                  style={{
                    height: "100%",
                    width: "100%",
                    resizeMode: "contain",
                    marginTop: -height / 20,
                  }}
                  source={{ uri: item.images[0] }}
                />
              </View>
            )}

            <View
              style={{
                height: height / 3,
                position: "absolute",
                width: width,
                backgroundColor: "black",
                opacity: 0.4,
                bottom: 0,
              }}
            />
            <View
              style={{
                position: "absolute",
                left: width / 18 + 4,
                top: height / 4 + 4,
                width: (width * 3) / 4,
              }}
            >
              {index === 0 && (
                <Text
                  style={{
                    fontSize: 44,
                    color: "black",
                    fontWeight: "700",
                  }}
                >
                  {post.title}
                </Text>
              )}
            </View>
            <View
              style={{
                position: "absolute",
                left: width / 18,
                top: height / 4,
                width: (width * 3) / 4,
              }}
            >
              {index === 0 && (
                <Text
                  style={{
                    fontSize: 44,
                    color: theme.colors.brand.yellow[600],
                    fontWeight: "700",
                  }}
                >
                  {post.title}
                </Text>
              )}
            </View>
            <View
              style={{
                flexDirection: "column",
                position: "absolute",
                left: width / 18,
                bottom: (height * 2) / 11,
                gap: 10,
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <IconMapPin color="white" />
                <Text
                  style={{
                    color: "white",
                    fontSize: 18,
                    fontWeight: "500",
                    maxWidth: (width * 10) / 12,
                  }}
                  numberOfLines={1}
                >
                  {index == 0
                    ? post.places.map(
                        (item, index) => (index == 0 ? "" : ", ") + item.name
                      )
                    : item.name}
                </Text>
              </View>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <IconCalendarEvent color="white" />
                <View>
                  <Text
                    style={{ color: "white", fontSize: 16, fontWeight: "400" }}
                  >
                    Từ {dateString(post.startDate)}
                  </Text>
                  <Text
                    style={{ color: "white", fontSize: 16, fontWeight: "400" }}
                  >
                    Đến {dateString(post.endDate)}
                  </Text>
                </View>
              </View>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <IconUser color="white" />

                <FlatList
                  horizontal
                  scrollEnabled={false}
                  contentContainerStyle={{ gap: -10 }}
                  data={post.participates.slice(0, 4)}
                  renderItem={({ item, index }) => (
                    <Avatar
                      key={index}
                      rounded
                      containerStyle={{
                        borderColor: "white",
                        borderWidth: 1,
                      }}
                      size={26}
                      source={
                        item?.avatarUrl
                          ? { uri: item?.avatarUrl }
                          : profile_image
                      }
                    />
                  )}
                  ListFooterComponent={
                    <Text
                      style={{
                        color: "white",
                        fontSize: 15,
                      }}
                    >
                      {post.participates.length > 3
                        ? "3+"
                        : post.participates.length}{" "}
                      Thành viên
                    </Text>
                  }
                  ListFooterComponentStyle={{
                    marginLeft: 20,
                    justifyContent: "center",
                  }}
                />
              </View>
            </View>
            <View
              style={{
                position: "absolute",
                bottom: height / 9,
                width: width,
                paddingHorizontal: 20,
              }}
            >
              <Button
                onPress={() =>
                  router.push({
                    pathname: "/(general)/trip-detail",
                    params: { tripId: `${post._id}` },
                  })
                }
                radius={999}
                title="Xem chi tiết"
                color={theme.colors.brand.primary[600]}
                titleStyle={{ fontSize: 16, fontWeight: "500" }}
              />
            </View>
          </View>
        )}
        sliderWidth={SLIDER_WIDTH}
        itemWidth={ITEM_WIDTH}
        inactiveSlideShift={0}
        useScrollView={true}
      />

      {/* <View style={style.actionButtonContainer}>
        <Pressable
          style={{ alignItems: "center", gap: 2 }}
          onPress={() => router.push("/(general)/trip-detail")}
        >
          <IconInfoCircle size={42} color="white" />
          <Text style={{ fontSize: 14, color: "white", fontWeight: "500" }}>
            Chi tiết
          </Text>
        </Pressable>
        {post.status === "Sắp diễn ra" ? (
          <Pressable style={{ alignItems: "center", gap: 2 }}>
            <IconAccessible size={38} color="white" />
            <Text style={{ fontSize: 14, color: "white", fontWeight: "500" }}>
              Tham gia
            </Text>
          </Pressable>
        ) : (
          <Pressable style={{ alignItems: "center", gap: 2 }}>
            <IconBookmark size={38} color="white" />
            <Text style={{ fontSize: 14, color: "white", fontWeight: "500" }}>
              Lưu
            </Text>
          </Pressable>
        )}
      </View> */}
    </View>
  );
};

const useStyles = makeStyles((theme) => ({
  contentContainer: {
    position: "absolute",
  },
  actionButtonContainer: {
    position: "absolute",
    flexDirection: "column",
    right: width / 20,
    bottom: height / 20,
    gap: 20,
  },
}));

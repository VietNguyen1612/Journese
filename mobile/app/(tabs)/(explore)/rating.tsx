import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import {
  AirbnbRating,
  Avatar,
  Button,
  Card,
  ListItem,
  useTheme,
} from "@rneui/themed";
import {
  FlatList,
  RefreshControl,
  ScrollView,
} from "react-native-gesture-handler";
import { StarIcon } from "react-native-heroicons/solid";
import { useLocalSearchParams } from "expo-router";
import { useRatingByPlaceId } from "../../../api/place";
import AnimatedLottieView from "lottie-react-native";
import {
  IconArrowsSort,
  IconSortAscending,
  IconSortDescending,
} from "tabler-icons-react-native";
import { Divider } from "@rneui/themed";
const { height, width } = Dimensions.get("window");
const ratingData = [
  {
    id: "1",
    user: {
      name: "Nguyen1",
      avatar: "https://i.9mobi.vn/cf/Images/huy/2021/12/6/anh-gai-xinh-9.jpg",
    },
    date: "15/3/2024",
    rate: 5,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  {
    id: "2",
    user: {
      name: "Nguyen1",
      avatar: "https://i.9mobi.vn/cf/Images/huy/2021/12/6/anh-gai-xinh-9.jpg",
    },
    date: "15/3/2024",
    rate: 4,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  {
    id: "3",
    user: {
      name: "Nguyen1",
      avatar: "https://i.9mobi.vn/cf/Images/huy/2021/12/6/anh-gai-xinh-9.jpg",
    },
    date: "15/3/2024",
    rate: 3,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  {
    id: "4",
    user: {
      name: "Nguyen1",
      avatar: "https://i.9mobi.vn/cf/Images/huy/2021/12/6/anh-gai-xinh-9.jpg",
    },
    date: "15/3/2024",
    rate: 2,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  {
    id: "5",
    user: {
      name: "Nguyen1",
      avatar: "https://i.9mobi.vn/cf/Images/huy/2021/12/6/anh-gai-xinh-9.jpg",
    },
    date: "15/3/2024",
    rate: 2,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  {
    id: "6",
    user: {
      name: "Nguyen1",
      avatar: "https://i.9mobi.vn/cf/Images/huy/2021/12/6/anh-gai-xinh-9.jpg",
    },
    date: "15/3/2024",
    rate: 2,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
];

const Rating = () => {
  const { place_id } = useLocalSearchParams();
  const placeIdString = place_id ? place_id.toString() : "";
  const { data, isFetching, error, refetch } =
    useRatingByPlaceId(placeIdString);
  const [toolExpend, setToolExpend] = useState(false);
  // console.log(data)
  //   const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState(1);
  const { theme } = useTheme();
  const returnFormattedDate = (date: string) => {
    let newdate = new Date(date);
    let day = String(newdate.getUTCDate()).padStart(2, "0");
    let month = String(newdate.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-based in JavaScript
    let year = newdate.getUTCFullYear();
    let hours = String(newdate.getUTCHours()).padStart(2, "0");
    let minutes = String(newdate.getUTCMinutes()).padStart(2, "0");
    let formattedDate = `${day}-${month}-${year} Vào lúc ${hours}h${minutes}`;
    return formattedDate;
  };

  const handleSortBy = (order: number) => {
    setSortOrder(order);
    setToolExpend(false);
  };

  return (
    <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
                <View style={{ flexDirection: 'row', margin: 10, alignItems: 'center' }}>
                    <Text>Sắp xếp: </Text>
                    <View style={{ flexDirection: 'column' }}>
                        <Button buttonStyle={{ borderRadius: 99, backgroundColor: sortBy === 'date' ? theme.colors.brand.primary[500] : theme.colors.brand.primary[200] }}>ngày</Button>
                        <Button buttonStyle={{ borderRadius: 99, backgroundColor: sortBy === 'star' ? theme.colors.brand.primary[500] : theme.colors.brand.primary[200] }}>sao</Button>
                    </View>

                </View>
                <View style={{ flexDirection: 'row', margin: 10, alignItems: 'center' }}>
                    <Text>Thứ tự: </Text>
                    <View style={{ flexDirection: 'column' }}>
                        <Button buttonStyle={{ borderRadius: 99 }}>tăng</Button>
                        <Button buttonStyle={{ borderRadius: 99 }}>giảm</Button>
                    </View>

                </View>
            </View> */}
      <View>
        <ListItem.Accordion
          noIcon
          containerStyle={{
            margin: 10,
            borderRadius: 999,
            borderWidth: 1,
            right: 10,
            position: "absolute",
            paddingVertical: 6,
            paddingRight: 0,
          }}
          content={
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Text>Sắp xếp</Text>
              <IconArrowsSort size={20} />
            </View>
          }
          isExpanded={toolExpend}
          onPress={() => {
            setToolExpend(!toolExpend);
          }}
        >
          <View
            style={{
              position: "absolute",
              top: height / 17,
              right: 22,
              borderWidth: 0.2,
              borderColor: theme.colors.grey4,
              backgroundColor: theme.colors.background,
              paddingHorizontal: 18,
              paddingVertical: 8,
              borderRadius: 10,
              gap: 3,
              shadowRadius: 8,
              shadowOpacity: 0.2,
              shadowOffset: { width: 4, height: 6 },
            }}
          >
            <Pressable
              onPress={() => handleSortBy(1)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <Text>Ngày</Text>
              <IconSortDescending />
            </Pressable>
            <Divider />
            <Pressable
              onPress={() => handleSortBy(2)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <Text>Ngày</Text>
              <IconSortAscending />
            </Pressable>
            <Divider />
            <Pressable
              onPress={() => handleSortBy(3)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <Text>Sao</Text>
              <IconSortDescending />
            </Pressable>
            <Divider />
            <Pressable
              onPress={() => handleSortBy(4)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <Text>Sao</Text>
              <IconSortAscending />
            </Pressable>
          </View>
        </ListItem.Accordion>
      </View>
      <ScrollView
        style={{ marginTop: height / 20, zIndex: -10 }}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
        showsVerticalScrollIndicator={false}
      >
        {data?.length !== 0 ? (
          <FlatList
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            data={
              !sortOrder
                ? data
                : data?.sort((a: any, b: any) => {
                    if (sortOrder === 1)
                      return new Date(b?.createdAt) - new Date(a?.createdAt);
                    if (sortOrder === 2)
                      return new Date(a?.createdAt) - new Date(b?.createdAt);
                    if (sortOrder === 3) return b.rating - a.rating;
                    if (sortOrder === 4) return a.rating - b.rating;
                  })
            }
            renderItem={({ item, index }) => (
              <Card
                containerStyle={{
                  borderRadius: 10,
                }}
                key={item._id}
              >
                <View
                  style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
                >
                  <Avatar
                    rounded
                    source={{ uri: item.userId.avatarUrl }}
                    size={50}
                  />
                  <View style={{ flexDirection: "column", gap: 2 }}>
                    <Text style={{ fontSize: 16, fontWeight: "600" }}>
                      {item.userId.firstName + " " + item.userId.lastName}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "500",
                        color: theme.colors.grey3,
                      }}
                    >
                      {returnFormattedDate(item.createdAt)}
                    </Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", marginVertical: 5 }}>
                  {Array(item.rating)
                    .fill(null)
                    .map((_, index) => (
                      <StarIcon
                        key={index}
                        size={20}
                        color={theme.colors.brand.yellow[500]}
                      />
                    ))}
                  {Array(5 - item.rating)
                    .fill(null)
                    .map((_, index) => (
                      <StarIcon
                        key={index}
                        size={20}
                        color={theme.colors.brand.neutral[200]}
                      />
                    ))}
                </View>
                <Text>{item.message}</Text>
              </Card>
            )}
          />
        ) : (
          <View
            style={{
              alignItems: "center",
              marginBottom: 30,
              justifyContent: "center",
              height: "100%",
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
                fontSize: 22,
                fontWeight: "600",
                color: theme.colors.grey3,
              }}
            >
              Không có đánh giá!
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Rating;

import { Dimensions, FlatList, Pressable, StatusBar, View } from "react-native";
import React, { useState } from "react";
import { Text, makeStyles, useTheme } from "@rneui/themed";
import { useIsFocused } from "@react-navigation/native";
import { CompleteTripHome } from "./complete-trip-home";
import { OpenTripHome } from "./open-trip-home";
import { Loading } from "../../../components";
import { ListPosts } from "../../../components/ListPosts";
import { SocialMediaHome } from "./social-media-home";
const { height, width } = Dimensions.get("window");

const SwitchButton = ({
  selectedIndex,
  setSelectedIndex,
}: {
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
}) => {
  const { theme } = useTheme();
  const keyExtractor = (item: any, index: number) => index.toString();

  return (
    <FlatList
      contentContainerStyle={{
        width: width,
        justifyContent: "center",
        gap: 10,
        borderColor: theme.colors.grey5,
        paddingTop: height / 16,
      }}
      horizontal
      scrollEnabled={false}
      showsHorizontalScrollIndicator={false}
      data={["Trang chủ", "Tham khảo", "Đang mở"]}
      extraData={selectedIndex}
      keyExtractor={keyExtractor}
      renderItem={({ item, index }: { item: string; index: number }) => (
        <Pressable
          onPress={() => setSelectedIndex(index)}
          style={{
            borderBottomColor: "white",
            borderBottomWidth: selectedIndex === index ? 2 : 0,
            paddingVertical: 5,
            paddingHorizontal: 10,
            marginBottom: 8,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "600", color: "white" }}>
            {item}
          </Text>
        </Pressable>
      )}
    />
  );
};

const index = () => {
  const isFocused = useIsFocused();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener("focus", () => {
  //     compRefetch();
  //     incRefetch();
  //   });

  //   return unsubscribe;
  // }, [navigation]);

  return (
    <View style={{ height: height }}>
      {/* <FlatList
        data={posts.filter((item) => item.status == "Đã hoàn thành")}
        renderItem={({ item }) => <Post post={item} />}
        showsVerticalScrollIndicator={false}
        snapToInterval={(height * 11) / 12}
        snapToAlignment={"start"}
        decelerationRate={"fast"}
      /> */}
      {isLoading ? (
        <View style={{ height: height, justifyContent: "center" }}>
          <Loading size="40%" />
        </View>
      ) : (
        <View>
          {isFocused && <StatusBar barStyle="light-content" />}
          <View
            style={{
              position: "absolute",
              zIndex: 10,
              width: width,
              alignItems: "center",
              backgroundColor: "rgba(30,30,30,0.4)",
              top: 0,
            }}
          >
            <SwitchButton
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
            />
          </View>
          {selectedIndex === 0 && <SocialMediaHome />}
          {selectedIndex === 1 && <CompleteTripHome />}
          {selectedIndex === 2 && <OpenTripHome />}
        </View>
      )}
    </View>
  );
};

export default index;

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
    height: "100%",
  },
  notFoundText: {
    fontSize: 22,
    fontWeight: "600",
    color: theme.colors.grey3,
  },
}));

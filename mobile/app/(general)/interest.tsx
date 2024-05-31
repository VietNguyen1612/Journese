import { Dimensions, Pressable, StatusBar, Text, View } from "react-native";
import { useAuthStore, useInterestStore } from "../../store";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { Avatar, Button, Image, useTheme } from "@rneui/themed";
import { RenderItemParams } from "react-native-draggable-flatlist";
import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { IconAlignLeft, IconChevronLeft } from "tabler-icons-react-native";
import { useProvinceName } from "../../utils/customHook";
import { Loading } from "../../components";
import AnimatedLottieView from "lottie-react-native";
import { ratingPlaces, useExplorePLaces } from "../../api/place";
const { height, width } = Dimensions.get("window");

const InterestTab = [
  "Chọn tỉnh thành mà bạn QUAN TÂM",
  "Chọn các địa điểm làm bạn QUAN TÂM",
  "Chọn tỉnh thành mà bạn ÍT quan tâm",
  "Chọn các địa điểm bạn ÍT quan tâm",
];

const Interest = () => {
  const { theme } = useTheme();
  const isFocused = useIsFocused();
  const { authPayload } = useAuthStore();
  const navigation = useNavigation();
  const [selectedPlace, setSelectedPlace] = useState<Array<string>>([]);
  const [selectedProvinces, setSelectedProvinces] = useState<Array<string>>([]);
  const [tab, setTab] = useState(0);
  const { data, isLoading, isError } = useExplorePLaces(
    authPayload?.user._id,
    "",
    [],
    10
  );

  const [showData, setShowData] = useState([]);

  // console.log(showData);

  useEffect(() => {
    if (data) {
      if (tab === 0) {
        setSelectedPlace([]);
      }
      if (tab === 2) {
        setSelectedPlace([]);
        setSelectedProvinces([]);
      }
      if (tab % 2 === 0) {
        setShowData(
          data.map((item: any) => ({
            id: item._id,
            name: useProvinceName(item._id),
            image: item.places[0].images[0],
          }))
        );
      } else {
        const places = data
          .filter((item: any) => selectedProvinces.includes(item._id))
          .reduce((res: any[], item: any) => [...res, ...item.places], []);

        setShowData(
          places.map((item: any) => ({
            id: item.place_id,
            name: item.name,
            image: item.images[0],
          }))
        );
      }
    }
  }, [tab, data]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: InterestTab[tab],
      headerStyle: {
        backgroundColor: "#181818",
      },
      headerTitleStyle: {
        color:
          tab < 2
            ? theme.colors.brand.primary[400]
            : theme.colors.brand.yellow[500],
        fontWeight: "600",
        fontSize: 18,
      },
      headerTintColor: "white",
      headerLeft() {
        return (
          <Pressable
            onPress={() => {
              if (tab === 0) {
                router.back();
              } else {
                if (tab === 2) setSelectedProvinces([]);
                setTab((pre) => pre - 1);
              }
            }}
            style={{
              transform: [{ scale: 1.2 }],
            }}
          >
            <IconChevronLeft size={26} color="white" />
          </Pressable>
        );
      },
    });
  }, [tab]);

  const handleNextButton = async () => {
    if (tab === 1) {
      const favorites = selectedPlace.map((item) => ({
        placeId: item,
        rating: 5,
      }));
      await ratingPlaces(
        authPayload?.tokens.accessToken!,
        authPayload?.user._id!,
        favorites
      );
    }
    if (tab === 3) {
      const favorites = selectedPlace.map((item) => ({
        placeId: item,
        rating: 1,
      }));
      await ratingPlaces(
        authPayload?.tokens.accessToken!,
        authPayload?.user._id!,
        favorites
      );
    }

    if (tab == 3) {
      router.push("/(tabs)/(profile)/account-menu");
      router.push("/(tabs)/(profile)/profile");
    } else {
      if (tab === 1) {
        setSelectedPlace([]);
      }
      setTab((pre) => pre + 1);
    }
  };

  const Tag = ({ item }: any) => {
    return (
      <Pressable
        key={item.id}
        style={{
          width: width / 3,
          marginVertical: 1.5,
        }}
        onPress={() => {
          if (tab % 2 === 0) {
            setSelectedProvinces((pre) =>
              pre.includes(item.id)
                ? pre.filter((e) => e !== item.id)
                : [...pre, item.id]
            );
          } else {
            setSelectedPlace((pre) =>
              pre.includes(item.id)
                ? pre.filter((e) => e !== item.id)
                : [...pre, item.id]
            );
          }
        }}
      >
        <View
          style={[
            {
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 14,
            },
          ]}
        >
          <Image
            source={{
              uri: item.image,
            }}
            containerStyle={{
              borderRadius: 20,
              aspectRatio: 1,
              width: width / 3 - 8,
              borderWidth: 4,
              borderColor:
                tab < 2
                  ? selectedPlace.includes(item.id) ||
                    selectedProvinces.includes(item.id)
                    ? theme.colors.brand.primary[600]
                    : "transparent"
                  : selectedPlace.includes(item.id) ||
                    selectedProvinces.includes(item.id)
                  ? theme.colors.brand.yellow[600]
                  : "transparent",
            }}
            style={{
              borderRadius: 15,
            }}
          />
          <View
            style={{
              position: "absolute",
              width: width / 3 - 8,
              aspectRatio: 1,
              backgroundColor:
                selectedPlace.includes(item.id) ||
                selectedProvinces.includes(item.id)
                  ? "rgba(30,30,30,0.2)"
                  : "rgba(30,30,30,0.45)",
              borderRadius: 20,
              borderWidth: 4,
              borderColor:
                tab < 2
                  ? selectedPlace.includes(item.id) ||
                    selectedProvinces.includes(item.id)
                    ? theme.colors.brand.primary[600]
                    : "transparent"
                  : selectedPlace.includes(item.id) ||
                    selectedProvinces.includes(item.id)
                  ? theme.colors.brand.yellow[600]
                  : "transparent",
            }}
          />
          <Text
            numberOfLines={3}
            style={{
              position: "absolute",
              color: "white",
              fontSize: 16,
              fontWeight: "600",
              textAlign: "center",
              maxWidth: "70%",
            }}
          >
            {item.name}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.brand.neutral[900],
      }}
    >
      {isFocused && <StatusBar barStyle="light-content" />}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            alignItems: "center",
            paddingTop: 16,
          }}
        >
          {isLoading ? (
            <Loading size={300} />
          ) : showData.length > 0 ? (
            <View
              style={{
                paddingBottom: height / 6,
                flexDirection: "row",
              }}
            >
              <FlatList
                contentContainerStyle={{ gap: 5 }}
                scrollEnabled={false}
                data={showData.slice(
                  (showData.length * 2) / 3,
                  showData.length
                )}
                renderItem={({ item }) => <Tag item={item} />}
              />
              <FlatList
                contentContainerStyle={{ gap: 5, marginTop: height / 16 }}
                scrollEnabled={false}
                data={showData.slice(0, showData.length / 3)}
                renderItem={({ item }) => <Tag item={item} />}
              />
              <FlatList
                contentContainerStyle={{ gap: 5 }}
                scrollEnabled={false}
                data={showData.slice(
                  showData.length / 3,
                  (showData.length * 2) / 3
                )}
                renderItem={({ item }) => <Tag item={item} />}
              />
            </View>
          ) : (
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
                  padding: 20,
                  fontSize: 18,
                  fontWeight: "600",
                  color: theme.colors.grey3,
                }}
              >
                Không có địa điểm nào!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      <View
        style={{
          position: "absolute",
          width: width,
          height: height / 7,
          backgroundColor: "rgba(40,40,40,0.7)",
          justifyContent: "center",
          bottom: 0,
          paddingHorizontal: 30,
          paddingBottom: 10,
          // shadowOffset: { height: 10, width: 10 },
          // shadowColor: "white",
        }}
      >
        <Button
          radius={999}
          title={tab % 2 !== 0 ? "Xác nhận" : "Tiếp theo"}
          size="lg"
          raised
          disabled={
            tab % 2 === 0
              ? selectedProvinces.length === 0
              : selectedPlace.length === 0
          }
          onPress={() => handleNextButton()}
        />
      </View>
    </View>
  );
};

export default Interest;

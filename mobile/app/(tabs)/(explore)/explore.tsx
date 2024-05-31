import {
  Dimensions,
  FlatList,
  ScrollView,
  InteractionManager,
  Text,
  TouchableOpacity,
  View,
  Pressable,
} from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  ButtonGroup,
  Chip,
  Image,
  SearchBar,
  makeStyles,
  useTheme,
} from "@rneui/themed";
import { useNavigation, useRouter } from "expo-router";
import PlaceCard from "../../../components/PlaceCard/PlaceCard";
import { AdjustmentsHorizontalIcon } from "react-native-heroicons/solid";
import BottomSheet, {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { ListCardTrips, Loading, LoadingScreen } from "../../../components";
import {
  IconArrowRight,
  IconCalendarEvent,
  IconUser,
} from "tabler-icons-react-native";
import { Avatar } from "@rneui/themed";
import { useAllTag, useExplorePLaces, usePlaceByTag } from "../../../api/place";
import { useProvinceName } from "../../../utils/customHook";
import { RefreshControl } from "react-native-gesture-handler";
import AnimatedLottieView from "lottie-react-native";
import { useAuthStore } from "../../../store";
import SwiperFlatList from "react-native-swiper-flatlist";
import { useAllAds } from "../../../api/ads";

const { width, height } = Dimensions.get("screen");
const tag = [
  "Biển",
  "Đảo",
  "Lạnh",
  "Núi",
  "Nhộn nhịp",
  "Bình yên",
  "Cổ kính",
  "Cảnh đẹp",
];

const Explore = () => {
  const { authPayload } = useAuthStore();
  const { data: dataTag } = useAllTag();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const styles = useStyles();
  const { theme } = useTheme();
  const router = useRouter();

  const {
    data: adsData,
    isLoading: adsIsLoading,
    isFetching: adsIsFetching,
    refetch: adsRefetch,
  } = useAllAds();
  const navigation = useNavigation();
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      adsRefetch();
    });

    return unsubscribe;
  }, [navigation]);
  const flatListRef = useRef<FlatList>(null);

  //state
  const [searchKeyword, setSearchKeyword] = useState("");
  const [submittedKeyword, setSubmittedKeyword] = useState("");
  const [filterListRender, setFilterListRender] = useState<
    Array<{ _id: string; name: string }>
  >([]);
  const [filterList, setFilterList] = useState<
    Array<{ _id: string; name: string }>
  >([]);
  const { data, isFetching, isError, refetch } = useExplorePLaces(
    authPayload?.user._id,
    submittedKeyword,
    filterListRender
  );
  // const {
  //   data: filteredData,
  //   isFetching: isFetchingFilteredData,
  //   refetch: refetchFilteredData,
  // } = usePlaceByTag(filterListRender)
  const [debouncedSetFilterList, setDebouncedSetFilterList] = useState([]);
  const [isRendered, setIsRendered] = useState(false);
  //tại khi vô trang này nó load lâu, t search chatgpt thêm cái này
  useEffect(() => {
    const handleInteraction = () => {
      // Your heavy rendering logic goes here

      // Set isRendered to true when rendering is done
      setIsRendered(true);
    };
    // Defer the heavy rendering until interactions are done
    const interactionManager =
      InteractionManager.runAfterInteractions(handleInteraction);

    // Cleanup function to cancel the deferred rendering if the component unmounts
    return () => interactionManager.cancel();
  }, []);

  //for bottom sheet
  //ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ["25%", "70%"], []);

  const onClickOpenModal = (item: string) => {
    //setIsModalOpened(true)
  };

  return (
    <>
      <BottomSheetModalProvider>
        {isRendered ? (
          <View style={styles.screenContainer}>
            <View
              style={{
                position: "absolute",
                top: height / 9,
                height: height / 5,
                width: width,
              }}
            >
              <SwiperFlatList
                autoplay
                autoplayLoop
                autoplayLoopKeepAnimation
                renderAll
                data={adsData}
                renderItem={(item) => (
                  <Image
                    style={{
                      height: height / 5,
                      width: width,
                    }}
                    source={{
                      uri: item.item,
                    }}
                  />
                )}
              />
            </View>
            <View
              style={{
                width: width,
                alignItems: "center",
                height: height / 9.5,
                paddingTop: height / 15,
                marginBottom: 5,
              }}
            >
              <FlatList
                contentContainerStyle={{
                  width: width,
                  justifyContent: "center",
                  gap: 10,
                }}
                horizontal
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
                data={["Địa điểm", "Đang mở"]}
                renderItem={({
                  item,
                  index,
                }: {
                  item: string;
                  index: number;
                }) => (
                  <Pressable
                    onPress={() => setSelectedIndex(index)}
                    style={{
                      borderBottomColor: theme.colors.brand.primary[600],
                      borderBottomWidth: selectedIndex === index ? 3 : 0,
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "600",
                        color:
                          selectedIndex === index
                            ? theme.colors.brand.primary[600]
                            : theme.colors.grey2,
                      }}
                    >
                      {item}
                    </Text>
                  </Pressable>
                )}
              />
            </View>
            {selectedIndex === 0 ? (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginHorizontal: 24,
                    backgroundColor: "white",
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: theme.colors.grey4,
                    marginTop: 6,
                  }}
                >
                  <SearchBar
                    onChangeText={(text) => setSearchKeyword(text)}
                    value={searchKeyword}
                    placeholder="Nhập vào đây để tìm kiếm"
                    platform="android"
                    onSubmitEditing={() => {
                      setSubmittedKeyword(searchKeyword);
                      refetch();
                    }}
                    onClear={() => {
                      setSubmittedKeyword("");
                      refetch();
                    }}
                    containerStyle={{
                      height: height / 24,
                      width: "85%",
                      justifyContent: "center",
                      borderRadius: 5,
                    }}
                    inputStyle={{ fontSize: 14 }}
                  />
                  <TouchableOpacity
                    style={{
                      width: "15%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => {
                      bottomSheetModalRef.current?.present();
                    }}
                  >
                    <AdjustmentsHorizontalIcon size={25} color={"black"} />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    height: height / 7,
                  }}
                ></View>

                <View style={styles.categoryListViewWrapper}>
                  <Text
                    style={{
                      color: theme.colors.brand.neutral[800],
                      fontWeight: "500",
                      marginRight: 5,
                      fontSize: 15,
                    }}
                  >
                    Bộ lọc:
                  </Text>
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    data={filterListRender}
                    renderItem={({ item }) => (
                      <Chip
                        icon={{
                          name: "close",
                          type: "font-awesome",
                          size: 12,
                          color: theme.colors.brand.neutral[400],
                        }}
                        iconRight
                        title={item.name}
                        type="solid"
                        color={theme.colors.background}
                        containerStyle={styles.categoryContainer}
                        titleStyle={styles.categoryText}
                        onPress={() => {
                          setFilterListRender(
                            filterListRender.filter(
                              (value) => value.name != item.name
                            )
                          );
                          setFilterList(
                            filterList.filter(
                              (value) => value.name != item.name
                            )
                          );
                          refetch();
                        }}
                      />
                    )}
                  />
                </View>

                <ScrollView
                  snapToAlignment="start"
                  snapToInterval={height / 4}
                  decelerationRate={"fast"}
                  pagingEnabled
                  refreshControl={
                    <RefreshControl
                      refreshing={isFetching}
                      onRefresh={refetch}
                    />
                  }
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingBottom: 25,
                  }}
                >
                  <>
                    {data?.map((item: any, key: any) => (
                      <View key={key} style={styles.listItemViewWrapper}>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginBottom: 10,
                            paddingLeft: width / 20,
                            paddingRight: width / 50,
                          }}
                        >
                          <Text style={{ fontSize: 18, fontWeight: "500" }}>
                            {useProvinceName(item._id)}
                          </Text>
                          <TouchableOpacity
                            onPress={() => {
                              router.push({
                                pathname: "/(tabs)/(explore)/province-places",
                                params: { placeName: `${item._id}` },
                              });
                            }}
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 3,
                            }}
                          >
                            <Text
                              style={{
                                color: theme.colors.grey2,
                                fontSize: 13,
                              }}
                            >
                              Xem thêm
                            </Text>
                            <IconArrowRight
                              size={17}
                              color={theme.colors.grey2}
                            />
                          </TouchableOpacity>
                        </View>
                        <FlatList
                          contentContainerStyle={{
                            paddingHorizontal: width / 20,
                            gap: 20,
                          }}
                          horizontal
                          initialScrollIndex={0}
                          ref={flatListRef}
                          showsHorizontalScrollIndicator={false}
                          data={item.places}
                          snapToAlignment="start"
                          keyExtractor={(item, index) => index.toString()}
                          snapToInterval={width / 3}
                          decelerationRate={"fast"}
                          pagingEnabled
                          renderItem={({ item }) => <PlaceCard item={item} />}
                        />
                      </View>
                    ))}
                  </>
                </ScrollView>
              </>
            ) : (
              <View
                style={{
                  marginHorizontal: width / 20,
                  marginTop: height / 7,
                }}
              >
                <ListCardTrips
                  contentContainerStyle={{
                    paddingBottom: height / 14,
                    paddingTop: 10,
                  }}
                  userTrip={false}
                  status="IN-COMING"
                  onPress={(e) =>
                    router.push({
                      pathname: "/(general)/trip-detail",
                      params: { tripId: e._id },
                    })
                  }
                />
              </View>
            )}
            <BottomSheetModal
              style={{
                zIndex: 99,
                shadowColor: theme.colors.grey3,
                shadowOpacity: 10,
                shadowRadius: 10,
              }}
              ref={bottomSheetModalRef}
              index={1}
              snapPoints={snapPoints}
            >
              <ScrollView scrollEnabled={false}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "space-evenly",
                    marginTop: 20,
                    paddingHorizontal: width / 20,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 19,
                      fontWeight: "600",
                      marginBottom: 18,
                    }}
                  >
                    Phân loại theo thẻ
                  </Text>

                  <View
                    style={{
                      gap: 8,
                      flexDirection: "row",
                      width: width / 1.1,
                      flexWrap: "wrap",
                      rowGap: 10,
                      marginBottom: height / 5,
                    }}
                  >
                    {dataTag?.map((val: any, key: any) => (
                      <Chip
                        title={val.name}
                        key={key}
                        buttonStyle={{
                          paddingHorizontal: 16,
                          paddingVertical: 6,
                          backgroundColor: filterList.includes(val)
                            ? theme.colors.brand.primary[50]
                            : "white",
                          borderColor: filterList.includes(val)
                            ? theme.colors.brand.primary[600]
                            : theme.colors.grey4,
                          borderWidth: 1.2,
                        }}
                        titleStyle={{ color: theme.colors.grey1 }}
                        type={filterList.includes(val) ? "solid" : "outline"}
                        onPress={() => {
                          if (filterList.includes(val)) {
                            setFilterList((pre) =>
                              pre.filter((item) => item.name != val.name)
                            );
                          } else {
                            setFilterList((pre) => [...pre, val]);
                          }
                        }}
                      />
                    ))}
                  </View>
                  <Button
                    radius={9999}
                    titleStyle={{
                      fontSize: 16,
                      fontWeight: "500",
                    }}
                    buttonStyle={{
                      marginTop: 10,
                      paddingHorizontal: 18,
                      paddingVertical: 9,
                    }}
                    onPress={() => {
                      setFilterListRender(filterList);
                      refetch();
                      bottomSheetModalRef.current?.close();
                    }}
                  >
                    Áp dụng
                  </Button>
                </View>
              </ScrollView>
            </BottomSheetModal>
          </View>
        ) : (
          <LoadingScreen />
        )}
      </BottomSheetModalProvider>
    </>
  );
};

export default Explore;

const useStyles = makeStyles((theme) => ({
  screenContainer: {
    backgroundColor: theme.colors.background,
    flex: 1,
    height: (height * 11) / 12,
  },
  categoryListViewWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    height: height / 24,
    paddingLeft: width / 20,
  },
  categoryContainer: {
    marginHorizontal: 4,
    borderWidth: 1.4,
    borderColor: theme.colors.brand.neutral[400],
  },
  categoryText: {
    fontSize: 13,
    fontWeight: "500",
    color: theme.colors.brand.neutral[600],
  },
  listItemViewWrapper: {
    width: width,
    height: height / 4,
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

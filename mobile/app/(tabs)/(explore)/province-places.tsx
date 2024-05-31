import { ActivityIndicator, Dimensions, StyleSheet, View } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import BottomSheet, {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { Loading, LoadingScreen } from "../../../components";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Avatar,
  Button,
  Card,
  Chip,
  SearchBar,
  makeStyles,
  useTheme,
  Text,
} from "@rneui/themed";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { AdjustmentsHorizontalIcon } from "react-native-heroicons/solid";
import {
  useGlobalSearchParams,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { useNavigation } from "expo-router";
import { useProvincePLaces } from "../../../api/place";
import { useProvinceName } from "../../../utils/customHook";
import { isLoading } from "expo-font";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import BackToPreviousPageButton from "../../../components/BackToPreviousPageButton/BackToPreviousPageButton";
const { width, height } = Dimensions.get("window");

// const data = [
//     {
//         id: '1',
//         name: 'Now Zone',
//         address: 'The Coffee Bean & Tea Leaf, Now Zone Shopping Mall, 235 Nguyễn Văn Cừ St., District 1, Ho Chi Minh City, 748300, Vietnam',
//         description: 'Description'
//     },
//     {
//         id: '2',
//         name: 'Now Zone',
//         address: 'The Coffee Bean & Tea Leaf, Now Zone Shopping Mall, 235 Nguyễn Văn Cừ St., District 1, Ho Chi Minh City, 748300, Vietnam',
//         description: 'Description'
//     },
//     {
//         id: '3',
//         name: 'Now Zone',
//         address: 'The Coffee Bean & Tea Leaf, Now Zone Shopping Mall, 235 Nguyễn Văn Cừ St., District 1, Ho Chi Minh City, 748300, Vietnam',
//         description: 'Description'
//     },
//     {
//         id: '4',
//         name: 'Now Zone',
//         address: 'The Coffee Bean & Tea Leaf, Now Zone Shopping Mall, 235 Nguyễn Văn Cừ St., District 1, Ho Chi Minh City, 748300, Vietnam',
//         description: 'Description'
//     },
//     {
//         id: '5',
//         name: 'Now Zone',
//         address: 'The Coffee Bean & Tea Leaf, Now Zone Shopping Mall, 235 Nguyễn Văn Cừ St., District 1, Ho Chi Minh City, 748300, Vietnam',
//         description: 'Description'
//     }
// ]

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

const ProvincePlaces = () => {
  const [filterListRender, setFilterListRender] = useState<Array<string>>([]);
  const [filterList, setFilterList] = useState<Array<string>>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const styles = useStyles();
  const router = useRouter();
  const { theme } = useTheme();
  const { placeName } = useLocalSearchParams();
  const placeNameString = placeName ? placeName.toString() : "";
  const {
    data,
    isLoading,
    isFetching,
    error,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useProvincePLaces(placeNameString, 5);
  const dataArr = data?.pages.map((page) => page).flat();
  //for bottom sheet
  //ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ["25%", "70%"], []);

  const onClickOpenModal = (item: string) => {
    //setIsModalOpened(true)
  };

  const renderLoader = () => {
    return isLoading || !hasNextPage ? null : (
      <View
        style={{
          marginVertical: 16,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color="#aaa" />
      </View>
    );
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isLoading) {
      fetchNextPage();
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };
  //useEffect(() => { setDataPlaces(data) }, [])
  return (
    <>
      <BottomSheetModalProvider>
        <View style={styles.screenContainer}>
          {isLoading ? (
            <Loading size={"50%"} />
          ) : (
            <FlatList
              data={dataArr}
              onEndReached={handleLoadMore}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
                />
              }
              onEndReachedThreshold={0}
              ListFooterComponent={renderLoader}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={() => (
                <Text
                  style={{
                    fontSize: 18,
                    color: theme.colors.grey2,
                    textAlign: "center",
                  }}
                >
                  Danh sách các địa điểm ở{" "}
                  <Text
                    style={{
                      color: theme.colors.brand.primary[600],
                      fontWeight: "600",
                    }}
                  >
                    {useProvinceName(placeNameString)}
                  </Text>
                </Text>
              )}
              renderItem={({ item }) => (
                <TouchableOpacity
                  key={item.place_id}
                  onPress={() => {
                    router.push({
                      pathname: `/(tabs)/(explore)/place-detail`,
                      params: { place_param: item.place_id },
                    });
                  }}
                  style={{
                    marginHorizontal: 10,
                    marginVertical: 10,
                    borderRadius: 10,
                    shadowRadius: 3,
                    shadowOpacity: 0.2,
                    shadowOffset: { width: 3, height: 3 },
                    backgroundColor: "white",
                    padding: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 16,
                    }}
                  >
                    <Avatar
                      avatarStyle={{ borderRadius: 10 }}
                      size={100}
                      source={{
                        uri: item.images[0],
                      }}
                    />
                    <View style={{ width: "60%" }}>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "500",
                        }}
                      >
                        {item.name}
                      </Text>
                      <Text
                        numberOfLines={3}
                        style={{
                          fontSize: 12,
                        }}
                      >
                        Địa chỉ: {item.address}
                      </Text>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "500",
                        }}
                      ></Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}

          <BottomSheetModal
            style={{
              zIndex: 99,
              borderCurve: 99,
              borderColor: "black",
              borderTopWidth: 5,
            }}
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}
          >
            <ScrollView>
              <View
                style={{
                  flex: 1,
                  justifyContent: "space-evenly",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    gap: 10,
                    flexDirection: "row",
                    width: width / 1.2,
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    rowGap: 10,
                    marginBottom: 20,
                  }}
                >
                  {tag.map((val, key) => (
                    <Chip
                      title={val}
                      key={key}
                      type={filterList.includes(val) ? "solid" : "outline"}
                      onPress={() => {
                        if (filterList.includes(val)) {
                          setFilterList((pre) =>
                            pre.filter((item) => item != val)
                          );
                        } else {
                          setFilterList((pre) => [...pre, val]);
                        }
                      }}
                    />
                  ))}
                </View>
                <Button
                  onPress={() => {
                    setFilterListRender(filterList);
                    bottomSheetModalRef.current?.close();
                  }}
                >
                  Apply
                </Button>
              </View>
            </ScrollView>
          </BottomSheetModal>
        </View>
      </BottomSheetModalProvider>
    </>
  );
};

export default ProvincePlaces;

const useStyles = makeStyles((theme) => ({
  screenContainer: {
    backgroundColor: theme.colors.background,
    flex: 1,
    paddingHorizontal: width / 23,
    paddingTop: 10,
  },
  categoryListViewWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  categoryContainer: {
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: theme.colors.brand.neutral[400],
  },
  categoryText: {
    fontSize: 12,
    color: theme.colors.brand.neutral[400],
  },
  listItemViewWrapper: {
    width: width,
    height: height / 5,
  },
}));

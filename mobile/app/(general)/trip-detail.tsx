import {
  Alert,
  Dimensions,
  Platform,
  Pressable,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Chip,
  Dialog,
  Divider,
  Image,
  SearchBar,
  Switch,
  Text,
  makeStyles,
  useTheme,
} from "@rneui/themed";
import { Avatar } from "@rneui/base";
import {
  NestableDraggableFlatList,
  NestableScrollContainer,
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import {
  IconCalendarTime,
  IconCircleMinus,
  IconClock,
  IconDoorExit,
  IconDotsVertical,
  IconExclamationCircle,
  IconPencil,
  IconPlus,
  IconPointFilled,
  IconStar,
  IconStarOff,
  IconTrash,
  IconTrashX,
  IconX,
} from "tabler-icons-react-native";
import { FlatList } from "react-native-gesture-handler";
import {
  ListFriends,
  LoadingScreen,
  StatusChip,
  SuccessAnimation,
  TextInput,
} from "../../components";
import { router, useLocalSearchParams } from "expo-router";
import {
  cancelRequestJoinTrip,
  createTripAPI,
  getTripDetail,
  leaveTrip,
  requestJoinTrip,
  scheduleTrip,
  updateTrip,
} from "../../api/trip";
import { AuthUser, useAuthStore, useRatingTripDetailStore } from "../../store";
import { dateString, returnFormattedDate } from "../../utils/regex";
import AnimatedLottieView from "lottie-react-native";
import { useFriendAndFollower, useFriends } from "../../api/user";
import { StarIcon } from "react-native-heroicons/solid";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "expo-router/src/useNavigation";
import { calculateCenter, useDebounce } from "../../utils/customHook";
import { useFocusEffect } from "expo-router/src/useFocusEffect";
import ReportModal from "../../components/ReportModal/ReportModal";

const { height, width } = Dimensions.get("window");
const profile_image = require("../../assets/images/profile-image.jpeg");
const default_image = require("../../assets/images/default-image.jpeg");

export type Place = {
  _id: string;
  name: string;
  place_id: string;
  address: string;
  images: string[];
  province: string;
  city: string;
  geolocation: {
    coordinates: [number, number];
    type: string;
  };
  tags: Array<{
    _id: string;
    name: string;
    places: string[];
  }>;
};

export type Trip = {
  _id: string;
  title: string;
  userId: AuthUser;
  startDate: string;
  endDate: string;
  status: string;
  vehicle: string;
  province: Array<string>;
  participates: Array<AuthUser>;
  participates_requested: Array<AuthUser>;
  places: Array<Place>;
  schedule: Array<Array<Place>>;
  isPublish: boolean;
  rated?: boolean;
  ratings: Array<{
    _id: string;
    userId: AuthUser;
    placeId: Place;
    rating: number;
    message: string;
  }>;
};

const TripDetail = () => {
  const { theme } = useTheme();
  const { authPayload } = useAuthStore();
  const { ratingTripDetail, setRatingTripDetail } = useRatingTripDetailStore();
  const styles = useStyles();
  const [trip, setTrip] = useState<Trip>();
  const [places, setPlaces] = useState<Array<Place>>([]);
  const [participates, setParticipates] = useState<Array<AuthUser>>([]);
  const [isPublish, setIsPublish] = useState<boolean>(false);
  const [modifier, setModifier] = useState<Array<string>>();
  const [title, setTitle] = useState<string>("");
  const [showFriends, setShowFriends] = useState(false);
  const [searchFriend, setSearchFriend] = useState("");
  const [friendsList, setFriendsList] = useState<Array<AuthUser>>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenScheduleModal, setIsOpenScheduleModal] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [startDatePickerShow, setStartDatePickerShow] = useState(false);
  const [endDate, setEndDate] = useState(new Date());
  const [endDatePickerShow, setEndDatePickerShow] = useState(false);
  const [openDial, setOpenDial] = useState(false);
  const [cancelTripDialog, setCancelTripDialog] = useState(false);
  const [deleteTripDialog, setDeleteTripDialog] = useState(false);
  const [reportTripDialog, setReportTripDialog] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [canModifierTitle, setCanModifierTitle] = useState(false);
  const [haveChange, setHaveChange] = useState(false);
  const [openNotVerifyModel, setOpenNotVerifyModel] = useState(false);
  const { data: friends } = useFriends(authPayload?.user._id);
  const [center, setCenter] = useState<[number, number]>([0, 0]);

  const debouncedSearchTerm = useDebounce(searchFriend, 500);

  useEffect(() => {
    if (friends) {
      setFriendsList(friends);
    }
  }, [friends]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      const result = friends.filter((fr: AuthUser) =>
        (fr.firstName.toLowerCase() + " " + fr.lastName.toLowerCase()).includes(
          debouncedSearchTerm.toLowerCase()
        )
      );
      setFriendsList(result);
    } else {
      setFriendsList(friends);
    }
  }, [debouncedSearchTerm, friends]);

  const navigation = useNavigation();
  useEffect(() => {
    if (!trip) return;
    if (!authPayload?.user._id) return;
    if (
      authPayload?.user._id !== trip?.userId._id &&
      !modifier?.includes(authPayload.user._id)
    )
      return;

    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => setOpenDial((pre) => !pre)}>
          <IconDotsVertical />
        </Pressable>
      ),
    });
  }, [navigation, trip, authPayload, modifier]);

  useEffect(() => {
    if (
      JSON.stringify(trip?.isPublish) !== JSON.stringify(isPublish) ||
      JSON.stringify(trip?.title) !== JSON.stringify(title) ||
      JSON.stringify(trip?.participates) !== JSON.stringify(participates)
    ) {
      setHaveChange(true);
      return;
    }

    if (trip?.status === "DRAFT") {
      if (JSON.stringify(trip?.places) !== JSON.stringify(places)) {
        setHaveChange(true);
        return;
      }
    } else {
      if (JSON.stringify(trip?.schedule) !== JSON.stringify(places)) {
        setHaveChange(true);
        return;
      }
    }
  }, [places, title, isPublish, participates]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchTripDetail = async () => {
        const res = await getTripDetail(tripId, authPayload?.user._id);

        if (res?.statusCode == 200) {
          if (res["metadata"].status === "DRAFT") {
            await setPlaces(res["metadata"].places);
          } else {
            const flatPlaces = res["metadata"].schedule.flatMap(
              (dayPlaces: Array<Place>, dayIndex: number) => {
                if (dayIndex === 0) {
                  return dayPlaces.map((place: Place) => {
                    return {
                      ...place,
                    };
                  });
                } else {
                  return [
                    dayIndex,
                    ...dayPlaces.map((place: Place) => {
                      return {
                        ...place,
                      };
                    }),
                  ];
                }
              }
            );

            await setPlaces(flatPlaces);
          }

          await setParticipates(res["metadata"].participates);
          await setModifier(
            res["metadata"].participates.map((item: AuthUser) => item._id)
          );
          await setTrip(res["metadata"]);
          await setIsPublish(res["metadata"].isPublish);
          await setTitle(res["metadata"].title);
          setRatingTripDetail({
            tripId: res["metadata"]._id,
            name: res["metadata"].title,
            places: res["metadata"].places,
          });
          setCenter(calculateCenter(res["metadata"].places));
        }

        setHaveChange(false);
        setIsLoading(false);
      };
      fetchTripDetail();
    }, [tripId, isLoading])
  );

  // useEffect(() => {
  //   const fetchTripDetail = async () => {
  //     const res = await getTripDetail(tripId, authPayload?.user._id);

  //     if (res?.statusCode == 200) {
  //       await setPlaces(res["metadata"].places);
  //       await setParticipates(res["metadata"].participates);
  //       await setModifier(
  //         res["metadata"].participates.map((item: AuthUser) => item._id)
  //       );
  //       await setTrip(res["metadata"]);
  //       await setIsPublish(res["metadata"].isPublish);
  //       await setTitle(res["metadata"].title);
  //       setRatingTripDetail({
  //         tripId: res["metadata"]._id,
  //         name: res["metadata"].title,
  //         places: res["metadata"].places
  //       })
  //     }
  //     setIsLoading(false);
  //   };
  //   if (isLoading) fetchTripDetail();
  // }, [tripId, isLoading]);

  const handleAddFriend = (user: AuthUser) => {
    let temp = participates.map((item) => item._id);
    if (!temp.includes(user._id)) setParticipates((pre) => [...pre, user]);
    setShowFriends(false);
  };
  const handleRemoveFriend = (user: AuthUser) => {
    const newParticipates = participates.filter((item) => item !== user);
    setParticipates(newParticipates);
  };

  const handleSave = async () => {
    const tempPlace = [0, ...places];
    let arrayIndex = -1;

    const schedule = tempPlace.reduce(
      (acc: Array<Array<Place>>, item, index) => {
        if (typeof item === "number") {
          acc.push([]);
          arrayIndex++;
        } else {
          acc[arrayIndex].push(item);
        }
        return acc;
      },
      []
    );

    const req =
      trip?.status === "DRAFT"
        ? {
            title: title,
            places: places.map((item) => item.place_id),
            isPublish: isPublish,
            participates: participates.map((item) => item._id),
          }
        : {
            title: title,
            places: places.map((item) => item.place_id).filter((item) => item),
            schedule: schedule.map((dayPlaces) =>
              dayPlaces.map((item) => item.place_id)
            ),
            isPublish: isPublish,
            participates: participates.map((item) => item._id),
          };
    console.log(req);

    await updateTrip(
      tripId,
      authPayload?.user._id!,
      authPayload?.tokens.accessToken!,
      req
    );
    setIsLoading(true);
  };

  const handleScheduleTrip = async () => {
    const req = {
      status: trip?.status === "ON-GOING" ? "ON-GOING" : "IN-COMING",
      startDate:
        trip?.status === "ON-GOING"
          ? new Date(trip?.startDate)
          : new Date(startDate.setHours(12, 0, 0, 0)),
      endDate: new Date(endDate.setHours(12, 0, 0, 0)),
    };

    await scheduleTrip(
      tripId,
      authPayload?.user._id!,
      authPayload?.tokens.accessToken!,
      req
    );

    setIsOpenScheduleModal(false);
    setIsLoading(true);
  };

  const handleCancelTrip = async () => {
    const req = {
      status: "DRAFT",
      startDate: null,
      endDate: null,
    };

    await updateTrip(
      tripId,
      authPayload?.user._id!,
      authPayload?.tokens.accessToken!,
      req
    );
    setCancelTripDialog(false);
    setOpenDial(false);
    setIsLoading(true);
  };

  const handleDeleteTrip = async () => {
    const req = {
      status: "DELETED",
    };

    await updateTrip(
      tripId,
      authPayload?.user._id!,
      authPayload?.tokens.accessToken!,
      req
    );
    router.back();
  };

  const handleAchiveTrip = async () => {
    const req = {
      userID: authPayload?.user._id,
      token: authPayload?.tokens.accessToken,
      title: trip?.title || "",
      places: trip?.places.map((item) => item.place_id),
      isPublish: false,
    };

    await createTripAPI(req);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
    }, 1100);
  };

  const handleSendRequestJoinTrip = async () => {
    if (!authPayload?.user.isValid) {
      setOpenNotVerifyModel(true);
      return;
    }
    await requestJoinTrip(
      authPayload?.tokens.accessToken!,
      authPayload?.user._id!,
      tripId
    );
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
    }, 1100);
    setIsLoading(true);
  };

  const handleCancelRequestJoinTrip = async () => {
    await cancelRequestJoinTrip(
      authPayload?.tokens.accessToken!,
      authPayload?.user._id!,
      tripId
    );
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
    }, 1100);
    setIsLoading(true);
  };

  const handleOutTrip = async () => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn rời hành trình này không?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Rời",
        style: "destructive",
        onPress: async () => {
          await leaveTrip(
            authPayload?.tokens.accessToken!,
            authPayload?.user._id!,
            tripId
          );
          router.back();
        },
      },
    ]);
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Place>) => {
    return (
      <ScaleDecorator>
        {typeof item === "number" ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: theme.colors.brand.primary[50],
              width: "100%",
              height: 40,
              marginVertical: 10,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: theme.colors.grey1,
                width: "100%",
                textAlign: "center",
              }}
            >
              Ngày {item + 1} -{" "}
              {new Date(
                new Date(trip?.startDate!).setDate(
                  new Date(trip?.startDate!).getDate() + item
                )
              ).toLocaleDateString()}
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            onLongPress={drag}
            disabled={
              authPayload?.user._id === trip?.userId ||
              (authPayload?.user._id &&
                modifier?.includes(authPayload?.user._id))
                ? false
                : true
            }
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 16,
              padding: 6,
            }}
          >
            <>
              <View style={styles.locationImageContainer}>
                <Image
                  style={styles.locationImage}
                  borderRadius={10}
                  source={{
                    uri: item.images[0],
                  }}
                />
              </View>
              <View style={styles.locationContent}>
                <View>
                  <Text numberOfLines={1} style={styles.locationTitle}>
                    {item.name}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{ fontSize: 13, color: theme.colors.grey2 }}
                  >
                    {item.address}
                  </Text>

                  <Text numberOfLines={2}>
                    {item.tags.map((item, index) => (
                      <Chip
                        key={index}
                        disabled
                        disabledStyle={{
                          backgroundColor: theme.colors.tag,
                          marginRight: 8,
                          marginTop: 5,
                        }}
                        disabledTitleStyle={{
                          color: "#012a4a",
                        }}
                        title={item.name}
                        buttonStyle={{
                          paddingHorizontal: 8,
                          paddingVertical: 3,
                        }}
                      />
                    ))}
                  </Text>
                </View>
              </View>

              {(authPayload?.user._id === trip?.userId._id ||
                (authPayload?.user._id &&
                  modifier?.includes(authPayload?.user._id))) &&
                trip?.status !== "FINISHED" && (
                  <Pressable
                    onPress={() =>
                      setPlaces((pre) => pre.filter((i) => i._id !== item._id))
                    }
                  >
                    <IconTrashX size={30} color={theme.colors.grey3} />
                  </Pressable>
                )}
            </>
          </TouchableOpacity>
        )}
      </ScaleDecorator>
    );
  };

  return (
    <>
      {isSuccess && (
        <SuccessAnimation
          isSuccess={isSuccess}
          onPress={() => setIsSuccess(false)}
          content="Thành công!"
          wrapperStyle={{ marginTop: -height / 6 }}
        />
      )}
      {isLoading ? (
        <View style={{ marginTop: -height / 8 }}>
          <LoadingScreen />
        </View>
      ) : !trip ? (
        <View style={styles.notFound}>
          <AnimatedLottieView
            source={require("../../assets/lotties/notfound_animation.json")}
            style={{
              width: "100%",
              height: 180,
            }}
            autoPlay
            loop
          />
          <Text style={styles.notFoundText}>Có lỗi xảy ra!</Text>
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            width: width,
            alignItems: "center",
            backgroundColor: "white",
          }}
        >
          {openDial && (
            <Pressable
              style={{
                width: width,
                height: height,
                position: "absolute",
                zIndex: 10,
                backgroundColor: "rgba(30,30,30,0.4)",
              }}
              onPress={() => setOpenDial(false)}
            >
              <View
                style={{
                  position: "absolute",
                  right: 8,
                  top: 4,
                  backgroundColor: "white",
                  borderRadius: 10,
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  shadowOpacity: 0.2,
                }}
              >
                <Text
                  style={{
                    width: "100%",
                    textAlign: "right",
                    fontSize: 16,
                    fontWeight: "600",
                    paddingVertical: 4,
                  }}
                >
                  Danh mục
                </Text>
                <Divider />
                {trip.status === "IN-COMING" &&
                  authPayload?.user._id === trip?.userId._id && (
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                        paddingVertical: 6,
                      }}
                      onPress={() => setCancelTripDialog(true)}
                    >
                      <IconX size={24} />
                      <Text style={{ fontSize: 16 }}>Huỷ hành trình</Text>
                    </TouchableOpacity>
                  )}
                {authPayload?.user._id === trip?.userId._id && (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                      paddingVertical: 6,
                    }}
                    onPress={() => setDeleteTripDialog(true)}
                  >
                    <IconTrash size={24} />
                    <Text style={{ fontSize: 16 }}>Xoá hành trình</Text>
                  </TouchableOpacity>
                )}
                {authPayload?.user._id !== trip?.userId._id && (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                      paddingVertical: 6,
                    }}
                    onPress={() => setReportTripDialog(true)}
                  >
                    <IconExclamationCircle size={24} />
                    <Text style={{ fontSize: 16 }}>Báo cáo</Text>
                  </TouchableOpacity>
                )}
              </View>
            </Pressable>
          )}
          {isOpenScheduleModal && (
            <Pressable
              style={{
                width: width,
                height: "100%",
                zIndex: 10,
                position: "absolute",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Pressable
                style={{
                  width: width,
                  height: "100%",
                  position: "absolute",
                  zIndex: 0,
                  backgroundColor: "rgba(30,30,30,0.4)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => setIsOpenScheduleModal(false)}
              ></Pressable>
              <View
                style={{
                  backgroundColor: "white",
                  width: (width * 6) / 7,
                  padding: 20,
                  paddingVertical: 25,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 8,
                  gap: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "600",
                    color: theme.colors.brand.primary[600],
                    alignSelf: "center",
                  }}
                >
                  Đặt lịch cho hành trình
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ fontSize: 16, fontWeight: "500" }}>
                    Ngày khởi hành:
                  </Text>
                  {Platform.OS === "ios" ? (
                    <DateTimePicker
                      disabled={trip?.status === "ON-GOING"}
                      value={
                        trip?.status === "ON-GOING"
                          ? new Date(trip?.startDate)
                          : startDate
                      }
                      mode={"date"}
                      minimumDate={new Date()}
                      onChange={(event, selectedDate) => {
                        if (selectedDate) {
                          setStartDate(selectedDate);
                          if (endDate < selectedDate) setEndDate(selectedDate);
                        }
                      }}
                      key={startDate.getTime().toString()}
                    />
                  ) : (
                    <View>
                      {startDatePickerShow && (
                        <DateTimePicker
                          value={startDate}
                          mode={"date"}
                          minimumDate={new Date()}
                          onChange={(event, selectedDate) => {
                            if (selectedDate) {
                              setStartDate(selectedDate);
                              if (endDate < selectedDate)
                                setEndDate(selectedDate);
                            }
                            setStartDatePickerShow(!startDatePickerShow);
                          }}
                          key={startDate.getTime().toString()}
                        />
                      )}

                      <Button
                        disabled={trip?.status === "ON-GOING"}
                        onPress={() => setStartDatePickerShow(true)}
                        radius={10}
                        buttonStyle={{
                          paddingHorizontal: 15,
                          paddingVertical: 6,
                          gap: 6,
                        }}
                        title={
                          trip?.status === "ON-GOING"
                            ? returnFormattedDate(trip?.startDate)
                            : startDate
                            ? returnFormattedDate(startDate.toString())
                            : "Chọn ngày"
                        }
                        titleStyle={{
                          fontSize: 17,
                          fontWeight: "500",
                        }}
                      />
                    </View>
                  )}
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ fontSize: 16, fontWeight: "500" }}>
                    Ngày kết thúc:
                  </Text>
                  {Platform.OS === "ios" ? (
                    <DateTimePicker
                      value={endDate}
                      mode={"date"}
                      minimumDate={startDate}
                      maximumDate={
                        new Date(
                          new Date(startDate).setDate(startDate.getDate() + 30)
                        )
                      }
                      onChange={(event, selectedDate) => {
                        if (selectedDate) setEndDate(selectedDate);
                      }}
                      key={endDate.getTime().toString()}
                    />
                  ) : (
                    <View>
                      {endDatePickerShow && (
                        <DateTimePicker
                          value={endDate}
                          mode={"date"}
                          minimumDate={startDate}
                          maximumDate={
                            new Date(
                              new Date(startDate).setDate(
                                startDate.getDate() + 30
                              )
                            )
                          }
                          onChange={(event, selectedDate) => {
                            if (selectedDate) setEndDate(selectedDate);
                            setEndDatePickerShow(!endDatePickerShow);
                          }}
                          key={endDate.getTime().toString()}
                        />
                      )}

                      <Button
                        onPress={() => setEndDatePickerShow(true)}
                        radius={10}
                        buttonStyle={{
                          paddingHorizontal: 15,
                          paddingVertical: 6,
                          gap: 6,
                        }}
                        title={
                          endDate
                            ? returnFormattedDate(endDate.toString())
                            : "Chọn ngày"
                        }
                        titleStyle={{
                          fontSize: 17,
                          fontWeight: "500",
                        }}
                      />
                    </View>
                  )}
                </View>
                {haveChange && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <IconExclamationCircle
                      color={theme.colors.brand.yellow[800]}
                      size={20}
                    />
                    <Text
                      style={{
                        color: theme.colors.brand.yellow[800],
                      }}
                    >
                      Bạn chưa lưu thay đổi
                    </Text>
                  </View>
                )}
                <Button
                  onPress={() => handleScheduleTrip()}
                  radius={10}
                  buttonStyle={{
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    gap: 6,
                  }}
                  title="Đặt lịch"
                  icon={<IconClock color="white" />}
                  titleStyle={{
                    fontSize: 17,
                    fontWeight: "500",
                  }}
                />
              </View>
            </Pressable>
          )}
          {showFriends && (
            <Pressable
              style={styles.friendListBackground}
              onPress={() => setShowFriends(false)}
            >
              <View style={styles.friendListContainer}>
                <SearchBar
                  onChangeText={(text) => setSearchFriend(text)}
                  value={searchFriend}
                  placeholder="Tìm kiếm bạn bè"
                  platform="android"
                  containerStyle={{
                    justifyContent: "center",
                    borderWidth: 0.5,
                    borderColor: theme.colors.grey4,
                    borderRadius: 20,
                    marginHorizontal: width / 30,
                    height: height / 16,
                    marginTop: 10,
                  }}
                />
                <ListFriends
                  onPress={(e) => handleAddFriend(e)}
                  friends={friendsList.filter(
                    (fr) =>
                      !participates.map((item) => item._id).includes(fr._id)
                  )}
                />
              </View>
            </Pressable>
          )}
          <NestableScrollContainer showsVerticalScrollIndicator={false}>
            <View
              style={{
                paddingBottom: height / 9,
              }}
            >
              <View style={{ paddingVertical: 16 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                    paddingHorizontal: width / 18,
                  }}
                >
                  <Pressable
                    onPress={() =>
                      authPayload?.user._id === trip.userId._id
                        ? router.push(`/(tabs)/(profile)/profile`)
                        : router.push({
                            pathname: `/(general)/user-profile`,
                            params: { userId: trip.userId._id },
                          })
                    }
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <Avatar
                      size={46}
                      rounded
                      source={
                        trip?.userId.avatarUrl
                          ? { uri: trip?.userId.avatarUrl }
                          : profile_image
                      }
                    />
                    <Text style={{ fontSize: 16, fontWeight: "600" }}>
                      {trip.userId.firstName} {trip.userId.lastName}
                    </Text>
                  </Pressable>
                  <StatusChip trip={trip} />
                </View>
                <View
                  style={{
                    flexDirection: "column",
                    paddingHorizontal: width / 16,
                    marginTop: 10,
                    gap: 8,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 3,
                      width: (width * 5) / 6,
                    }}
                  >
                    {!canModifierTitle ? (
                      <Text style={{ fontWeight: "500", fontSize: 19 }}>
                        {title}
                      </Text>
                    ) : (
                      <View style={{ width: "100%" }}>
                        <TextInput
                          value={title}
                          onChangeText={(text) => setTitle(text)}
                          containerStyle={{
                            height: 46,
                          }}
                        />
                      </View>
                    )}
                    {authPayload?.user._id === trip.userId._id && (
                      <Pressable
                        onPress={() => setCanModifierTitle((pre) => !pre)}
                      >
                        <IconPencil size={18} />
                      </Pressable>
                    )}
                  </View>
                  {authPayload?.user._id === trip.userId._id && (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Switch
                        disabled={
                          (authPayload?.user._id !== trip.userId._id &&
                            !modifier?.includes(authPayload?.user._id!)) ||
                          trip.status === "FINISHED" ||
                          !authPayload?.user.isValid
                        }
                        style={{
                          transform: [
                            { scaleX: 0.8 },
                            { scaleY: 0.8 },
                            { translateX: -10 },
                          ],
                        }}
                        value={isPublish}
                        onValueChange={(value) => setIsPublish(value)}
                      />
                      <View>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "500",
                            color: isPublish
                              ? theme.colors.brand.primary[700]
                              : theme.colors.grey3,
                          }}
                        >
                          Tìm kiếm người lạ đi chung?
                        </Text>
                        {!authPayload?.user.isValid && (
                          <Text
                            style={{
                              fontSize: 11,
                              fontWeight: "500",
                              color: theme.colors.brand.red[300],
                            }}
                          >
                            *Xác thực tài khoản để sử dụng tính năng này
                          </Text>
                        )}
                      </View>
                    </View>
                  )}
                  <Text style={{ color: theme.colors.grey2 }}>
                    Khởi hành: {trip.startDate && dateString(trip.startDate)}
                  </Text>
                  <Text style={{ color: theme.colors.grey2 }}>
                    Kết thúc: {trip.endDate && dateString(trip.endDate)}
                  </Text>
                </View>

                {(authPayload?.user._id === trip?.userId._id ||
                  (authPayload?.user._id &&
                    modifier?.includes(authPayload?.user._id))) &&
                  trip?.status === "FINISHED" && (
                    <View
                      style={{ position: "absolute", right: 20, bottom: 16 }}
                    >
                      <Button
                        radius={10}
                        buttonStyle={{
                          paddingHorizontal: 15,
                          paddingVertical: 10,
                          gap: 4,
                        }}
                        onPress={() => router.push("/(general)/rate-trip")}
                        disabled={trip.rated}
                        title={trip.rated ? "Đã đánh giá" : "Đánh giá"}
                        icon={
                          trip.rated ? (
                            <IconStarOff size={20} color={theme.colors.grey4} />
                          ) : (
                            <IconStar size={20} color={theme.colors.white} />
                          )
                        }
                        titleStyle={{
                          fontSize: 17,
                          fontWeight: "500",
                        }}
                      />
                    </View>
                  )}
              </View>
              <View style={{ width: width, alignItems: "center" }}>
                <ButtonGroup
                  containerStyle={styles.buttonContainer}
                  textStyle={styles.buttonTextStyle}
                  innerBorderStyle={{ width: 0 }}
                  buttonStyle={{ borderRadius: 20 }}
                  buttons={["Hành trình", "Thành viên", "Đánh giá"]}
                  selectedIndex={selectedIndex}
                  onPress={(value) => {
                    setSelectedIndex(value);
                  }}
                />
              </View>
              {selectedIndex == 0 && (
                <View style={{ marginHorizontal: width / 18 }}>
                  <View style={styles.sectionContainer}>
                    <View>
                      {(authPayload?.user._id === trip?.userId._id ||
                        (authPayload?.user._id &&
                          modifier?.includes(authPayload?.user._id))) &&
                        trip?.status !== "FINISHED" && (
                          <Button
                            type="outline"
                            radius={10}
                            buttonStyle={{
                              paddingVertical: 6,
                              borderWidth: 1,
                              borderColor: theme.colors.brand.primary[400],
                            }}
                            icon={
                              <IconPlus
                                color={theme.colors.brand.primary[600]}
                              />
                            }
                            onPress={() =>
                              router.push({
                                pathname: "/(general)/places-suggestion",
                                params: {
                                  tripId: tripId,
                                  longitude: center[0],
                                  latitude: center[1],
                                },
                              })
                            }
                          />
                        )}
                    </View>
                    {trip.startDate && (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          backgroundColor: theme.colors.brand.primary[50],
                          width: "100%",
                          height: 40,
                          marginVertical: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "600",
                            color: theme.colors.grey1,
                            width: "100%",
                            textAlign: "center",
                          }}
                        >
                          Ngày 1 -{" "}
                          {new Date(
                            new Date(trip?.startDate).setDate(
                              new Date(trip?.startDate).getDate()
                            )
                          ).toLocaleDateString()}
                        </Text>
                      </View>
                    )}
                    <NestableDraggableFlatList
                      data={places}
                      renderItem={renderItem}
                      keyExtractor={(item) =>
                        typeof item === "number" ? item : item._id
                      }
                      onDragEnd={({ data }) => setPlaces(data)}
                    />
                  </View>
                  <Divider />
                </View>
              )}
              {selectedIndex == 1 && (
                <FlatList
                  contentContainerStyle={styles.sectionContainer}
                  scrollEnabled={false}
                  data={participates}
                  ListFooterComponentStyle={styles.addButton}
                  ListFooterComponent={
                    <View style={{ marginTop: 6 }}>
                      {(authPayload?.user._id === trip?.userId._id ||
                        (authPayload?.user._id &&
                          modifier?.includes(authPayload?.user._id))) &&
                        trip?.status !== "FINISHED" &&
                        participates.length < 7 && (
                          <TouchableOpacity
                            style={{
                              alignItems: "center",
                              gap: 4,
                            }}
                            onPress={() => setShowFriends(true)}
                          >
                            <IconPlus
                              size={36}
                              color={theme.colors.brand.primary[600]}
                            />
                            <Text
                              style={{
                                color: theme.colors.brand.primary[600],
                                fontSize: 15,
                              }}
                            >
                              Mời bạn bè tham gia
                            </Text>
                          </TouchableOpacity>
                        )}
                    </View>
                  }
                  renderItem={({ item }) => (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingHorizontal: width / 10,
                        padding: 6,
                      }}
                    >
                      <Pressable
                        onPress={() =>
                          item._id === authPayload?.user._id
                            ? router.push(`/(tabs)/(profile)/profile`)
                            : router.push({
                                pathname: `/(general)/user-profile`,
                                params: { userId: item._id },
                              })
                        }
                        style={styles.friendCardContainer}
                      >
                        <Avatar
                          size={55}
                          rounded
                          source={{
                            uri: item.avatarUrl,
                          }}
                        />
                        <View style={{ gap: 4 }}>
                          <Text style={{ fontSize: 15, fontWeight: "600" }}>
                            {item.firstName} {item.lastName}
                          </Text>
                          <Text
                            style={{
                              fontSize: 15,
                              fontWeight: "400",
                              color: theme.colors.grey2,
                            }}
                          >
                            {item.phone}
                          </Text>
                        </View>
                      </Pressable>

                      {(authPayload?.user._id === trip?.userId._id ||
                        (authPayload?.user._id &&
                          modifier?.includes(authPayload?.user._id))) &&
                        authPayload.user._id !== item._id &&
                        trip.userId._id !== item._id &&
                        trip?.status !== "FINISHED" && (
                          <Pressable onPress={() => handleRemoveFriend(item)}>
                            <IconCircleMinus
                              size={36}
                              color={theme.colors.grey3}
                            />
                          </Pressable>
                        )}

                      {authPayload?.user._id &&
                        modifier?.includes(authPayload?.user._id) &&
                        authPayload.user._id === item._id &&
                        trip.userId._id !== item._id &&
                        trip?.status !== "FINISHED" && (
                          <Pressable onPress={() => handleOutTrip()}>
                            <IconDoorExit
                              size={32}
                              color={theme.colors.brand.red[500]}
                            />
                          </Pressable>
                        )}
                    </View>
                  )}
                />
              )}
              {selectedIndex == 2 &&
                (trip.ratings.length > 0 ? (
                  <FlatList
                    contentContainerStyle={styles.sectionContainer}
                    scrollEnabled={false}
                    data={trip.ratings}
                    renderItem={({ item }) => (
                      <View key={item._id} style={{ paddingHorizontal: 22 }}>
                        <View
                          style={{ paddingVertical: 16, paddingHorizontal: 6 }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              gap: 8,
                              alignItems: "center",
                            }}
                          >
                            <Avatar
                              rounded
                              source={{ uri: item.userId.avatarUrl }}
                              size={50}
                            />
                            <View style={{ flexDirection: "column", gap: 2 }}>
                              <Text style={{ fontSize: 16, fontWeight: "500" }}>
                                {item.userId.firstName} {item.userId.lastName}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 12,
                                  color: theme.colors.grey2,
                                  maxWidth: (width * 4) / 7,
                                }}
                              >
                                {item.placeId.name}
                              </Text>
                            </View>
                          </View>
                          <View
                            style={{
                              position: "absolute",
                              flexDirection: "row",
                              right: 0,
                              top: 16,
                              gap: 8,
                            }}
                          >
                            <View
                              style={{
                                width: width / 7,
                                aspectRatio: 1,
                              }}
                            >
                              <Image
                                style={styles.locationImage}
                                borderRadius={5}
                                source={
                                  item.placeId.images.length > 0
                                    ? { uri: item.placeId.images[0] }
                                    : default_image
                                }
                              />
                            </View>
                          </View>
                          <View style={{ gap: 8, marginTop: 10 }}>
                            <View style={{ flexDirection: "row" }}>
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
                            <Text
                              style={{ fontSize: 16, paddingHorizontal: 2 }}
                            >
                              {item.message}
                            </Text>
                          </View>
                        </View>
                        <Divider />
                      </View>
                    )}
                  />
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
                      Chưa có đánh giá nào!
                    </Text>
                  </View>
                ))}
            </View>
          </NestableScrollContainer>
          <View
            style={{
              bottom: 0,
              height: height / 10,
              backgroundColor: "white",
              width: width,
              paddingHorizontal: width / 15,
              paddingTop: 16,
              position: "absolute",
              shadowOpacity: 0.2,
            }}
          >
            {authPayload?.user._id === trip?.userId._id ||
            (authPayload?.user._id &&
              modifier?.includes(authPayload?.user._id)) ? (
              <Button
                containerStyle={{}}
                titleStyle={{
                  fontWeight: "500",
                  fontSize: 16,
                }}
                disabled={!haveChange}
                color={theme.colors.brand.primary[600]}
                title="Lưu thay đổi"
                radius={99}
                onPress={() => handleSave()}
              />
            ) : authPayload?.user._id ? (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                {trip?.status === "IN-COMING" ? (
                  <>
                    <Button
                      containerStyle={{ width: "48%" }}
                      titleStyle={{
                        fontWeight: "500",
                        fontSize: 16,
                      }}
                      color={theme.colors.brand.primary[600]}
                      title="Lưu hành trình"
                      radius={99}
                      type="outline"
                      onPress={() => handleAchiveTrip()}
                    />
                    {trip.participates_requested
                      .map((item) => item._id)
                      .includes(authPayload?.user._id) ? (
                      <Button
                        containerStyle={{ width: "48%" }}
                        titleStyle={{
                          fontWeight: "500",
                          fontSize: 16,
                        }}
                        color={theme.colors.brand.red[600]}
                        title="Huỷ yêu cầu"
                        radius={99}
                        onPress={() => handleCancelRequestJoinTrip()}
                      />
                    ) : (
                      <Button
                        containerStyle={{ width: "48%" }}
                        titleStyle={{
                          fontWeight: "500",
                          fontSize: 16,
                        }}
                        color={theme.colors.brand.primary[600]}
                        title="Đăng kí tham gia"
                        radius={99}
                        onPress={() => handleSendRequestJoinTrip()}
                      />
                    )}
                  </>
                ) : (
                  <Button
                    containerStyle={{ width: "100%" }}
                    titleStyle={{
                      fontWeight: "500",
                      fontSize: 16,
                    }}
                    color={theme.colors.brand.primary[600]}
                    title="Lưu hành trình"
                    radius={99}
                    onPress={() => handleAchiveTrip()}
                  />
                )}
              </View>
            ) : (
              <Button
                titleStyle={{
                  fontWeight: "500",
                  fontSize: 16,
                }}
                color={theme.colors.brand.primary[600]}
                title="Đăng nhập"
                radius={99}
                onPress={() => router.push("/(auth)/sign-in")}
              />
            )}
          </View>
          <View
            style={{
              position: "absolute",
              bottom: height / 9 + 4,
              right: width / 20,
              flexDirection: "column",
              gap: 10,
            }}
          >
            {(authPayload?.user._id === trip?.userId._id ||
              (authPayload?.user._id &&
                modifier?.includes(authPayload?.user._id))) &&
              trip.status !== "FINISHED" && (
                <Button
                  onPress={() => setIsOpenScheduleModal(true)}
                  buttonStyle={{
                    paddingHorizontal: 20,
                    width: width / 7,
                    aspectRatio: 1,
                    borderWidth: 1,
                  }}
                  icon={<IconCalendarTime color="white" size={30} />}
                  radius={99}
                />
              )}
          </View>
          <Dialog
            isVisible={cancelTripDialog}
            onBackdropPress={() => setCancelTripDialog(false)}
          >
            <Dialog.Title
              titleStyle={{
                color: theme.colors.brand.yellow[800],
                fontSize: 22,
                paddingHorizontal: 8,
              }}
              title="HUỶ HÀNH TRÌNH"
            />
            <View
              style={{
                flexDirection: "column",
                gap: 4,
                paddingHorizontal: 16,
                paddingVertical: 10,
                backgroundColor: theme.colors.grey5,
                borderRadius: 8,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  width: "90%",
                }}
              >
                <IconPointFilled
                  size={20}
                  color={theme.colors.brand.yellow[800]}
                />
                <Text>Trạng thái trở về "BẢN NHÁP"</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  width: "90%",
                }}
              >
                <IconPointFilled
                  size={20}
                  color={theme.colors.brand.yellow[800]}
                />
                <Text>Xoá ngày bắt đầu và ngày kết thúc của hành trình</Text>
              </View>
            </View>
            <Text
              style={{
                color: theme.colors.grey1,
                padding: 8,
                paddingBottom: 0,
                fontSize: 15,
              }}
            >
              Bạn có chắc chắn muốn huỷ hành trình này?
            </Text>
            <Dialog.Actions>
              <Dialog.Button
                title="Xác nhận"
                onPress={() => handleCancelTrip()}
              />
              <Dialog.Button
                title="Huỷ bỏ"
                titleStyle={{ color: theme.colors.grey2 }}
                onPress={() => setCancelTripDialog(false)}
              />
            </Dialog.Actions>
          </Dialog>
          {reportTripDialog && (
            <ReportModal
              tripId={trip._id}
              reportTripDialog={reportTripDialog}
              setReportTripDialog={setReportTripDialog}
            />
          )}
          <Dialog
            isVisible={deleteTripDialog}
            onBackdropPress={() => setDeleteTripDialog(false)}
          >
            <Dialog.Title
              titleStyle={{
                color: theme.colors.brand.red[600],
                fontSize: 22,
                paddingHorizontal: 8,
              }}
              title="XOÁ HÀNH TRÌNH"
            />
            <View
              style={{
                flexDirection: "column",
                gap: 4,
                paddingHorizontal: 16,
                paddingVertical: 10,
                backgroundColor: theme.colors.grey5,
                borderRadius: 8,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  width: "95%",
                }}
              >
                <IconPointFilled
                  size={20}
                  color={theme.colors.brand.red[500]}
                />
                <Text>Xoá hoàn toàn hành trình khỏi danh sách của bạn</Text>
              </View>
            </View>
            <Text
              style={{
                color: theme.colors.grey1,
                padding: 8,
                paddingBottom: 0,
                fontSize: 15,
              }}
            >
              Bạn có chắc chắn muốn xoá hành trình này?
            </Text>
            <Dialog.Actions>
              <Dialog.Button
                title="Xác nhận"
                onPress={() => handleDeleteTrip()}
              />
              <Dialog.Button
                title="Huỷ bỏ"
                titleStyle={{ color: theme.colors.grey2 }}
                onPress={() => setDeleteTripDialog(false)}
              />
            </Dialog.Actions>
          </Dialog>
          <Dialog
            isVisible={openNotVerifyModel}
            onBackdropPress={() => setOpenNotVerifyModel(false)}
          >
            <View
              style={{
                flexDirection: "column",
                gap: 4,
                paddingHorizontal: 16,
                paddingVertical: 20,
                backgroundColor: theme.colors.grey5,
                borderRadius: 8,
              }}
            >
              <Dialog.Title
                title="TÀI KHOẢN CHƯA XÁC THỰC"
                titleStyle={{ color: theme.colors.brand.primary[700] }}
              />

              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <Text>
                  Vui lòng vào trang cá nhân và xác thực tài khoản để sử dụng
                  tính năng này!
                </Text>
              </View>
            </View>

            <Dialog.Actions>
              <Dialog.Button
                titleStyle={{ fontSize: 17 }}
                title="Xác thực"
                onPress={() => {
                  router.push("/(tabs)/(profile)/account-menu"),
                    router.push("/(tabs)/(profile)/profile");
                }}
              />
              <Dialog.Button
                titleStyle={{ fontSize: 17 }}
                title="Huỷ bỏ"
                onPress={() => setOpenNotVerifyModel(false)}
              />
            </Dialog.Actions>
          </Dialog>
        </View>
      )}
    </>
  );
};

export default TripDetail;

const useStyles = makeStyles((theme) => ({
  locationImageContainer: {
    width: width / 4.5,
    aspectRatio: 1,
  },
  locationImage: {
    width: "100%",
    height: "100%",
  },
  locationContent: {
    gap: 2,
    width: width / 2,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  locationPlace: {
    fontSize: 12,
    opacity: 0.6,
  },
  sectionContainer: {
    paddingVertical: 5,
    borderRadius: 10,
    marginVertical: 5,
    paddingBottom: 26,
  },
  friendCardContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  addButton: {
    alignItems: "center",
    padding: 6,
  },
  friendListContainer: {
    borderRadius: 10,
    backgroundColor: "white",
    height: height / 1.6,
    width: (width * 8) / 9,
    marginBottom: height / 6,
    padding: 10,
  },
  friendListBackground: {
    position: "absolute",
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
    width: width,
    height: height,
    backgroundColor: "rgba(52, 52, 52, 0.5)",
  },
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
    marginTop: -height / 8,
    justifyContent: "center",
    height: height,
  },
  notFoundText: {
    fontSize: 22,
    fontWeight: "600",
    color: theme.colors.grey3,
  },
}));

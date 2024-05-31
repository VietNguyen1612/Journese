import React, { FC, useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Image,
  ListItem,
  SearchBar,
  Switch,
  Text,
  makeStyles,
  useTheme,
} from "@rneui/themed";
import {
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ListCardTrips,
  ListFriends,
  SuccessAnimation,
  TextInput,
} from "../../../components";
import { router } from "expo-router";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  IconCircleMinus,
  IconPointFilled,
  IconSquareRoundedPlus,
  IconTemplate,
  IconUserPlus,
} from "tabler-icons-react-native";
import { ScrollView } from "react-native-gesture-handler";
import { AuthUser, useAuthStore } from "../../../store";
import BackToPreviousPageButton from "../../../components/BackToPreviousPageButton/BackToPreviousPageButton";
import { createTripAPI } from "../../../api/trip";
import { Place } from "../../(general)/trip-detail";
import { useFriendAndFollower } from "../../../api/user";
import { useDebounce } from "../../../utils/customHook";
const tablet = Dimensions.get("window").width > 640 ? true : false;
const { width, height } = Dimensions.get("screen");
const default_image = require("../../../assets/images/default-image.jpeg");
const profile_image = require("../../../assets/images/profile-image.jpeg");

const CreateTrip: FC = () => {
  const { theme } = useTheme();
  const { authPayload } = useAuthStore();
  const [expanded, setExpanded] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const styles = useStyles();
  const [participates, setParticipates] = useState<AuthUser[]>([]);
  const [places, setPlaces] = useState<Array<Place>>([]);
  const [showFriends, setShowFriends] = useState(false);
  const [showTripTemplate, setShowTripTemplate] = useState(false);
  const [searchFriend, setSearchFriend] = useState("");
  const [friendsList, setFriendsList] = useState<Array<AuthUser>>([]);
  const [isPublish, setIsPublish] = useState<boolean>(false);

  const debouncedSearchTerm = useDebounce(searchFriend, 500);

  const { data: friends } = useFriendAndFollower(
    authPayload?.user._id,
    authPayload?.tokens.accessToken
  );

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
    }
  }, [debouncedSearchTerm, friends]);

  const handleAddFriend = (user: AuthUser) => {
    if (Object.keys(user).length === 0) return;
    if (!participates.includes(user)) setParticipates((pre) => [...pre, user]);
    setShowFriends(false);
  };

  const handleRemoveFriend = (user: AuthUser) => {
    const newParticipates = participates.filter(
      (item) => item._id !== user._id
    );
    setParticipates(newParticipates);
  };

  return (
    <>
      {showFriends && (
        <View style={styles.friendListBackground}>
          <Pressable
            style={{
              position: "absolute",
              justifyContent: "center",
              alignItems: "center",
              width: width,
              height: height,
              backgroundColor: "rgba(52, 52, 52, 0.5)",
            }}
            onPress={() => setShowFriends(false)}
          ></Pressable>
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
              friends={friendsList}
            />
          </View>
        </View>
      )}
      {showTripTemplate && (
        <View style={styles.TripTemplateListBackground}>
          <BackToPreviousPageButton
            color="black"
            size={40}
            style={{
              top: height / 13,
              left: 10,
            }}
            onPress={() => setShowTripTemplate(false)}
          />

          <View style={styles.TripTemplateListContainer}>
            <View
              style={{
                height: height / 7,
                paddingTop: height / 12,
              }}
            >
              <Text
                style={{
                  color: theme.colors.brand.primary[600],
                  fontSize: 26,
                  fontWeight: "600",
                  alignSelf: "center",
                }}
              >
                Mẫu hành trình
              </Text>
            </View>
            <View
              style={{
                height: (height * 19) / 24,
                paddingHorizontal: 15,
                marginBottom: height / 13,
                width: width,
              }}
            >
              {/* <ListTrips onPress={handleChooseTrip} /> */}
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ paddingBottom: height / 25 }}>
                  <ListCardTrips
                    scrollEnabled={false}
                    userTrip={true}
                    status="ALL"
                    onPress={(e) => {
                      setPlaces(e.places);
                      setShowTripTemplate(false);
                    }}
                  />
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      )}
      {/* {isLoading ? (
        <Loading size="50%" />
      ) : ( */}
      <Formik
        initialValues={{ title: "" }}
        onSubmit={async (values) => {
          const request = {
            token: authPayload?.tokens.accessToken,
            userID: authPayload?.user._id,
            title: values.title,
            places: places.map((i) => i.place_id),
            isPublish: isPublish,
            participates: participates.map((i) => i._id),
          };

          const response = await createTripAPI(request);
          if (response?.statusCode !== 201) {
            // setIsLoading(false);
            // setIsFail(true);
            return;
          }
          setIsSubmit(true);
        }}
        validationSchema={Yup.object().shape({
          title: Yup.string().required("*Bắt buộc"),
        })}
      >
        {({ handleChange, handleBlur, handleSubmit, errors }) => (
          <View style={styles.page}>
            <BackToPreviousPageButton
              color="black"
              size={36}
              style={{
                top: height / 16,
                left: 5,
              }}
            />
            <Modal transparent={true} visible={isSubmit}>
              <SuccessAnimation
                isSuccess={isSubmit}
                onPress={() => router.back()}
                content="Tạo thành công"
              />
            </Modal>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ paddingTop: 60 }}>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>Tạo hành trình</Text>
                </View>
                <View style={styles.inputFieldContainer}>
                  <TextInput
                    placeholder="Hành trình..."
                    label="Tên hành trình"
                    onChangeText={handleChange("title")}
                    errorMessage={errors.title}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      alignItems: "center",
                    }}
                  >
                    <Switch
                      disabled={!authPayload?.user.isValid}
                      value={isPublish}
                      onValueChange={(value) => setIsPublish(value)}
                    />
                    <View>
                      <Text
                        style={{
                          fontSize: 16,
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
                </View>
                <View style={styles.addFriendContainer}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <Text style={styles.buttonTitle}>Thêm bạn bè</Text>
                  </View>
                  <FlatList
                    contentContainerStyle={styles.friendFlatList}
                    scrollEnabled={false}
                    data={participates}
                    ListHeaderComponentStyle={styles.addButton}
                    ListHeaderComponent={
                      <TouchableOpacity onPress={() => setShowFriends(true)}>
                        <IconUserPlus
                          size={42}
                          color={theme.colors.brand.primary[700]}
                        />
                      </TouchableOpacity>
                    }
                    renderItem={({ item }) => (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          paddingVertical: 8,
                        }}
                      >
                        <View style={styles.friendCardContainer}>
                          <Avatar
                            size={52}
                            rounded
                            source={
                              item?.avatarUrl
                                ? { uri: item?.avatarUrl }
                                : profile_image
                            }
                          />
                          <Text style={{ fontSize: 18, fontWeight: "500" }}>
                            {item.firstName} {item.lastName}
                          </Text>
                        </View>

                        <Pressable onPress={() => handleRemoveFriend(item)}>
                          <IconCircleMinus
                            size={36}
                            color={theme.colors.brand.red[500]}
                          />
                        </Pressable>
                      </View>
                    )}
                  />
                </View>
                {places && places.length > 0 && (
                  <View>
                    <Text style={styles.buttonTitle}>Các địa điểm</Text>
                    <View style={styles.placeContainer}>
                      <ListItem.Accordion
                        content={
                          <ListItem.Content>
                            <View style={styles.locationInfor}>
                              <View style={styles.locationImageContainer}>
                                <Image
                                  style={styles.locationImage}
                                  borderRadius={5}
                                  source={
                                    places[0].images.length > 0
                                      ? { uri: places[0].images[0] }
                                      : default_image
                                  }
                                />
                              </View>
                              <Text style={styles.locationTitle}>
                                Danh sách
                              </Text>
                            </View>
                          </ListItem.Content>
                        }
                        isExpanded={expanded}
                        onPress={() => {
                          setExpanded(!expanded);
                        }}
                      >
                        <FlatList
                          contentContainerStyle={styles.locationContainer}
                          scrollEnabled={false}
                          data={places}
                          renderItem={({ item, index }) => (
                            <Pressable style={styles.locationInfor}>
                              {index !== 0 && (
                                <View
                                  style={styles.locationConectionLineContainer}
                                >
                                  <Text style={styles.locationConectionLine}>
                                    - - -
                                  </Text>
                                </View>
                              )}
                              <View style={styles.scale}>
                                <IconPointFilled
                                  size={20}
                                  color={theme.colors?.brand?.primary?.[500]}
                                />
                              </View>
                              <View style={styles.locationImageContainer}>
                                <Image
                                  style={styles.locationImage}
                                  borderRadius={5}
                                  source={
                                    item.images.length > 0
                                      ? { uri: item.images[0] }
                                      : default_image
                                  }
                                />
                              </View>
                              <View style={styles.locationContent}>
                                <Text style={styles.locationTitle}>
                                  {item.name}
                                </Text>
                                <Text
                                  numberOfLines={2}
                                  ellipsizeMode="tail"
                                  style={styles.locationPlace}
                                >
                                  {item.address}
                                </Text>
                              </View>
                              <View>
                                <Pressable
                                  onPress={() => {
                                    setPlaces((pre) =>
                                      pre.filter((place) => place !== item)
                                    );
                                  }}
                                >
                                  <View>
                                    <IconCircleMinus
                                      size={28}
                                      color={theme.colors.brand.red[500]}
                                    />
                                  </View>
                                </Pressable>
                              </View>
                            </Pressable>
                          )}
                        />
                      </ListItem.Accordion>
                    </View>
                  </View>
                )}
                <View style={styles.ButtonContainer}>
                  <View style={{ width: "45%" }}>
                    <Button
                      onPress={() => setShowTripTemplate(true)}
                      icon={
                        <IconTemplate
                          size={28}
                          color={theme.colors.brand.primary[600]}
                        />
                      }
                      titleStyle={styles.buttonTitle}
                      type="outline"
                      buttonStyle={{ borderWidth: 1 }}
                      radius={999}
                    />
                  </View>
                  <View style={{ width: "45%" }}>
                    <Button
                      onPress={() => handleSubmit()}
                      icon={<IconSquareRoundedPlus size={28} color="white" />}
                      titleStyle={styles.buttonTitle}
                      radius={999}
                    />
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        )}
      </Formik>
      {/* )} */}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  page: {
    flex: 1,
    height: (height * 11) / 12,
    width: "100%",
    backgroundColor: theme.colors.page,
    paddingHorizontal: 20,
  },
  titleContainer: {
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 24,
    paddingVertical: 16,
    fontWeight: "600",
    color: theme.colors.brand.primary[600],
  },
  inputFieldContainer: {
    alignItems: "center",
  },
  buttonTitle: {
    fontSize: 20,
    fontWeight: "500",
  },
  addFriendContainer: {
    marginVertical: 20,
  },
  placeContainer: {
    paddingBottom: 20,
  },
  locationContainer: {
    gap: 20,
  },
  locationInfor: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  locationImageContainer: {
    width: tablet ? 100 : 60,
    aspectRatio: 1,
  },
  locationImage: {
    width: "100%",
    height: "100%",
  },
  locationContent: {
    width: "55%",
    gap: 5,
  },
  locationTitle: {
    fontSize: tablet ? 22 : 15,
    fontWeight: "500",
  },
  locationPlace: {
    fontSize: tablet ? 19 : 12,
    opacity: 0.6,
  },
  locationConectionLineContainer: {
    position: "absolute",
    transform: [{ rotate: "90deg" }, { scale: tablet ? 1.6 : 1 }],
    top: -25,
    left: -11,
  },
  locationConectionLine: {
    fontSize: tablet ? 27 : 26,
    color: theme.colors?.brand?.primary?.[200],
  },
  scale: {
    transform: [{ scale: tablet ? 1.4 : 1 }],
  },
  friendListContainer: {
    borderRadius: 10,
    backgroundColor: "white",
    height: height / 1.6,
    width: (width * 8) / 9,
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
  TripTemplateListBackground: {
    position: "absolute",
    zIndex: 10,
    alignItems: "center",
    width: width,
    height: height,
    backgroundColor: "white",
  },
  TripTemplateListContainer: {
    width: "100%",
  },
  friendFlatList: {
    borderColor: theme.colors.brand.primary[600],
    borderWidth: 0.4,
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 10,
    marginVertical: 5,
  },
  friendCardContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  addButton: {
    alignItems: "center",
    paddingVertical: 5,
  },
  timePickerLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  ButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
}));

export default CreateTrip;

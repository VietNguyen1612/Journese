import {
  Dimensions,
  Pressable,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Button, makeStyles, useTheme } from "@rneui/themed";
import { router, useNavigation } from "expo-router";
import { useAuthStore } from "../../../store";
import { ListCardTrips, Loading } from "../../../components";
import {
  IconCamera,
  IconCameraCheck,
  IconCheck,
  IconFriends,
  IconInfoCircle,
  IconMap,
  IconPhoto,
  IconShieldCheck,
} from "tabler-icons-react-native";
import { FlatList } from "react-native-gesture-handler";
import AnimatedLottieView from "lottie-react-native";
import axios from "axios";
import { useOtherUserProfile } from "../../../api/user";
import { ListUserPosts } from "../../../components/ListPosts/ListUserPosts";
const profile_image = require("../../../assets/images/profile-image.jpeg");
const profile_background = require("../../../assets/images/profile-background.avif");
const JourneseIcon = require(`../../../assets/images/journese-icon.png`);

const { width, height } = Dimensions.get("window");
const tablet = Dimensions.get("window").width > 640 ? true : false;

const TAB = [
  {
    title: "Bài viết",
  },
  {
    title: "Hình ảnh",
    icon: <IconFriends size={26} />,
  },
  {
    title: "Hành trình",
    icon: <IconMap size={26} />,
  },
];

const Profile = () => {
  const { authPayload } = useAuthStore();
  const [tab, setTab] = useState("Bài viết");
  const [modalVisible, setModalVisible] = useState(false);
  const { data, isFetching, refetch } = useOtherUserProfile(
    authPayload?.user._id
  );
  const [verifyImage, setVerifyImage] = useState<string[] | null>(null);
  const [verifyImageChosen, setVerifyImageChosen] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const styles = useStyles();
  const navigation = useNavigation();
  useEffect(() => {
    if (data?.attributes?.citizen_images) {
      setVerifyImage(data.attributes?.citizen_images);
    }
  }, [data]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      refetch();
    });

    return unsubscribe;
  }, [navigation]);

  const pickImage = async (mode: string) => {
    try {
      let result: ImagePicker.ImagePickerResult;
      if (mode == "gallery") {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      } else {
        await ImagePicker.requestCameraPermissionsAsync();
        result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.front,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      }
      if (!result.canceled) {
        let updatedVerifyImage: string[] = [];
        if (verifyImage) updatedVerifyImage = [...verifyImage];
        updatedVerifyImage[verifyImageChosen] = result.assets[0].uri;
        setVerifyImage(updatedVerifyImage);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi chọn ảnh");
      setModalVisible(false);
    }
  };

  const handleSendVerify = async () => {
    if (!verifyImage || !verifyImage[0] || !verifyImage[1]) {
      Alert.alert("Lỗi", "Vui lòng chọn ảnh CCCD và ảnh đại diện");
      return;
    }
    const cloudName = "dagrjsl7q"; // replace with your Cloudinary cloud name
    const uploadPreset = "h2f2kkha"; // replace with your Cloudinary upload preset
    const apiKey = "337788257475731"; // replace with your Cloudinary API key

    const imageUpload1 = {
      uri: verifyImage[0],
      type: `image/${verifyImage[0].split(".").pop()}`,
      name: `verify-image1.${verifyImage[0].split(".").pop()}`,
    };

    const imageUpload2 = {
      uri: verifyImage[1],
      type: `image/${verifyImage[1].split(".").pop()}`,
      name: `verify-image2.${verifyImage[1].split(".").pop()}`,
    };

    setIsLoading(true);

    const formData1 = new FormData();
    formData1.append("file", imageUpload1 as any);
    formData1.append("upload_preset", uploadPreset);
    formData1.append("cloud_name", cloudName);
    formData1.append("api_key", apiKey);

    const formData2 = new FormData();
    formData2.append("file", imageUpload2 as any);
    formData2.append("upload_preset", uploadPreset);
    formData2.append("cloud_name", cloudName);
    formData2.append("api_key", apiKey);

    try {
      const response1 = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData1,
        }
      );

      const response2 = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData2,
        }
      );

      const data1 = await response1.json();
      const data2 = await response2.json();

      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_BACKEND_API}/confirm/create`,
        {
          citizen_images: [data1.secure_url, data2.secure_url],
        },
        {
          headers: {
            "x-client-id": authPayload?.user._id,
            authorization: authPayload?.tokens.accessToken,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error uploading image:", error);
    }
    setIsLoading(false);
    setModalVisible(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {isLoading && (
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
              marginBottom: height / 8,
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
              autoPlay
              loop
            />
          </View>
        </View>
      )}
      <FlatList
        showsVerticalScrollIndicator={false}
        data={[""]}
        renderItem={(item) => (
          <View>
            {/* <BackToPreviousPageButton color="white" /> */}
            <View style={{ height: (height * 5) / 14 }}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.backgroundImageContainer}
              >
                <Image
                  style={styles.backgroundImage}
                  borderBottomLeftRadius={5}
                  borderBottomRightRadius={5}
                  source={profile_background}
                />
              </TouchableOpacity>
              <View style={styles.headerBottomContainer}>
                <View style={styles.avatarContainer}>
                  <View style={styles.avatarCover}>
                    <Image
                      source={
                        authPayload?.user.avatarUrl
                          ? { uri: authPayload?.user.avatarUrl }
                          : profile_image
                      }
                      borderRadius={999}
                      style={{ width: 120, height: 120 }}
                    />
                  </View>
                </View>
                <View style={styles.informationContainer}>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.username}>
                      {authPayload?.user.firstName +
                        " " +
                        authPayload?.user.lastName}
                    </Text>
                  </View>
                  <View
                    style={{
                      marginTop: 16,
                      flexDirection: "row",
                      justifyContent: "space-around",
                      gap: 10,
                    }}
                  >
                    <Button
                      onPress={() =>
                        router.push("/(tabs)/(profile)/edit-profile")
                      }
                      buttonStyle={{ borderRadius: 56 }}
                      containerStyle={{ width: "45%" }}
                      titleStyle={{ fontSize: 16, fontWeight: "500" }}
                      type="outline"
                      title={"Chỉnh sửa thông tin"}
                    />
                    <Button
                      onPress={() =>
                        router.push("/(tabs)/(profile)/create-trip")
                      }
                      buttonStyle={{ borderRadius: 56 }}
                      containerStyle={{ width: "45%" }}
                      titleStyle={{ fontSize: 16, fontWeight: "500" }}
                      type="solid"
                      title={"Tạo hành trình"}
                    />
                  </View>
                </View>
              </View>
            </View>
            {authPayload?.user.isValid ? (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: theme.colors.grey5,
                  marginHorizontal: 14,
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: theme.colors.brand.primary[50],
                  marginBottom: 10,
                  flexDirection: "row",
                  gap: 15,
                  paddingVertical: 16,
                }}
              >
                <IconShieldCheck
                  size={40}
                  color={theme.colors.brand.primary[800]}
                />
                <Text
                  style={{
                    fontWeight: "500",
                    fontSize: 16,
                    color: theme.colors.brand.primary[800],
                  }}
                >
                  Tài khoản đã được xác thực!
                </Text>
              </View>
            ) : (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: theme.colors.grey5,
                  marginHorizontal: 14,
                  borderRadius: 10,
                  alignItems: "center",
                  backgroundColor: theme.colors.brand.primary[50],
                  marginBottom: 10,
                  flexDirection: "row",
                  gap: 15,
                  paddingHorizontal: 20,
                  paddingVertical: 14,
                }}
              >
                <IconShieldCheck
                  size={40}
                  color={theme.colors.brand.primary[800]}
                />
                <View style={{ gap: 3 }}>
                  <Text
                    style={{
                      fontWeight: "500",
                      fontSize: 16,
                      width: (width * 6) / 11,
                    }}
                  >
                    {data?.attributes?.citizen_images &&
                    data?.attributes?.citizen_images.length > 0
                      ? "Đã gửi xác thực"
                      : "Xác thực tài khoản"}
                  </Text>
                  {!(
                    data?.attributes?.citizen_images &&
                    data?.attributes?.citizen_images.length > 0
                  ) && (
                    <Text
                      style={{
                        flexWrap: "wrap",
                        width: (width * 6) / 11,
                        color: theme.colors.grey1,
                        fontSize: 12,
                      }}
                    >
                      Hãy cung cấp ảnh CCCD để xác thực. Giúp tăng cường độ tin
                      cậy và trải nghiệm trực tuyến an toàn.
                    </Text>
                  )}
                </View>
                <View>
                  <Pressable onPress={() => setModalVisible(true)}>
                    <IconCameraCheck
                      color={theme.colors.brand.primary[800]}
                      size={32}
                    />
                  </Pressable>
                </View>
              </View>
            )}
            <View
              style={{
                borderWidth: 1,
                borderBottomWidth: 0,
                borderColor: theme.colors.grey5,
                marginHorizontal: 14,
                borderRadius: 10,
              }}
            >
              <FlatList
                contentContainerStyle={styles.tabFlatListContainer}
                horizontal
                showsHorizontalScrollIndicator={false}
                data={TAB}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => setTab(item.title)}
                    style={{
                      borderBottomColor: theme.colors.brand.primary[500],
                      borderBottomWidth: tab === item.title ? 3 : 0,
                      paddingVertical: 10,
                      width: width / 4,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: 15, fontWeight: "600" }}>
                      {item.title}
                    </Text>
                  </Pressable>
                )}
              />
              <View style={styles.contentContainer}>
                {tab == "Bài viết" && <ListUserPosts />}
                {tab == "Hình ảnh" &&
                  (isFetching ? (
                    <Loading size={150} />
                  ) : (
                    <View style={{ alignItems: "center" }}>
                      {data?.attributes?.images?.length > 0 ? (
                        <FlatList
                          numColumns={2}
                          scrollEnabled={false}
                          contentContainerStyle={{
                            gap: 10,
                            paddingBottom: 20,
                          }}
                          data={[...data?.attributes?.images]}
                          renderItem={({ item, index }) => (
                            <View style={{ paddingHorizontal: 5 }}>
                              <Image
                                style={{
                                  width: width / 2.7,
                                  height: width / 2.7,
                                  borderRadius: 8,
                                }}
                                source={
                                  item
                                    ? { uri: item }
                                    : require("../../../assets/images/default-image.jpeg")
                                }
                              />
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
                              textAlign: "center",
                              fontSize: 22,
                              paddingBottom: 30,
                              fontWeight: "600",
                              color: theme.colors.grey3,
                            }}
                          >
                            Không có hình ảnh!
                          </Text>
                        </View>
                      )}
                    </View>
                  ))}
                {tab == "Hành trình" && (
                  <ListCardTrips
                    scrollEnabled={false}
                    userTrip={true}
                    status="ALL"
                    onPress={(e) =>
                      router.push({
                        pathname: "/(general)/trip-detail",
                        params: { tripId: e._id },
                      })
                    }
                  />
                )}
              </View>
            </View>
          </View>
        )}
      />
      {modalVisible && (
        <Pressable
          style={{
            width: width,
            height: "100%",
            position: "absolute",
            zIndex: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Pressable
            style={{
              position: "absolute",
              width: width,
              height: height,
              backgroundColor: "rgba(30,30,30,0.4)",
            }}
            onPress={() => setModalVisible(false)}
          />
          <View
            style={{
              backgroundColor: "white",
              width: (width * 7) / 8,
              padding: 20,
              paddingVertical: 25,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 8,
            }}
          >
            <View
              style={{
                borderWidth: 1,
                borderColor: theme.colors.grey5,
                marginHorizontal: 14,
                borderRadius: 10,
                alignItems: "center",
                backgroundColor: theme.colors.brand.primary[50],
                marginBottom: 10,
                flexDirection: "row",
                paddingHorizontal: 14,
                paddingVertical: 12,
                gap: 13,
              }}
            >
              <IconInfoCircle
                size={34}
                color={theme.colors.brand.primary[700]}
              />
              <Text
                style={{
                  flexWrap: "wrap",
                  width: (width * 6) / 10,
                  color: theme.colors.grey1,
                  fontSize: 12,
                }}
              >
                Sau khi xác thực, tên tài khoản sẽ được thay đổi theo tên trên
                CCCD và không thể thay đổi.
              </Text>
            </View>
            <FlatList
              horizontal
              scrollEnabled={false}
              contentContainerStyle={{
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
              }}
              data={["Ảnh mặt trước CCCD", "Ảnh chân dung"]}
              renderItem={({ item, index }) => (
                <View>
                  <Text
                    style={{
                      marginBottom: 8,
                      fontSize: 13,
                      color: theme.colors.grey2,
                      fontWeight: "500",
                      textAlign: "center",
                    }}
                  >
                    {item}
                  </Text>
                  <Pressable
                    onPress={() => setVerifyImageChosen(index)}
                    style={{
                      borderRadius: 12,
                      borderWidth: 2.5,
                      padding: 4,
                      borderColor:
                        verifyImageChosen === index
                          ? theme.colors.brand.primary[600]
                          : theme.colors.grey5,
                    }}
                  >
                    <Image
                      style={{
                        width: width / 3,
                        height: width / 3,
                        borderRadius: 8,
                      }}
                      source={
                        verifyImage && verifyImage[index]
                          ? { uri: verifyImage[index] }
                          : require("../../../assets/images/default-image.jpeg")
                      }
                    />
                  </Pressable>
                </View>
              )}
            />

            <View
              style={{
                marginTop: 14,
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <TouchableOpacity
                onPress={() => pickImage("gallery")}
                style={{
                  paddingVertical: 11,
                  paddingHorizontal: 13,
                  backgroundColor: theme.colors.grey5,
                  borderRadius: 8,
                  alignItems: "center",
                  gap: 3,
                }}
              >
                <IconPhoto size={29} color={theme.colors.brand.primary[600]} />
                <Text style={{ fontSize: 12 }}>Thư viện</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => pickImage("camera")}
                style={{
                  paddingVertical: 11,
                  paddingHorizontal: 13,
                  backgroundColor: theme.colors.grey5,
                  borderRadius: 8,
                  alignItems: "center",
                  gap: 3,
                }}
              >
                <IconCamera size={29} color={theme.colors.brand.primary[600]} />
                <Text style={{ fontSize: 12 }}>Máy ảnh</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleSendVerify()}
                style={{
                  paddingVertical: 11,
                  paddingHorizontal: 13,
                  backgroundColor: theme.colors.grey5,
                  borderRadius: 8,
                  alignItems: "center",
                  gap: 3,
                }}
              >
                <IconCheck size={29} color={theme.colors.brand.primary[600]} />
                <Text style={{ fontSize: 12 }}>Xác thực</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      )}
    </View>
  );
};

export default Profile;

const useStyles = makeStyles((theme) => ({
  backgroundImageContainer: {
    height: height / 5,
    width: "100%",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
  },
  headerBottomContainer: {
    height: "30%",
  },
  avatarContainer: {
    height: "40%",
    width: "100%",
    display: "flex",
    alignItems: "center",
  },
  avatarCover: {
    position: "absolute",
    bottom: 0,
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 9999,
  },
  informationContainer: {
    height: "70%",
    alignItems: "center",
    marginTop: 3,
  },
  username: {
    fontSize: 22,
    fontWeight: "600",
  },
  tabFlatListContainer: {
    width: (width * 12) / 13,
    justifyContent: "center",
    marginBottom: 10,
    gap: 10,
    borderBottomWidth: 1.8,
    borderColor: theme.colors.grey5,
    maxHeight: height / 20,
  },
  contentContainer: {
    paddingHorizontal: 12,
  },
}));

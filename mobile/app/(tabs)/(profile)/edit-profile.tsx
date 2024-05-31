import React, { FC, useState } from "react";
import { Button, Image, Text, makeStyles, useTheme } from "@rneui/themed";
import { Alert, Dimensions, Modal, Pressable, View } from "react-native";
import { Loading, SuccessAnimation, TextInput } from "../../../components";
import { router } from "expo-router";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  IconFileCheck,
  IconInfoCircle,
  IconPlus,
  IconX,
} from "tabler-icons-react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useAuthStore } from "../../../store";
import BackToPreviousPageButton from "../../../components/BackToPreviousPageButton/BackToPreviousPageButton";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import * as ImagePicker from "expo-image-picker";
import { updateProfile } from "../../../api/user";
import AnimatedLottieView from "lottie-react-native";
import { uploadImage } from "../../../api/cloudinary";
const tablet = Dimensions.get("window").width > 640 ? true : false;
const { width, height } = Dimensions.get("screen");
const JourneseIcon = require("../../../assets/images/journese-icon.png");

const EditProfile: FC = () => {
  const { theme } = useTheme();
  const { authPayload, setAuthAvatar, setAuthName } = useAuthStore();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const styles = useStyles();

  const pickImage = async (mode: string) => {
    try {
      setIsImageLoading(true);
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
        setAvatar(result.assets[0].uri);
      }
      setIsImageLoading(false);
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi chọn ảnh");
    }
  };

  const handleSave = async (firstName: string, lastName: string) => {
    setIsLoading(true);
    let newAvatar = authPayload?.user.avatarUrl!;
    let newFirstName = firstName;
    let newLastName = lastName;
    if (avatar) {
      newAvatar = await uploadImage(avatar!);
      if (!newAvatar) {
        setIsLoading(false);
        return Alert.alert("Lỗi", "Có lỗi xảy ra khi tải ảnh lên");
      }
    }
    if (newFirstName === "") newFirstName = authPayload?.user.firstName!;
    if (newLastName === "") newLastName = authPayload?.user.lastName!;

    const response = await updateProfile(
      authPayload?.user._id!,
      authPayload?.tokens.accessToken!,
      newAvatar!,
      newFirstName,
      newLastName
    );
    if (response.statusCode === 200) {
      setAuthAvatar(newAvatar);
      setAuthName(newFirstName, newLastName);
      setIsSubmit(true);
      setTimeout(() => {
        setIsSubmit(false);
      }, 2000);
    } else {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi cập nhật thông tin");
    }
    setIsLoading(false);
  };

  return (
    <>
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
              // ]}
              autoPlay
              loop
            />
          </View>
        </View>
      )}
      <Formik
        initialValues={{ firstName: "", lastName: "" }}
        onSubmit={async (values) => {
          const { firstName, lastName } = values;
          handleSave(firstName, lastName);
        }}
        validationSchema={Yup.object().shape({
          firstName: Yup.string().max(20, "Độ dài tối đa là 20 kí tự"),
          lastName: Yup.string().max(20, "Độ dài tối đa là 20 kí tự"),
        })}
      >
        {({ handleChange, handleBlur, handleSubmit, errors, values }) => (
          <View style={styles.page}>
            <BackToPreviousPageButton
              color="black"
              size={36}
              style={{
                top: height / 16,
                left: 5,
              }}
            />
            <Modal visible={isSubmit} transparent={true}>
              <SuccessAnimation
                isSuccess={isSubmit}
                onPress={() => router.back()}
                content="Chỉnh sửa thành công"
              />
            </Modal>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ paddingTop: 60, paddingHorizontal: width / 10 }}>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>Chỉnh sửa thông tin</Text>
                </View>
                {authPayload?.user.isValid ? (
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: theme.colors.grey5,
                      borderRadius: 10,
                      alignItems: "center",
                      backgroundColor: theme.colors.brand.primary[50],
                      marginBottom: 10,
                      flexDirection: "row",
                      paddingHorizontal: 14,
                      paddingVertical: 12,
                      gap: 10,
                    }}
                  >
                    <IconInfoCircle
                      size={34}
                      color={theme.colors.brand.primary[700]}
                    />
                    <Text
                      style={{
                        flexWrap: "wrap",
                        width: "80%",
                        color: theme.colors.grey1,
                        fontSize: 12,
                      }}
                    >
                      Tài khoản của bạn đã được xác thực. Bạn chỉ có thể thay
                      đổi ảnh đại diện
                    </Text>
                  </View>
                ) : (
                  <View style={styles.inputFieldContainer}>
                    <TextInput
                      placeholder="Họ"
                      onChangeText={handleChange("firstName")}
                      errorMessage={errors.firstName}
                    />
                    <TextInput
                      placeholder="Tên"
                      onChangeText={handleChange("lastName")}
                      errorMessage={errors.lastName}
                    />
                  </View>
                )}
                <View style={{ alignItems: "center" }}>
                  <View
                    style={{
                      width: "80%",
                      aspectRatio: 1,
                    }}
                  >
                    <Text
                      style={{
                        marginBottom: 8,
                        fontSize: 18,
                        color: theme.colors.grey2,
                        fontWeight: "500",
                        textAlign: "center",
                      }}
                    >
                      Ảnh đại diện
                    </Text>
                    <View
                      style={{
                        borderRadius: 12,
                        borderWidth: 2.5,
                        padding: 4,
                        borderColor: theme.colors.brand.primary[200],
                        borderStyle: "dashed",
                      }}
                    >
                      {avatar ? (
                        <>
                          <Pressable
                            style={{
                              position: "absolute",
                              top: -5,
                              right: -5,
                              zIndex: 10,
                              backgroundColor: theme.colors.grey4,
                              opacity: 0.8,
                              borderRadius: 999,
                              padding: 4,
                            }}
                            onPress={() => setAvatar(null)}
                          >
                            <IconX size={22} />
                          </Pressable>
                          <Image
                            style={{
                              width: "100%",
                              height: "100%",
                              borderRadius: 8,
                            }}
                            source={{ uri: avatar }}
                          />
                        </>
                      ) : (
                        <TouchableOpacity
                          onPress={() => pickImage("gallery")}
                          style={{
                            width: "100%",
                            height: "100%",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {isImageLoading ? (
                            <Loading size={200} />
                          ) : (
                            <IconPlus
                              size={50}
                              color={theme.colors.brand.primary[500]}
                            />
                          )}
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
                <View style={styles.ButtonContainer}>
                  <View style={{ width: "40%" }}>
                    <Button
                      disabled={
                        !avatar &&
                        values.firstName === "" &&
                        values.lastName === ""
                      }
                      title="Lưu"
                      onPress={() => handleSubmit()}
                      icon={<IconFileCheck size={25} color="white" />}
                      titleStyle={styles.buttonTitle}
                      buttonStyle={{
                        gap: 6,
                      }}
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
    marginTop: 10,
  },
  buttonTitle: {
    fontSize: 17,
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
    marginTop: 50,
    justifyContent: "center",
    alignItems: "center",
  },
}));

export default EditProfile;

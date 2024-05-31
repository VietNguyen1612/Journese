import { Button, Image, Text, makeStyles, useTheme } from "@rneui/themed";
import * as ImagePicker from "expo-image-picker";
import { Formik } from "formik";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";
import { IconPhotoPlus, IconX } from "tabler-icons-react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useAuthStore } from "../../../store";
import { Loading, SuccessAnimation } from "../../../components";
import AnimatedLottieView from "lottie-react-native";
import { uploadImage } from "../../../api/cloudinary";
import { createPost } from "../../../api/post";
import { router } from "expo-router";
const { width, height } = Dimensions.get("window");
const profile_image = require("../../../assets/images/profile-image.jpeg");
const JourneseIcon = require(`../../../assets/images/journese-icon.png`);

const CreatePost = () => {
  const styles = useStyles();
  const [imageList, setImageList] = useState<string[]>([]);
  const { theme } = useTheme();
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);
  const { authPayload } = useAuthStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFail, setIsFail] = useState(false);

  const handleAddImage = (image: string) => {
    if (!imageList.includes(image)) setImageList((pre) => [...pre, image]);
  };
  const handleRemoveImage = (image: string) => {
    const newImageList = imageList.filter((item) => item !== image);
    setImageList(newImageList);
  };

  const pickImage = async (mode: string) => {
    try {
      setIsImageLoading(true);
      let result: ImagePicker.ImagePickerResult;
      if (mode == "gallery") {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        result = await ImagePicker.launchImageLibraryAsync({
          selectionLimit: 10,
          allowsMultipleSelection: true,
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
        setImageList(result.assets.map((item) => item.uri));
      }
      setIsImageLoading(false);
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi chọn ảnh");
    }
  };

  const handCreatePost = async (content: string) => {
    setLoading(true);
    try {
      const listImage = await Promise.all(
        imageList.map(async (item) => {
          const image = await uploadImage(item);
          return image;
        })
      );
      const response = await createPost(
        authPayload?.user._id!,
        authPayload?.tokens.accessToken!,
        content,
        listImage
      );
      console.log(response);

      if (response.statusCode !== 201) throw new Error("Có lỗi xảy ra");
      setLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
      }, 2000);
    } catch (error) {
      setLoading(false);
      setIsFail(true);
      setTimeout(() => {
        setIsFail(false);
      }, 2000);
    }
  };

  return (
    <>
      {loading && (
        <View
          style={{
            height: height,
            width: width,
            position: "absolute",
            justifyContent: "center",
            backgroundColor: "rgba(40,40,40,0.6)",
            alignItems: "center",
            zIndex: 20,
            paddingBottom: height / 5,
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
              // colorFilters={[
              //   { color: "#9edda5", keypath: "Dot4" },
              //   { color: "#9edda5", keypath: "Dot3" },
              //   { color: "#9edda5", keypath: "Dot2" },
              //   { color: "#9edda5", keypath: "Dot1" },
              // ]}
              autoPlay
              loop
            />
          </View>
        </View>
      )}
      <Modal transparent={true} visible={isSuccess}>
        <SuccessAnimation
          isSuccess={true}
          onPress={() => setIsSuccess(false)}
          content="Đăng thành công"
        />
      </Modal>
      <Modal transparent={true} visible={isFail}>
        <SuccessAnimation
          isSuccess={false}
          onPress={() => setIsFail(false)}
          content="Đăng thất bại"
        />
      </Modal>
      <ScrollView
        style={{ backgroundColor: "white" }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.titleWrapper}>
            <Image
              style={{
                width: 50,
                height: 50,
                borderRadius: 999,
                borderWidth: 0.3,
                borderColor: theme.colors.grey4,
              }}
              source={
                authPayload?.user.avatarUrl
                  ? { uri: authPayload?.user.avatarUrl }
                  : profile_image
              }
            />
            <Text style={{ fontSize: 20, fontWeight: "500", marginBottom: 2 }}>
              {authPayload?.user.firstName} {authPayload?.user.lastName}
            </Text>
          </View>
          <Formik
            initialValues={{ content: "" }}
            onSubmit={async (values) => {
              await handCreatePost(values.content);
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <View>
                <View style={styles.contentContainer}>
                  <TextInput
                    placeholder="Nội dung..."
                    style={{ fontSize: 17, height: "auto" }}
                    onChangeText={handleChange("content")}
                    multiline
                    scrollEnabled={false}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "600",
                    paddingHorizontal: 24,
                    marginBottom: 10,
                  }}
                >
                  Ảnh
                </Text>
                {isImageLoading ? (
                  <Loading size={150} />
                ) : imageList.length === 0 ? (
                  <View style={styles.imgUploadContainer}>
                    <TouchableOpacity
                      onPress={() => pickImage("gallery")}
                      style={styles.imgUpload}
                    >
                      <IconPhotoPlus
                        color={theme.colors.brand.primary[600]}
                        size={50}
                      />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <FlatList
                    data={imageList}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 6, paddingBottom: 20 }}
                    ListHeaderComponent={() => <View style={{ width: 12 }} />}
                    ListFooterComponent={() => <View style={{ width: 4 }} />}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <Pressable
                        onPress={() => pickImage("gallery")}
                        style={{
                          width: width / 2.3,
                          aspectRatio: 1,
                          borderRadius: 10,
                          overflow: "hidden",
                        }}
                      >
                        <Image
                          source={{ uri: item }}
                          style={{ width: "100%", height: "100%" }}
                        />
                        <TouchableOpacity
                          onPress={() => handleRemoveImage(item)}
                          style={{
                            position: "absolute",
                            top: 5,
                            right: 5,
                            backgroundColor: "rgba(0,0,0,0.5)",
                            padding: 5,
                            borderRadius: 999,
                          }}
                        >
                          <IconX size={20} color="white" />
                        </TouchableOpacity>
                      </Pressable>
                    )}
                  />
                )}
                <View style={{ paddingHorizontal: 24 }}>
                  <Button
                    onPress={() => handleSubmit()}
                    title="Đăng bài"
                    titleStyle={{ fontWeight: "600" }}
                    disabled={values.content === "" || imageList.length === 0}
                    radius={999}
                  />
                </View>
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
    </>
  );
};

export default CreatePost;

const useStyles = makeStyles((theme) => ({
  container: {
    paddingBottom: 50,
  },
  titleWrapper: {
    paddingHorizontal: 24,
    width: "100%",
    paddingVertical: 25,
    paddingBottom: 10,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  contentContainer: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  imgUploadContainer: {
    paddingBottom: 20,
    gap: 10,
    paddingHorizontal: 24,
  },
  imgUpload: {
    width: "50%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderStyle: "dashed",
    borderWidth: 2.5,
    borderRadius: 10,
    borderColor: theme.colors.brand.primary[500],
  },
}));

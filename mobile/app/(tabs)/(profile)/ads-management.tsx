import {
  Avatar,
  Button,
  ButtonGroup,
  Card,
  Image,
  Text,
  makeStyles,
  useTheme,
} from "@rneui/themed";
import { router, useNavigation } from "expo-router";
import { FC, useEffect, useLayoutEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Modal,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import LottieView from "lottie-react-native";
import { ListAds, LoadingScreen, SuccessAnimation } from "../../../components";
import { Pressable } from "react-native";
import {
  IconCamera,
  IconCheck,
  IconInfoCircle,
  IconPhoto,
  IconPlus,
} from "tabler-icons-react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuthStore } from "../../../store";
import axios from "axios";
const { width, height } = Dimensions.get("window");

const AdsManagement: FC = (/* Data của user */) => {
  const styles = useStyles();
  const { authPayload } = useAuthStore();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [verifyImage, setVerifyImage] = useState<string | null>(null);
  const [isFail, setIsFail] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => setModalVisible((pre) => !pre)}>
          <IconPlus />
        </Pressable>
      ),
    });
  }, [authPayload]);

  const pickImage = async (mode: string) => {
    try {
      let result: ImagePicker.ImagePickerResult;
      {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      }
      if (!result.canceled) {
        if (!result.canceled) {
          setVerifyImage(result.assets[0].uri);
        }
      }
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi chọn ảnh");
      setModalVisible(false);
    }
  };
  const handleCreateAds = async () => {
    setLoading(true);
    const cloudName = "dagrjsl7q"; // replace with your Cloudinary cloud name
    const uploadPreset = "h2f2kkha"; // replace with your Cloudinary upload preset
    const apiKey = "337788257475731"; // replace with your Cloudinary API key
    const imageUpload = {
      uri: verifyImage,
      type: `image/${verifyImage?.split(".").pop()}`,
      name: `verify-image.${verifyImage?.split(".").pop()}`,
    };
    const formData = new FormData();
    formData.append("file", imageUpload as any);
    formData.append("upload_preset", uploadPreset);
    formData.append("cloud_name", cloudName);
    formData.append("api_key", apiKey);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_BACKEND_API}/ads/create`,
        {
          image: data.secure_url,
        },
        {
          headers: {
            "x-client-id": authPayload?.user._id,
            authorization: authPayload?.tokens.accessToken,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.statusCode !== 201) {
        setIsFail(true);
      } else {
        setModalVisible(false);
        setIsSuccess(true);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
    setLoading(false);
  };
  return (
    <>
      {loading ? (
        <Modal transparent={true} visible={loading}>
          <LoadingScreen />
        </Modal>
      ) : (
        <View
          style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}
        >
          <ButtonGroup
            containerStyle={styles.buttonContainer}
            innerBorderStyle={{ width: 0 }}
            buttonStyle={{ paddingHorizontal: 3 }}
            textStyle={styles.buttonTextStyle}
            buttons={["Đã tạo", "Đã duyệt", "Đã thanh toán", "Hết hạn"]}
            selectedIndex={selectedIndex}
            onPress={(value) => {
              setSelectedIndex(value);
            }}
          />
          <View
            style={{
              paddingHorizontal: 10,
              marginBottom: height / 13,
              width: width,
            }}
          >
            <Modal transparent={true} visible={isFail}>
              <SuccessAnimation
                isSuccess={false}
                content="Tạo thất bại"
                onPress={() => setIsFail(false)}
              />
            </Modal>
            <Modal transparent={true} visible={isSuccess}>
              <SuccessAnimation
                isSuccess={true}
                content="Tạo thành công"
                onPress={() => setIsSuccess(false)}
              />
            </Modal>
            {selectedIndex == 0 && (
              <ListAds isExpired={false} isPaid={false} isValid={false} />
            )}

            {selectedIndex == 1 && (
              <ListAds isExpired={false} isPaid={false} isValid={true} />
            )}
            {selectedIndex == 2 && (
              <ListAds isExpired={false} isPaid={true} isValid={true} />
            )}
            {selectedIndex == 3 && (
              <ListAds isExpired={true} isPaid={true} isValid={true} />
            )}
          </View>
          {modalVisible && (
            <View
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
                  width: (width * 6) / 7,
                  padding: 20,
                  paddingVertical: 25,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    paddingBottom: 10,
                    fontSize: 18,
                    fontWeight: "500",
                    color: theme.colors.brand.primary[600],
                  }}
                >
                  Tạo quảng cáo
                </Text>

                <View
                  style={{
                    borderRadius: 12,
                    borderWidth: 1,
                    padding: 4,
                    borderColor: theme.colors.grey5,
                  }}
                >
                  <Image
                    style={{
                      width: 220,
                      height: 220,
                      borderRadius: 8,
                    }}
                    source={
                      verifyImage
                        ? { uri: verifyImage }
                        : require("../../../assets/images/default-image.jpeg")
                    }
                  />
                </View>

                <View
                  style={{
                    marginTop: 14,
                    width: "80%",
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <Pressable
                    onPress={() => pickImage("gallery")}
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 10,
                      backgroundColor: theme.colors.grey5,
                      borderRadius: 8,
                      alignItems: "center",
                      gap: 3,
                      width: width / 5,
                    }}
                  >
                    <IconPhoto
                      size={30}
                      color={theme.colors.brand.primary[600]}
                    />
                    <Text style={{ fontSize: 13 }}>Thư viện</Text>
                  </Pressable>
                  <Pressable
                    disabled={!verifyImage}
                    onPress={() => handleCreateAds()}
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 10,
                      backgroundColor: verifyImage
                        ? theme.colors.grey5
                        : theme.colors.brand.neutral[200],
                      borderRadius: 8,
                      alignItems: "center",
                      gap: 3,
                      width: width / 5,
                    }}
                  >
                    <IconPlus
                      size={30}
                      color={
                        verifyImage
                          ? theme.colors.brand.primary[600]
                          : theme.colors.grey2
                      }
                    />
                    <Text style={{ fontSize: 13 }}>Tạo</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
        </View>
      )}
    </>
  );
};

export default AdsManagement;

const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    height: 40,
    width: (width * 11) / 12,
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.brand.primary[600],
    borderRadius: 999,
    marginVertical: 14,
  },
  buttonTextStyle: {
    fontSize: 13,
    textAlign: "center",
  },
}));

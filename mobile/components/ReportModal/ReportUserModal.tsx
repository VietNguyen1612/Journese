import {
  Alert,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Image, useTheme, Input } from "@rneui/themed";
import { TouchableOpacity } from "react-native-gesture-handler";
import { IconCamera, IconCheck, IconPhoto } from "tabler-icons-react-native";
import { useAuthStore } from "../../store";
import axios from "axios";
import { uploadImage } from "../../api/cloudinary";
import AnimatedLottieView from "lottie-react-native";
const { height, width } = Dimensions.get("window");

const ReportUserModal = (props: any) => {
  const { authPayload } = useAuthStore();
  const { userId, reportUserDialog, setReportUserDialog } = props;
  const [verifyImage, setVerifyImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [value, onChangeText] = React.useState("");
  const { theme } = useTheme();
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
        setVerifyImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi chọn ảnh");
      setReportUserDialog(false);
    }
  };

  const handleSendReport = async () => {
    setIsLoading(true);
    if (!value || !verifyImage) {
      Alert.alert("Thông báo", "Hãy nhập đầy đủ nội dung");
      return;
    }
    const newVerifyImage = await uploadImage(verifyImage);
    if (newVerifyImage) {
      const reportData = {
        type: "User",
        targetEntityId: userId,
        details: value,
        images: [newVerifyImage],
      };

      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_BACKEND_API}/report`,
        reportData,
        {
          headers: {
            "x-client-id": authPayload?.user._id,
            authorization: authPayload?.tokens.accessToken,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data["statusCode"] == 200) {
        setReportUserDialog(false);
        Alert.alert("Thông báo", "Báo cáo đã được gửi");
      } else {
        Alert.alert("Lỗi", "Có lỗi xảy ra");
      }
    } else {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi tải ảnh!");
    }
    setIsLoading(false);
  };
  return (
    <Modal transparent={true} visible={reportUserDialog}>
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
              marginBottom: height / 20,
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
                source={require("../../assets/images/journese-icon.png")}
                style={{ width: "100%", height: "100%", resizeMode: "contain" }}
              />
            </View>
            <AnimatedLottieView
              source={require("../../assets/lotties/loading_animation.json")}
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
            width: width,
            height: "100%",
            position: "absolute",
            zIndex: 0,
            backgroundColor: "rgba(30,30,30,0.4)",
          }}
          onPress={() => setReportUserDialog(false)}
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
          <Input
            label="Nội dung"
            labelStyle={{
              paddingBottom: 5,
            }}
            style={{
              borderColor: theme.colors.grey3,
              height: 80,
              borderWidth: 0.2,
              fontSize: 15,
              width: "80%",
              borderRadius: 8,
              paddingHorizontal: 10,
              paddingVertical: 5,
              marginBottom: 20, // Add some margin at the bottom for spacing
            }}
            onChangeText={(text) => onChangeText(text)}
            value={value}
            multiline
            maxLength={100}
          />

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
                width: 180,
                height: 180,
                borderRadius: 8,
              }}
              source={
                verifyImage
                  ? { uri: verifyImage }
                  : require("../../assets/images/default-image.jpeg")
              }
            />
          </View>

          <View
            style={{
              marginTop: 14,
              width: "100%",
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
              }}
            >
              <IconPhoto size={30} color={theme.colors.brand.primary[600]} />
              <Text style={{ fontSize: 13 }}>Thư viện</Text>
            </Pressable>
            <Pressable
              onPress={() => handleSendReport()}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 10,
                backgroundColor: theme.colors.grey5,
                borderRadius: 8,
                alignItems: "center",
                gap: 3,
              }}
            >
              <IconCheck size={30} color={theme.colors.brand.primary[600]} />
              <Text style={{ fontSize: 13 }}>Xác thực</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ReportUserModal;

const styles = StyleSheet.create({});

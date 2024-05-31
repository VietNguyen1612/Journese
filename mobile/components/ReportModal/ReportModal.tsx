import { Alert, Dimensions, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import * as ImagePicker from "expo-image-picker";
import { Image, useTheme, Input } from '@rneui/themed';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { IconCamera, IconCheck, IconPhoto } from 'tabler-icons-react-native';
import { useAuthStore } from '../../store';
import axios from 'axios';
const { height, width } = Dimensions.get("window");
const ReportModal = (props: any) => {
    const { authPayload } = useAuthStore()
    const { tripId, reportTripDialog, setReportTripDialog } = props
    const [verifyImage, setVerifyImage] = useState<string | null>(null);
    const [value, onChangeText] = React.useState('');
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
            setReportTripDialog(false);
        }
    };

    const handleSendReport = async () => {
        if (!value || !verifyImage) {
            Alert.alert("Thông báo", "Hãy nhập đầy đủ nội dung");
            return;
        }
        const reportData = {
            type: "Trip",
            targetEntityId: tripId, // Replace with your target entity ID
            details: value, // This is the text from the TextInput
            images: [verifyImage], // This is the image URI from the ImagePicker
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

        if (res.data['statusCode'] == 200) {
            setReportTripDialog(false);
            Alert.alert("Thông báo", "Báo cáo đã được gửi");
        } else {
            Alert.alert("Lỗi", "Có lỗi xảy ra");
        }


    };
    return (
        <Pressable
            style={{
                width: width,
                height: "100%",
                position: "absolute",
                zIndex: 10,
                backgroundColor: "rgba(30,30,30,0.4)",
                alignItems: "center",
                justifyContent: "center",
            }}
            onPress={() => setReportTripDialog(false)}
        >
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
                    style={{
                        borderColor: 'gray',
                        borderWidth: 1,
                        width: '80%',
                        borderRadius: 8,
                        paddingHorizontal: 10,
                        marginBottom: 20, // Add some margin at the bottom for spacing
                    }}
                    onChangeText={text => onChangeText(text)}
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
        </Pressable>
    )
}

export default ReportModal

const styles = StyleSheet.create({})